from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import upload, chat, health, websocket, auth, conversations

from app.core.database import Base, engine
import app.models.schema  # Ensure models are registered


app = FastAPI(title="AI Doc Chat API")

# Create tables
Base.metadata.create_all(bind=engine)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(conversations.router, prefix="/conversations", tags=["Conversations"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(websocket.router, tags=["WebSocket"])