# Backend - OMIND Prototype

The backend is an Express app providing endpoints for:

- POST `/api/upload` - multipart file upload (field name `file`). Saves file and processes transcription + analysis asynchronously.
- POST `/api/auth/login` - mock login returning a token and user info.
- GET `/api/calls` - list recent calls with transcripts, scores, and coaching plans.
- GET `/api/calls/:id` - fetch single call details.

Integration points

- STT: `backend/src/services/sttService.js` - uses OpenAI Whisper transcription endpoint when `OPENAI_API_KEY` is set; otherwise uses mock transcripts or sample text files.
- LLM: `backend/src/services/llmService.js` - calls OpenAI Chat Completions when `OPENAI_API_KEY` is set; otherwise runs simple heuristic analysis.

Run

- Development: `npm run dev` (needs dependencies installed)
- Docker: `docker-compose up --build`

Notes on production

- Add authentication (JWT), secure file storage (S3), background worker queue (Redis + Bull) for processing, and rate limiting/error handling for vendor APIs.
- LLM prompt engineering: keep robust JSON-safe wrappers or use function-calling APIs.
