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

The MVP frontend is a Vite React app in `packages/react-frontend`. It reads and writes pet profiles, inquiries, and photo updates through the Express backend. Favorites are still stored in browser storage because the current backend does not include a favorites model.

## Running the backend locally

From the repo root, start the backend with:

```bash
npm --workspace packages/express-backend run start
```

For development with auto-restart, use:

```bash
npm --workspace packages/express-backend run dev
```

The Express backend runs on <http://localhost:8000> and expects `MONGODB_URI` for MongoDB-backed routes. The frontend uses that URL by default; set `VITE_API_BASE_URL` if the API is running somewhere else.

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

If the backend pet collection is empty, the frontend seeds the starter pets through the Express API, so the records are stored in MongoDB before they are shown. The Express backend includes Mongo models and routes for pets, inquiries, organizations, users, and swipes.

Security Diagram:

## Access Control Sequence Diagrams

### Sign Up Flow

```mermaid
sequenceDiagram
  participant User
  participant Frontend
  participant Backend
  participant MongoDB

  User->>Frontend: Enter username and password
  Frontend->>Backend: POST /signup with username and pwd
  Backend->>MongoDB: Check if username exists
  MongoDB-->>Backend: Existing user or none
  Backend->>Backend: Hash password with bcrypt
  Backend->>MongoDB: Save username and hashedPassword
  Backend->>Backend: Generate JWT with TOKEN_SECRET
  Backend-->>Frontend: 201 Created with token
  Frontend->>Frontend: Store token in localStorage
```

### Login Flow

```mermaid
sequenceDiagram
  participant User
  participant Frontend
  participant Backend
  participant MongoDB

  User->>Frontend: Enter username and password
  Frontend->>Backend: POST /login with username and pwd
  Backend->>MongoDB: Find user by username
  MongoDB-->>Backend: User with hashedPassword
  Backend->>Backend: Compare pwd with hashedPassword using bcrypt
  Backend->>Backend: Generate JWT if password matches
  Backend-->>Frontend: 200 OK with token
  Frontend->>Frontend: Store token in localStorage
```

### Protected API Request Flow

```mermaid
sequenceDiagram
  participant User
  participant Frontend
  participant Backend
  participant AuthMiddleware
  participant MongoDB

  User->>Frontend: Submit protected action
  Frontend->>Backend: Request with Authorization: Bearer token
  Backend->>AuthMiddleware: authenticateUser(req, res, next)
  AuthMiddleware->>AuthMiddleware: Verify JWT with TOKEN_SECRET

  alt Valid token
    AuthMiddleware->>Backend: next()
    Backend->>MongoDB: Read or modify protected data
    MongoDB-->>Backend: Result
    Backend-->>Frontend: Success response
  else Missing or invalid token
    AuthMiddleware-->>Frontend: 401 Unauthorized
  end
```
