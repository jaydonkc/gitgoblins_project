# Final Delivery Runbook

This runbook maps the final Sprint 3 user stories to app
behavior, verification commands, and the demo capture path.

## User Story Coverage

| Story area               | App behavior                                                                                                                       | Cypress coverage                                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Browse pets              | Adopters can browse backend pets or starter data when the backend collection is empty.                                             | `user-stories.cy.js` and `jaydon-flows.cy.js` verify the discovery feed.                                          |
| Filter pets              | Species, size, and energy filters update the feed and can be cleared.                                                              | `user-stories.cy.js` verifies matching, empty filtered results, and clear filters.                                |
| Profile view             | Pet profiles show gallery, details, health, shelter, and compatibility information with fallback text for missing optional values. | `user-stories.cy.js` verifies profile fallbacks; `jaydon-flows.cy.js` verifies profile navigation.                |
| Favorites                | Adopters can save a pet, refresh, and return through Favorites.                                                                    | Both Cypress specs verify favorite persistence.                                                                   |
| Auth                     | Users can sign up or log in as adopter or organization accounts.                                                                   | `user-stories.cy.js` verifies mocked auth roles; `jaydon-flows.cy.js` verifies backend-backed signup/login paths. |
| Inquiry submission       | Authenticated adopters can submit contact, housing, and message details; validation prevents incomplete submissions.               | Both Cypress specs verify inquiry validation and submission.                                                      |
| Shelter portal           | Organizations can create pet profiles, see only their own pets, and manage photos.                                                 | Both Cypress specs verify creation and photo management.                                                          |
| Inquiry review           | Organizations see only inquiries for their own pets, filter by status, and update review status.                                   | Both Cypress specs verify owner-scoped inquiry review and status updates.                                         |
| Loading and error states | Feed, favorites, profile, and inquiry screens show loading/error/retry states instead of failing silently.                         | `user-stories.cy.js` verifies recoverable feed and inquiry errors.                                                |
| Deployment setup         | Environment variables and deployment targets are documented for Azure and Vercel.                                                  | This runbook and `README.md` list required configuration.                                                         |

## Verification Commands

Run static verification:

```bash
npm run verify
```

Run deterministic Cypress story coverage without a MongoDB
connection:

```bash
npm run test:e2e:stories
```

Run backend-backed Cypress coverage when a safe MongoDB test
database is configured:

```bash
npm run test:e2e
```

Run both suites:

```bash
npm run test:e2e:all
```

Do not run backend-backed Cypress against a production or shared
MongoDB database unless the team intentionally accepts test
writes.

Seed realistic demo data in the deployed database:

```bash
DEMO_PASSWORD="<temporary demo password>" npm run seed:demo
```

Set `DEMO_API_BASE_URL` when seeding a non-Azure backend.

## Demo Capture Path

Run the demo from the deployed frontend:
`https://polite-sea-04f9f5310.7.azurestaticapps.net`.

1. Browse the discovery feed and show filters. The seeded
   profiles include Rosie, Mochi, Atlas, and Clover.
2. Open Rosie's pet profile, use the gallery, and save the pet.
3. Open Favorites and return to the saved profile.
4. Log in as adopter `maria_gonzalez_demo`.
5. Submit an inquiry using a real-looking example: `Jordan Lee`,
   `jordan.lee@example.com`, `(805) 555-0188`,
   `Condo in San Luis Obispo with landlord approval and a dog park nearby`,
   and
   `I can visit after work on Thursday and have vet references available.`
6. Log in as organization `central_coast_rescue`.
7. Create a pet profile with complete form data: `Sunny`, `Dog`,
   `Cattle Dog Mix`, `3 years`, `Medium`, `High`,
   `Morro Bay, CA`, fee `140`, shelter
   `Central Coast Pet Alliance`, email
   `adoptions@centralcoastpetalliance.org`, and two image URLs.
8. Manage Sunny's photos from the shelter portal.
9. Review the seeded and newly submitted inquiries in the
   dashboard, filters, and status updates.

## Deployment Configuration

| Target                         | Required configuration                                                                                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Express backend                | `MONGODB_URI`, `TOKEN_SECRET`, optional `MONGOOSE_DEBUG`, optional platform `PORT`.                                                                                                   |
| Azure backend workflow         | Repository variable `AZURE_BACKEND_CONFIGURED=true`, variable `AZURE_BACKEND_APP_NAME`, secret `AZURE_BACKEND_PUBLISH_PROFILE`.                                                       |
| Azure Static Web Apps workflow | Repository variable `AZURE_STATIC_WEB_APP_CONFIGURED=true`, variable `VITE_API_BASE_URL`, secret `AZURE_STATIC_WEB_APPS_API_TOKEN`.                                                   |
| Vercel frontend                | Root `vercel.json`, install command `npm install`, build command `npm --workspace packages/react-frontend run build`, output `packages/react-frontend/dist`, env `VITE_API_BASE_URL`. |

## Known Blockers To Check Before Submission

- The backend appends `primaryDB` to `MONGODB_URI`; use a
  connection string without a database name.
- `npm run test:e2e` writes users, pets, inquiries, and photo
  updates to MongoDB.
- The frontend dev server uses port `3100` with `--strictPort`.
- The backend listens on `8000` locally unless `PORT` is set.
- User and swipe endpoints are authenticated but not
  owner-scoped; do not present them as finalized privacy
  controls.
