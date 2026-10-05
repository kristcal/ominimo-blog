# Ominimo Blog

Simple blog app built with Laravel (API) and React.

## Run with Docker

Requires Docker Desktop.

1. Create `.env` in the root folder with `APP_KEY` (copy it from `backend/.env`):

   ```
   APP_KEY=base64:...
   ```

2. Start all services:

   ```bash
   docker compose up --build
   ```

3. Seed the database (first run only):

   ```bash
   docker compose exec backend php artisan db:seed
   ```

4. Open `http://localhost:5173`.

## Run locally

Backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Frontend (in another terminal):

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Test accounts

Seeded users all have password `password`. 
Test user: `test@example.com`. 
Admin: `admin@example.com`.

## Tests

```bash
cd backend
php artisan test
```