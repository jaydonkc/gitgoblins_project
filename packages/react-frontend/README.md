# Pet Adoption Match Frontend

This package contains the React + Vite frontend for Pet Adoption Match.

## Responsibilities

- Renders the adopter discovery feed, pet profile pages, favorites page, login, signup, shelter portal, and photo manager.
- Reads pets from the Express API and falls back to starter pet data when the backend collection is empty.
- Stores favorites, browsing state, preferences, auth token, role, and username in browser localStorage.
- Sends authenticated pet creation, inquiry creation, inquiry status, and photo management requests to the backend.

## Routes

The app uses hash routes:

- `#/` - discovery feed
- `#/pets/:id` - pet profile
- `#/favorites` - saved local favorites
- `#/login` - login form
- `#/signup` - signup form with adopter/organization account type
- `#/shelter` - organization shelter portal
- `#/shelter/pets/:id/photos` - organization photo manager

## Configuration

The frontend uses `http://localhost:8000` as the default API URL.

Set `VITE_API_BASE_URL` to point at another backend:

```bash
VITE_API_BASE_URL=https://example-api-host
```

## Scripts

From the repo root:

```bash
npm start
npm run build
npm run lint
```

From this package:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

The root `npm start` command starts Vite on `127.0.0.1:3100` with strict port handling.
