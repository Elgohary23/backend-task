# Backend Task — Express + TypeScript + MongoDB + Kafka

Small user-management API demonstrating a layered / clean-architecture style in Express + TypeScript, with MongoDB for persistence and Kafka (kafkajs) for domain events.

## What it does

CRUD-lite for `User` (`id`, `email`):

- `POST /users` — create a user, validate email, save to MongoDB, publish `user-created` event to Kafka.
- `GET /users` — list all users.
- `GET /users/:userId` — get one user.
- `PATCH /users/:userId/email` — change a user's email (domain-validated).
- `GET /` / `GET /health` — service status checks.

A Kafka consumer in the same process (`user-service-group`) subscribes to `user-created` and logs received events.

## How it works (short explanation)

- `src/app.ts` — builds the Express app (`express.json()`, `/users` router, `/` + `/health`).
- `src/index.ts` — bootstrap: loads `.env`, connects Mongoose, connects Kafka producer, starts Kafka consumer, then `app.listen(PORT)`.
- `src/modules/user/` — feature module split by layer:
  - `domain/` — `User` entity + `changeEmail()` validation, `IUserRepository` port.
  - `application/` — use cases: `CreateUserUseCase`, `GetUserUseCase`, `ListUsersUseCase`, `ChangeEmailUseCase`. No Express/Mongo imports here.
  - `infrastructure/` — adapters: `MongoUserRepository` + Mongoose `UserModel`, Kafka `kafkaClient` / `producer` (`user-created`) / `consumer`.
  - `api/` — `userController` + `userRoutes` (HTTP ↔ use cases wiring).

Flow: `HTTP → Controller → UseCase → Domain validation → MongoUserRepository → MongoDB`, plus `producer.send(user-created)` on create.

## Prerequisites

- Node.js 20+
- Docker + Docker Compose (for MongoDB + Kafka, or full-stack run)

## How to run

### 1. Full stack with Docker Compose (recommended)

Starts Mongo + Kafka (KRaft, no Zookeeper) + API on `http://localhost:3000`.

```bash
cp .env.example .env   # or just use the existing .env
docker compose up --build
```

Defaults used by `docker-compose.yml` (`app` service):

```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/backend-task
KAFKA_BROKER=kafka:9092
```

Check it:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/
```

### 2. Local dev (Mongo + Kafka in Docker, API on host)

```bash
# start only infra
docker compose up mongo kafka

# in another terminal — point the app at localhost
# .env:
# PORT=3000
# MONGO_URI=mongodb://localhost:27017/backend-task
# KAFKA_BROKER=localhost:9092

npm install
npm run dev
```

### 3. Build + run production bundle

```bash
npm install
npm run build
npm start
# or: npm run lint   # typecheck (tsc --noEmit)
```

## API examples

```bash
# create
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"id":"u1","email":"u1@example.com"}'

# list
curl http://localhost:3000/users

# get one
curl http://localhost:3000/users/u1

# change email
curl -X PATCH http://localhost:3000/users/u1/email \
  -H "Content-Type: application/json" \
  -d '{"email":"new@example.com"}'
```

| Method | Path | Body | Success |
|---|---|---|---|
| POST | `/users` | `{"id","email"}` | `201` user JSON / `400` on duplicate or invalid email |
| GET | `/users` | — | `200` user array |
| GET | `/users/:userId` | — | `200` user / `404` if missing |
| PATCH | `/users/:userId/email` | `{"email"}` | `200` user / `400` on invalid email |

Kafka: topic `user-created`, message `{"id","email"}`. Watch consumer logs in the `backend-app` container (or `npm run dev` terminal) after a `POST /users`.

## Project structure

```
src/
  app.ts                        # express app factory
  index.ts                      # bootstrap (mongo + kafka + listen)
  modules/user/
    api/                        # userRoutes, userController
    application/                # use cases
    domain/                     # User entity, IUserRepository
    infrastructure/
      MongoUserRepository.ts
      presistance/UserModel.ts  # mongoose schema
      kafka/                    # kafkaClient, producer, consumer
docker-compose.yml              # mongo + kafka + app
Dockerfile                      # multi-stage build → node dist/index.js
.env.example                    # required env vars
```

Live demo: http://13.53.201.122:3000
