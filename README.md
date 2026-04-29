# 📄 Doc Chat | Intelligent Document Mastery

**Doc Chat** is a premium, real-time RAG (Retrieval-Augmented Generation) platform that transforms your static PDF documents into dynamic conversation partners. Built with a focus on speed, privacy, and industry-standard aesthetics, it allows you to summarize complex texts and ask grounded questions in seconds.

---

## ✨ Key Features

- 🚀 **Real-Time Streaming**: Watch as the AI generates responses word-by-word using high-performance WebSockets.
- 🌌 **Premium UI/UX**: An immersive landing page with digital stream animations and a ChatGPT-style professional workspace.
- 📁 **Intelligent RAG Pipeline**: Uses Google Gemini 1.5 Flash for high-accuracy document understanding and embeddings.
- 🔒 **Contextual Precision**: Responses are strictly grounded in your uploaded documents, preventing AI hallucinations.
- 🌓 **Adaptive Design**: A dark-themed immersive landing page that transitions into a clean, professional light-mode workspace.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/)
- **Vector Store**: [FAISS](https://github.com/facebookresearch/faiss) (Facebook AI Similarity Search)
- **PDF Extraction**: `pdfplumber`
- **Real-time**: WebSockets

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: Custom CSS Keyframes & Framer-style transitions
- **Icons**: Lucide-inspired SVG components

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY to the .env file
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📂 Project Structure

- `backend/`: FastAPI application, document processing, and AI services.
- `frontend/`: Next.js application, professional chat UI, and immersive landing page.
- `project_walkthrough.md`: Detailed internal architecture guide.

---

## ⚖️ License
This project is licensed under the MIT License.

---

*Built with ❤️ for the future of document intelligence.*
