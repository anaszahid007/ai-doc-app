from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.document_processor import process_document
from app.core.database import get_db
import os

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Check if GEMINI_API_KEY is set and not empty
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key or gemini_key.strip() == "":
        raise HTTPException(
            status_code=503, 
            detail="AI service is not configured. Please set GEMINI_API_KEY environment variable."
        )
    
    content = await file.read()
    # For now, using None for user_id until auth is implemented
    result = await process_document(db, content, file.filename)
    return {
        "message": "File processed and stored",
        "data": result
    }