import pdfplumber
import io
import uuid
from sqlalchemy.orm import Session
from app.services.ai_service import get_embedding
from app.models.schema import Document, DocumentChunk

async def process_document(db: Session, file_bytes: bytes, file_name: str, user_id: str = None):
    # 1. Extract Text
    text = extract_text(file_bytes)
    
    # 2. Chunk Text
    chunks = chunk_text(text)
    
    # 3. Create Document Entry
    doc = Document(
        id=uuid.uuid4(),
        user_id=user_id,
        file_name=file_name,
        file_size=len(file_bytes)
    )
    db.add(doc)
    db.flush() # Get the doc id
    
    # 4. Generate Embeddings and create chunks
    for i, chunk_content in enumerate(chunks):
        embedding = await get_embedding(chunk_content)
        chunk = DocumentChunk(
            document_id=doc.id,
            content=chunk_content,
            embedding=embedding,
            chunk_index=i
        )
        db.add(chunk)
    
    db.commit()
    
    return {
        "document_id": str(doc.id),
        "text_length": len(text),
        "chunks_count": len(chunks)
    }

def extract_text(file_bytes: bytes):
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def chunk_text(text, chunk_size=500):
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i+chunk_size])
        if chunk.strip():
            chunks.append(chunk)

    return chunks