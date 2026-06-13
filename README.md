# SKYCOMMAND Backend

A runnable Node.js/Express backend scaffold for the SKYCOMMAND air traffic dashboard.

## Run

1. Copy `.env.example` to `.env`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## Endpoints

- `GET /api/health`
- `GET /api/flights/live`
- `GET /api/flights/:flightCode`
- `GET /api/flights/search`
- `GET /api/analytics/stats`
- `GET /api/sectors/:sectorId`
