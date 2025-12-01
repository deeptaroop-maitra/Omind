# OMIND.AI - Contact Center Agentic AI Prototype

This repository is a 2-day prototype demonstrating an agentic AI workflow for contact center call quality analysis and coaching.

Key features
- Upload and transcribe audio (.wav/.mp3)
- Analyze transcripts with LLM to compute quality scores
- Generate a coaching plan with text feedback and recommended references
- React front-end, Express back-end, MongoDB persistence
- Docker Compose for local orchestration

Architecture
- Front-end: React app (`/frontend`) — Login (mock), Upload, Dashboard
- Back-end: Express (`/backend`) — API endpoints for upload, transcription, analysis; uses `sttService` and `llmService`
- Database: MongoDB (via Docker Compose)
- Orchestration: `docker-compose.yml` runs frontend, backend, and mongo.

Run locally (development, mock mode)
1. Copy env example files:

```powershell
cd backend
copy .env.example .env
cd ..\frontend
copy .env.example .env
```

2. Start with Docker Compose:

```powershell
docker-compose up --build
```

3. Open frontend: http://localhost:3000

Notes
- STT/LLM integration: If you set `OPENAI_API_KEY` in `backend/.env`, the backend will attempt to call OpenAI (Whisper + Chat Completion) for transcription and analysis. If not provided, the system runs in mock mode using simple heuristics for demo purposes.
- See `backend/README.md` for further details and API docs (Swagger available at `/api-docs`).

Deliverables
- Architecture overview and README (this file)
- Back-end code: `backend/`
- Front-end code: `frontend/`
- Docker orchestration: `docker-compose.yml`
- Sample calls: `sample_calls/` (add your .wav/.mp3 files here)

Next steps and considerations for production are documented in `backend/README.md`.

**GitHub & CI**

Recommended GitHub setup:

- Add this repo to GitHub and enable the following GitHub Actions workflow located at `.github/workflows/ci.yml` (included in this repo) to run basic checks on PRs and commits.
- The workflow installs dependencies for both `backend` and `frontend`, runs backend tests, and builds the frontend. It provides a sensible baseline for CI in a small prototype.

Sample CI badge (add to top of this README after enabling workflow):

`![CI](https://github.com/<your-org>/<your-repo>/actions/workflows/ci.yml/badge.svg)`

Sample commit message style (conventional-ish):

```
chore: initial commit - scaffold backend/frontend, docker-compose, sample data, basic STT/LLM mocks
```

How to push to GitHub (once you've created a remote repo):

```powershell
git remote add origin https://github.com/<your-org>/<your-repo>.git
git push -u origin main
```

Notes about CI and branches:

- Use feature branches (e.g., `feat/worker-queue`) and open PRs to `main`.
- Extend CI to run linting, unit tests, and security scans (Snyk/Dependabot) before merging.

