import faiss
import numpy as np
from typing import List, Dict

# Global storage for demo purposes
STORE: Dict[str, 'VectorStore'] = {}

class VectorStore:
    def __init__(self):
        self.dimension = None
        self.index = None
        self.chunks = []

    def add_chunks(self, chunks: List[str], embeddings: List[List[float]]):
        if not embeddings:
            return
            
        embeddings_np = np.array(embeddings).astype('float32')
        
        if self.index is None:
            self.dimension = embeddings_np.shape[1]
            self.index = faiss.IndexFlatL2(self.dimension)
            
        self.chunks.extend(chunks)
        self.index.add(embeddings_np)

    def search(self, query_embedding: List[float], k: int = 3) -> List[str]:
        if self.index is None:
            return []
            
        query_np = np.array([query_embedding]).astype('float32')
        distances, indices = self.index.search(query_np, k)
        
        results = []
        for idx in indices[0]:
            if idx != -1 and idx < len(self.chunks):
                results.append(self.chunks[idx])
        return results

def get_store(doc_id: str) -> VectorStore:
    if doc_id not in STORE:
        STORE[doc_id] = VectorStore()
    return STORE[doc_id]
