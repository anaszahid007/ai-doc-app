import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.services.ai_service import get_embedding, stream_chat_response
from app.services.vector_store import search_chunks
from app.core.database import SessionLocal
from app.models.schema import Message
import os

router = APIRouter()

@router.websocket("/ws/chat/{doc_id}")
async def websocket_endpoint(websocket: WebSocket, doc_id: str):
    await websocket.accept()
    db = SessionLocal()
    
    try:
        # Check if GEMINI_API_KEY is set and not empty
        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key or gemini_key.strip() == "":
            await websocket.send_text(json.dumps({
                "error": "AI service is not configured. Please set GEMINI_API_KEY environment variable.",
                "document_id": doc_id
            }))
            await websocket.close()
            return
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            question = message_data.get("question")
            conv_id = message_data.get("conversation_id")
            
            if not question:
                continue

            try:
                # 1. Embed Question
                question_embedding = await get_embedding(question)
                
                # 2. Search for relevant chunks
                relevant_chunks = search_chunks(db, doc_id, question_embedding, k=5)
                context = "\n\n".join(relevant_chunks)
                
                # 3. Stream Response back to client
                full_answer = ""
                async for chunk in stream_chat_response(question, context):
                    full_answer += chunk
                    await websocket.send_text(json.dumps({
                        "question": question,
                        "chunk": chunk,
                        "answer": full_answer,
                        "document_id": doc_id,
                        "is_complete": False
                    }))
                
                # 4. Save to DB if conversation exists
                if conv_id:
                    user_msg = Message(conversation_id=conv_id, role="user", content=question)
                    assistant_msg = Message(conversation_id=conv_id, role="assistant", content=full_answer)
                    db.add_user_msg = user_msg
                    db.add(user_msg)
                    db.add(assistant_msg)
                    db.commit()

                # Final complete message
                await websocket.send_text(json.dumps({
                    "question": question,
                    "answer": full_answer,
                    "document_id": doc_id,
                    "conversation_id": conv_id,
                    "is_complete": True
                }))

            except Exception as e:
                import traceback
                print(f"Error processing message for {doc_id}:")
                traceback.print_exc()
                await websocket.send_text(json.dumps({
                    "error": f"Error processing message: {str(e)}"
                }))

    except WebSocketDisconnect:
        print(f"Client disconnected from chat: {doc_id}")
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
    finally:
        db.close()
