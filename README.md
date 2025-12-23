Monolith Pokedex (Docker Compose: Next.js + NestJS + SQLite)

Prerequisites

- Docker and Docker Compose installed

Project structure

- docker-compose.yml
- backend/ (NestJS + TypeORM)
- frontend/ (Next.js 14 App Router)

Quick start

1. Build and start
   - docker compose up -d --build
2. Open apps
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

Services

- backend (NestJS)
  - Port: 3001
  - Environment:
    - DB_PATH (optional, defaults to data/pokedex.sqlite)
    - GEMINI_API_KEY (required for battle narration)
    - GEMINI_MODEL (optional override)
- frontend (Next.js)
  - Port: 3000
  - Environment:
    - NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

Backend API (summary)

- GET /pokemon?offset=&limit= — list Pokémon (via PokeAPI)
- GET /pokemon/:id — Pokémon detail (via PokeAPI)
- POST /battle/simulate — simulate a battle
  - Body: { "pokemon1Id": 25, "pokemon2Id": 1 }
- GET /battle/results — recent battle results

Local troubleshooting

- If ports 3000/3001 are in use, stop the other processes or change mappings in docker-compose.yml
- SQLite DB lives at `backend/data/pokedex.sqlite` (or `DB_PATH`).
  - The database file is created automatically on first run (TypeORM `synchronize=true`).
  - To reset, delete `backend/data/pokedex.sqlite` and restart the backend.

Notes

- The backend enables CORS for http://localhost:3000
- TypeORM synchronize=true is enabled for bootstrapping; switch to migrations for production use
- Battle narration uses Gemini (requires `GEMINI_API_KEY`)
