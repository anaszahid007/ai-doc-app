from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.DTOs.request import ChatRequest
from app.services.ai_service import get_embedding, get_chat_response
from app.services.vector_store import search_chunks
from app.core.database import get_db
from app.models.schema import Message
import os

router = APIRouter()

@router.post("/")
async def chat(req: ChatRequest, db: Session = Depends(get_db)):
    # Check if GEMINI_API_KEY is set and not empty
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key or gemini_key.strip() == "":
        raise HTTPException(
            status_code=503, 
            detail="AI service is not configured. Please set GEMINI_API_KEY environment variable."
        )
    
    if not req.document_id:
        raise HTTPException(status_code=400, detail="document_id is required")

    # 1. Embed the question
    question_embedding = await get_embedding(req.question)

    # 2. Search for relevant chunks in DB
    relevant_chunks = search_chunks(db, req.document_id, question_embedding, k=5)
    
    if not relevant_chunks:
        raise HTTPException(status_code=404, detail="No relevant content found in the document")
    
    context = "\n\n".join(relevant_chunks)

    # 3. Generate response with Gemini
    answer = await get_chat_response(req.question, context)

    # 4. Store messages if conversation_id is provided
    if req.conversation_id:
        user_msg = Message(conversation_id=req.conversation_id, role="user", content=req.question)
        assistant_msg = Message(conversation_id=req.conversation_id, role="assistant", content=answer)
        db.add(user_msg)
        db.add(assistant_msg)
        db.commit()

    return {
        "question": req.question,
        "answer": answer,
        "document_id": req.document_id,
        "conversation_id": req.conversation_id
    }