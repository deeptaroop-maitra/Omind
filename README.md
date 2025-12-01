# OMIND - Call Quality Analysis

A prototype for analyzing contact center calls with transcription and AI-powered scoring.

## What This Does

- Upload audio files (.wav, .mp3) or manually enter transcripts
- Transcribe using OpenAI Whisper (or mock data for testing)
- Analyze call quality and generate coaching plans
- View results in a dashboard with expandable details

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                            │
│                      localhost:3000                                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Login → Upload Audio → Dashboard (Lazy-load per-call details) │  │
│  └─────────────┬──────────────────────────────────┬──────────────┘  │
└────────────────┼──────────────────────────────────┼─────────────────┘
                 │ POST /api/upload                 │ GET /api/calls
                 │ (multipart)                      │ GET /api/calls/:id
                 │                                  │
┌────────────────▼──────────────────────────────────▼────────────────┐
│                      BACKEND (Express)                             │
│                    localhost:5000                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Routes: /api/upload, /api/calls, /api/auth/login            │   │
│  │ Saves Call to MongoDB with status="processing"              │   │
│  │ (Future: Enqueue job to Redis + Bull worker)                │   │
│  └────────┬────────────────────┬────────────────┬──────────────┘   │
└───────────┼────────────────────┼────────────────┼──────────────────┘
            │                    │                │
            ▼                    ▼                ▼
    ┌───────────────┐   ┌────────────────┐   ┌──────────────────┐
    │  STT Service  │   │  LLM Service   │   │   MongoDB        │
    │ (Whisper/mock)│   │ (GPT/heuristic)│   │ Stores Call docs │
    │   Transcribe  │   │ Score & Coach  │   │ w/ transcript,   │
    │   Audio       │   │ Analysis       │   │ scores,coaching  │
    └────────┬──────┘   └────────┬───────┘   └──────────────────┘
             │                   │
             └─────────┬─────────┘
                       │
               OpenAI APIs (optional)
        or mock responses (for demo)
```

## Quick Start

**With Docker:**
```bash
docker-compose up --build
# Open http://localhost:3000
```

**Local dev (requires MongoDB running):**
```bash
cd backend && npm install && npm run dev &
cd frontend && npm install && npm start
```

## Configuration

**OpenAI Integration** (optional):
- To use real transcription/analysis, set `OPENAI_API_KEY` in `backend/.env`
- Without it, the app uses mock data and simple heuristics (great for testing)

**Environment variables:**
```
MONGO_URI=mongodb://localhost:27017/omind
OPENAI_API_KEY=sk-...  (optional)
REACT_APP_API_URL=http://localhost:5000
```

## How It Works

1. Upload an audio file → Backend saves it
2. STT service transcribes (Whisper or mock)
3. LLM service analyzes and scores the call
4. Results stored in MongoDB
5. Dashboard displays results with expandable details

## API Endpoints

- `POST /api/upload` - Upload audio file
- `GET /api/calls` - List all calls
- `GET /api/calls/:id` - Get call details
- `POST /api/auth/login` - Mock login

See `postman_collection.json` in the root directory.

## Notes
- STT/LLM integration: If you set `OPENAI_API_KEY` in `backend/.env`, the backend will attempt to call OpenAI (Whisper + Chat Completion) for transcription and analysis. If not provided, the system runs in mock mode using simple heuristics for demo purposes.
- See `backend/README.md` for further details and API docs.

## Challenges & Tradeoffs

**Async Processing:** Calls process asynchronously (500ms delay) to avoid timeouts. Use Redis + Bull queue for production scale.

**No API Keys?** Works fine in demo mode with mock data and heuristics. Set `OPENAI_API_KEY` in `.env` for real Whisper/GPT transcription.

**Local Storage:** Files stored locally in `backend/uploads/`. For production, migrate to S3.

**Mock Auth:** No JWT yet. Current login is demo-only; add real auth for multi-user scenarios.

## Tech Stack

- **Frontend:** React, Fetch API
- **Backend:** Express.js, Mongoose, multer
- **Database:** MongoDB
- **Transcription:** OpenAI Whisper (or mock)
- **Analysis:** OpenAI GPT (or heuristics)
- **Orchestration:** Docker Compose

## Project Structure

```
.
├── backend/              # Express API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── models/       # MongoDB schemas
│   │   ├── services/     # STT & LLM
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── frontend/             # React app
│   ├── src/
│   │   ├── components/
│   │   └── App.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── postman_collection.json
└── README.md
```

## To Do

- [ ] Add background job queue (Redis + Bull)
- [ ] Implement JWT authentication
- [ ] Write unit tests
- [ ] S3 file storage
- [ ] Better LLM prompts
- [ ] PII detection before sending to external APIs
