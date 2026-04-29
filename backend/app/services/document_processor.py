import pdfplumber
import io
import uuid
from app.services.ai_service import get_embedding
from app.services.vector_store import get_store

async def process_document(file_bytes: bytes):
    # 1. Extract Text
    text = extract_text(file_bytes)
    
    # 2. Chunk Text
    chunks = chunk_text(text)
    
    # 3. Generate Embeddings for each chunk
    # (Note: In production, you'd batch these or run them in parallel)
    embeddings = []
    for chunk in chunks:
        emb = await get_embedding(chunk)
        embeddings.append(emb)
    
    # 4. Store in Vector DB
    doc_id = str(uuid.uuid4())
    store = get_store(doc_id)
    store.add_chunks(chunks, embeddings)
    
    return {
        "document_id": doc_id,
        "text_length": len(text),
        "chunks": len(chunks)
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