import os
import httpx
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-flash-latest")
GENERATE_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent"
STREAM_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:streamGenerateContent"
EMBED_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent"

async def get_embedding(text: str):
    payload = {
        "model": "models/gemini-embedding-001",
        "content": {
            "parts": [{"text": text}]
        }
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{EMBED_URL}?key={GEMINI_API_KEY}",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code != 200:
            raise Exception(f"Gemini Embedding error: {response.text}")
            
        return response.json()['embedding']['values']

async def stream_chat_response(question: str, context: str = ""):
    prompt = f"""
    You are an AI assistant helping a user with their document. 
    Use the provided context to answer the question as accurately as possible.
    If the answer is not in the context, say that you don't know based on the document.
    
    Context:
    {context}
    
    Question: {question}
    
    Answer:
    """
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    # Use alt=sse for much easier parsing
    url = f"{STREAM_URL}?key={GEMINI_API_KEY}&alt=sse"
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        async with client.stream(
            "POST",
            url,
            json=payload,
            headers={"Content-Type": "application/json"}
        ) as response:
            if response.status_code != 200:
                error_body = await response.aread()
                print(f"Gemini Streaming Error ({response.status_code}): {error_body.decode()}")
                raise Exception(f"Gemini Streaming error: {error_body.decode()}")
            
            async for line in response.aiter_lines():
                if not line or not line.startswith("data: "):
                    continue
                
                # Extract the JSON part after "data: "
                data_str = line[len("data: "):].strip()
                if not data_str:
                    continue
                    
                try:
                    data = json.loads(data_str)
                    if 'candidates' in data and data['candidates']:
                        candidate = data['candidates'][0]
                        if 'content' in candidate and 'parts' in candidate['content']:
                            text = candidate['content']['parts'][0].get('text', '')
                            if text:
                                yield text
                except Exception as e:
                    # Some lines might be incomplete or metadata
                    continue

async def get_chat_response(question: str, context: str = ""):
    prompt = f"""
    You are an AI assistant helping a user with their document. 
    Use the provided context to answer the question as accurately as possible.
    If the answer is not in the context, say that you don't know based on the document.
    
    Context:
    {context}
    
    Question: {question}
    
    Answer:
    """
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{GENERATE_URL}?key={GEMINI_API_KEY}",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code != 200:
            raise Exception(f"Gemini API error: {response.text}")
            
        data = response.json()
        try:
            return data['candidates'][0]['content']['parts'][0]['text']
        except (KeyError, IndexError):
            return "Sorry, I couldn't generate a response."
