from fastapi import APIRouter, UploadFile, File
from app.services.document_processor import process_document

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    result = await process_document(content)
    return {
        "message": "File processed",
        "data": result
    }