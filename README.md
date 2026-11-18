# PDF RAG (Retrieval-Augmented Generation)

A full-stack, asynchronous RAG system that lets you upload PDF documents and ask questions about their content using **Google Gemini**, **Qdrant Vector Database**, and **BullMQ**.

---

## 🚀 Features

- **Asynchronous Document Processing**: Uploaded PDFs are queued via BullMQ and processed by background workers to ensure fast, non-blocking uploads.
- **Vector Search with Qdrant**: PDF pages are embedded and stored in Qdrant vector database for fast and relevant similarity retrieval.
- **Google Gemini Integration**: Uses Gemini embeddings for document indexing and Gemini Pro preview for context-grounded answers.
- **Modern Web Interface**: Built with Next.js, React 19, Tailwind CSS, and Lucide icons.

---

## 🏗️ Architecture

```
[ User / Web UI ]
       │
       ▼
 [ Express Server ] ────────► [ BullMQ Queue (Valkey/Redis) ]
       │                                     │
       │                                     ▼
       │                              [ Worker Process ]
       │                                     │
       │ (Similarity Search)                 ▼ (Embed & Index)
       └──────────────► [ Qdrant Vector DB ] ◄┘
                               ▲
                               │
                      [ Google Gemini API ]
```

1. **Upload Flow**: User uploads a PDF $\rightarrow$ Express saves the file and enqueues a job $\rightarrow$ BullMQ worker extracts text, creates embeddings with Gemini, and stores vectors into Qdrant.
2. **Query Flow**: User asks a question $\rightarrow$ Express retrieves relevant chunks from Qdrant $\rightarrow$ Gemini synthesizes an answer using the retrieved context.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Lucide React
- **Backend**: Express.js, Multer, LangChain
- **Queue & Background Worker**: BullMQ, Valkey / Redis
- **Vector Database**: Qdrant
- **AI / Embeddings**: Google Gemini (`gemini-embedding-001`, `gemini-3.1-pro-preview`)
- **Containers**: Docker Compose

---

## 📁 Project Structure

```text
pdf-rag/
├── docker-compose.yml       # Valkey (Redis) & Qdrant services
├── client/                  # Next.js frontend application
│   ├── app/                 # Next.js app router & UI components
│   ├── package.json
│   └── .env
└── server/                  # Backend API & background worker
    ├── config/              # Centralized environment, Gemini, Qdrant & BullMQ config
    ├── controllers/         # Request handlers (PDF upload/view, Chat)
    ├── middlewares/         # Multer upload & global error handling
    ├── routes/              # Modular Express routing (pdf, chat)
    ├── services/            # Business logic (Gemini AI, Qdrant vectors, Queue, Files)
    ├── uploads/             # Uploaded PDF file storage
    ├── app.js               # Express app configuration & middleware
    ├── index.js             # Server entry point
    ├── worker.js            # BullMQ worker for parsing & embedding PDFs
    ├── package.json
    └── .env
```

---

## ⚡ Getting Started

### 1. Prerequisites

- [Docker & Docker Compose](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) (for the frontend)

---

### 2. Start Infrastructure Services

Start the Valkey (Redis queue) and Qdrant (vector database) containers:

```bash
docker compose up -d
```

- **Qdrant**: `http://localhost:6333`
- **Valkey / Redis**: `localhost:6379`

---

### 3. Setup Backend Server & Worker

1. Navigate to the `server` directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Configure environment variables in `server/.env`:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

3. In one terminal, start the **API server**:
   ```bash
   npm run dev
   ```
   *Runs on `http://localhost:8000`*

4. In a second terminal, start the **BullMQ worker**:
   ```bash
   npm run dev:worker
   ```
   *Listens for uploaded PDFs and indexes them into Qdrant.*

---

### 4. Setup Frontend Client

1. Open a new terminal, navigate to `client`, and install dependencies:
   ```bash
   cd client
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```
   *Runs on `http://localhost:3000`*

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check endpoint |
| `POST` | `/upload/pdf` | Upload a single PDF file (`multipart/form-data`, key: `pdf`) |
| `GET` | `/chat?question=<query>` | Query the indexed PDFs and receive an answer |

---

## 🧪 Testing with cURL

**Upload a PDF:**
```bash
curl -X POST -F "pdf=@/path/to/document.pdf" http://localhost:8000/upload/pdf
```

**Ask a question:**
```bash
curl "http://localhost:8000/chat?question=Summarize+the+document"
```
