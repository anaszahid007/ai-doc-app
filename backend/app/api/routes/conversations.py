from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.schema import Conversation, Message, User
from pydantic import BaseModel
from typing import List
import uuid

router = APIRouter()

class ConversationCreate(BaseModel):
    document_id: str
    title: str | None = "Chat about document"

class MessageResponse(BaseModel):
    role: str
    content: str
    created_at: str

@router.post("/")
def create_conversation(
    conv_in: ConversationCreate, 
    db: Session = Depends(get_db)
):
    new_conv = Conversation(
        id=uuid.uuid4(),
        # user_id=current_user.id,  # Temporarily disabled until auth is working
        document_id=conv_in.document_id,
        title=conv_in.title
    )
    db.add(new_conv)
    db.commit()
    db.refresh(new_conv)
    return new_conv

@router.get("/")
def list_conversations(
    db: Session = Depends(get_db)
):
    return db.query(Conversation).all()  # Temporarily return all conversations

@router.get("/{conversation_id}/messages")
def get_messages(
    conversation_id: str, 
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()
    
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
    return messages
