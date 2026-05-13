# Pet Adoption Match

In this project we will be making a web-app that allows people to find pets easier, and allows shelters to easily get their name out.

Contributors:
Stearman Rubey - Project Owner,
Jaydon Chen - Scrum Master,
Carlos Lopez - Lead Developer

## Running the MVP locally

```bash
npm install
npm start
```

The MVP frontend is a Vite React app in `packages/react-frontend`. It uses seeded demo pets and browser storage for favorites, inquiries, shelter-created pets, and photo updates.

## Running the backend locally

```bash
npm --workspace packages/express-backend run dev
```

The Express backend runs on <http://localhost:8000> and expects `MONGODB_URI` for MongoDB-backed routes.

## Testing

```bash
npm run build
npm run test:e2e
```

The Cypress E2E suite covers the Jaydon-authored flows:

- detailed pet profile from discovery and favorites
- save/favorite pet action
- adoption inquiry form with contact and housing information
- shelter pet creation
- multiple pet-photo add, replace, remove, and profile gallery display

## Deployable demo

Frontend deployment target: Vercel static Vite deployment from `packages/react-frontend`.

Backend/API deployment target: Express app in `packages/express-backend`, with MongoDB configured through `MONGODB_URI`.

Live demo URL: pending until the Vercel project is connected and the first production deployment is published.

Demo data is seeded in the frontend for reviewer access without setup. The current frontend MVP persists demo pets, favorites, inquiries, and photo changes in browser storage. The Express backend includes Mongo models and routes for pets, inquiries, organizations, users, and swipes for the production-oriented backend path.
