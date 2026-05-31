# Pet Adoption Match MVP Product Notes

## Core Idea

Pet Adoption Match helps adopters discover shelter pets and helps organizations manage pet listings and adoption inquiries from one focused web app.

## Target Users

- Adopters who want to browse available pets, save favorites, and submit structured adoption interest.
- Shelter or rescue staff who need to publish pet profiles and review adopter inquiries.

## Implemented Tech Stack

- Frontend: React 19, Vite, hash-based routing, browser localStorage for favorites and session state.
- Backend: Express, JWT authentication, bcrypt password hashing.
- Database: MongoDB through Mongoose models.
- E2E testing: Cypress.
- Deployment target: Vercel for the frontend and an Express-compatible backend host with MongoDB environment variables.

## Implemented User Flows

### Adopter Flow

1. Browse available pets on the discovery feed.
2. Filter by species, size, and energy level.
3. Open a detailed pet profile with photos, shelter contact details, compatibility notes, health notes, and adoption fee.
4. Save pets to a local favorites page.
5. Sign up or log in.
6. Submit an adoption inquiry with name, email, phone, housing details, and a message.

### Organization Flow

1. Sign up or log in as an organization account.
2. Open the shelter portal.
3. Expand the collapsed add-pet form when creating a new listing.
4. Create pet profiles with details and image URLs.
5. View only pet profiles created by the current organization username.
6. Manage pet profile photos.
7. Review only inquiries attached to pets owned by the current organization username.
8. Filter inquiries by All, New, Contacted, Accepted, or Rejected.
9. Update inquiry status from the dashboard.

## Implemented Data Model

### User

- Stores `name`, `username`, `email`, `hashedPassword`, and `role`.
- Roles are `adopter` and `organization`.

### Organization

- Stores standalone organization `name` and `email`.
- Organization records are separate from organization user accounts.

### Pet

- Stores profile details including name, type/species, breed, age, size, energy level, location, description, compatibility, health, adoption fee, shelter name, shelter email, image URLs, availability, optional `linked_org`, and `ownerUsername`.
- `ownerUsername` is set from the authenticated organization JWT when a pet is created.

### Inquiry

- References a required pet and optional user.
- Stores contact details, housing details, message, date, and status.
- Status values are `new`, `contacted`, `approved`, and `rejected`; the frontend labels `approved` as "Accepted".

### Swipe

- References a user and pet and stores a boolean `swiped` value.
- Swipe endpoints exist as authenticated backend routes, but swiping is not the primary frontend workflow in this final version.

## Security Scope

- Missing or invalid JWTs return `401` on protected routes.
- Adopter accounts receive `403` on organization-only routes.
- Pet creation, photo updates, availability updates, and deletion are organization-only.
- Pet management and inquiry review are owner-scoped by matching pet `ownerUsername` to the authenticated organization username.
- See [`SECURITY_BEHAVIOR.md`](./SECURITY_BEHAVIOR.md) for route-level details.

## Known Limitations

- Favorites are local to the browser and are not synced to MongoDB.
- Pet images use URLs rather than uploaded files.
- Starter pet data is displayed by the frontend when the backend pet collection is empty, but it is not inserted into MongoDB automatically.
- Swipe and user routes are authenticated but not owner-scoped.
- Organization profile records are not automatically linked to organization user accounts.
- External shelter integrations and notification delivery are outside the current scope.

## Final Demo Pitch

Pet Adoption Match gives adopters a simple way to discover pets and express interest, while giving shelters a lightweight portal for publishing pet profiles and managing inquiries tied to their own listings.
