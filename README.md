# Finora

Personal finance web app built with React 18, Vite, React Router, Axios and Recharts.

## Run

    npm install
    npm run dev        # http://localhost:5173
    npm run build

Demo login: `demo@finora.app` / `demo1234`

## Connecting a real API

All data goes through Axios services in `src/services/`. Copy `.env.example` to `.env` and set:

    VITE_API_BASE_URL=http://localhost:8000/api
    VITE_USE_MOCK_API=false

With `VITE_USE_MOCK_API=true` (the default) an in-browser mock API answers the same REST routes
(`src/services/mock/`), so no component changes are needed when you switch.

Endpoints: `POST /auth/login|register|forgot-password`, `GET /auth/me`, `PUT /profile`,
`PUT /profile/password`, `/transactions`, `/budgets` and `/categories` (GET/POST/PUT/DELETE),
`GET /summary/monthly?months=6&end=YYYY-MM`. The JSON shapes are documented by the seed data in
`src/services/mock/mockDb.js`.
