# 📄 Doc Chat | Intelligent Document Mastery

**Doc Chat** is a premium, real-time RAG (Retrieval-Augmented Generation) platform that transforms your static PDF documents into dynamic conversation partners. Built with PostgreSQL, pgvector, and Google Gemini, it offers industry-standard persistence, security, and document intelligence.

---

## ✨ Key Features

- 🚀 **Real-Time Streaming**: Watch as the AI generates responses word-by-word using high-performance WebSockets.
- 🔐 **Authentication**: Secure JWT-based user accounts with password hashing (bcrypt).
- 📂 **Multi-Document Management**: Upload multiple documents and maintain separate conversation histories for each.
- 🧠 **Vector Search (pgvector)**: High-performance similarity search directly in your SQL database for grounded, accurate RAG.
- 🌌 **Premium UI/UX**: Immersive dark-themed landing and auth pages transitioning into a clean, professional workspace.
- 🔒 **Privacy & Persistence**: Your documents and chats are safely stored in a relational database.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [pgvector](https://github.com/pgvector/pgvector)
- **ORM**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/) (1.5 Flash & Embeddings)
- **Auth**: JWT (JSON Web Tokens) & Passlib (Bcrypt)

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **State Management**: React Hooks & LocalStorage for JWT

---

## 🚀 Getting Started

### Method 1: Docker (Recommended)

1. **Clone the repo**
2. **Create a `.env` file in the root directory**:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   SECRET_KEY=generate_a_random_secret_here
   ```
3. **Launch the stack**:
   ```bash
   docker-compose up --build
   ```
   The app will be live at `http://localhost:3000`.

---

### Method 2: Manual Setup

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and DATABASE_URL
uvicorn app.main:app --reload
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Architecture Overview
- `backend/app/models/schema.py`: Relational database models (Users, Documents, Conversations).
- `backend/app/services/ai_service.py`: Gemini integration and streaming logic.
- `backend/app/services/vector_store.py`: pgvector similarity search queries.
- `frontend/app/chat`: Real-time chat workspace.
- `frontend/lib/api.ts`: Centralized API client with auth handling.

---

## ⚖️ License
This project is licensed under the MIT License.

---

*Built with ❤️ for the future of document intelligence.*
