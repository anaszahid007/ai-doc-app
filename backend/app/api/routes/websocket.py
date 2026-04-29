import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.ai_service import get_embedding, stream_chat_response
from app.services.vector_store import get_store

router = APIRouter()

@router.websocket("/ws/chat/{doc_id}")
async def websocket_endpoint(websocket: WebSocket, doc_id: str):
    await websocket.accept()
    
    try:
        # Check if store exists
        store = get_store(doc_id)
        if not store.chunks:
            await websocket.send_text(json.dumps({
                "error": "Document not found or has no content. Please upload first."
            }))
            await websocket.close()
            return

        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            question = message_data.get("question")
            
            if not question:
                continue

            try:
                # 1. Embed Question
                question_embedding = await get_embedding(question)
                
                # 2. Search for relevant chunks
                relevant_chunks = store.search(question_embedding, k=5)
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
                
                # Final complete message
                await websocket.send_text(json.dumps({
                    "question": question,
                    "answer": full_answer,
                    "document_id": doc_id,
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
