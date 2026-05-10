from sqlalchemy.orm import Session
from app.models.schema import DocumentChunk
from typing import List

def search_chunks(db: Session, document_id: str, query_embedding: List[float], k: int = 5) -> List[str]:
    """
    Search for similar document chunks using pgvector L2 distance.
    """
    results = db.query(DocumentChunk).filter(
        DocumentChunk.document_id == document_id
    ).order_by(
        DocumentChunk.embedding.l2_distance(query_embedding)
    ).limit(k).all()
    
    return [chunk.content for chunk in results]
