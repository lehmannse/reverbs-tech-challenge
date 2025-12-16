Monolith Pokedex (Docker Compose: Next.js 14 + NestJS + PostgreSQL)

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

- db (PostgreSQL)
  - Port: 5432 (exposed)
  - Persistent volume: pgdata
  - Default credentials in compose: user=pokedex password=pokedex db=pokedex
- backend (NestJS)
  - Port: 3001 (maps to container 3000)
  - Environment:
    - DB_HOST=db
    - DB_PORT=5432
    - DB_USER=pokedex
    - DB_PASS=pokedex
    - DB_NAME=pokedex
    - AI_API_KEY (optional placeholder)
- frontend (Next.js)
  - Port: 3000
  - Environment:
    - NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

Backend API (summary)

- GET /pokemon?offset=&limit= — list Pokémon (via PokeAPI)
- GET /pokemon/:id — Pokémon detail (via PokeAPI)
- POST /battle/simulate — simulate a battle
  - Body: { "pokemon1Name": "pikachu", "pokemon2Name": "bulbasaur" }
- GET /battle/results — recent battle results

Local troubleshooting

- If ports 3000/3001/5432 are in use, stop the other processes or change mappings in docker-compose.yml
- Reset DB volume:
  - docker compose down
  - docker volume rm reverbstechchallenge_pgdata (or use `docker volume ls` to find the exact name)
  - docker compose up -d --build

Notes

- The backend enables CORS for http://localhost:3000
- TypeORM synchronize=true is enabled for bootstrapping; switch to migrations for production use
- The Battle AI service is a placeholder and reads AI_API_KEY; no external calls are made
