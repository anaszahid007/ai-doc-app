from fastapi import APIRouter, HTTPException
from app.models.request import ChatRequest
from app.services.ai_service import get_embedding, get_chat_response
from app.services.vector_store import get_store

router = APIRouter()

@router.post("/")
async def chat(req: ChatRequest):
    if not req.document_id:
        # For simplicity, if no ID is provided, try to find the last uploaded one 
        # but in this demo we'll just require it.
        raise HTTPException(status_code=400, detail="document_id is required")

    # 1. Get the store for this document
    store = get_store(req.document_id)
    if not store.chunks:
        raise HTTPException(status_code=404, detail="Document not found or has no content")

    # 2. Embed the question
    question_embedding = await get_embedding(req.question)

    # 3. Search for relevant chunks
    relevant_chunks = store.search(question_embedding, k=5)
    context = "\n\n".join(relevant_chunks)

    # 4. Generate response with Gemini
    answer = await get_chat_response(req.question, context)

    return {
        "question": req.question,
        "answer": answer,
        "document_id": req.document_id
    }