# GitGoblins - Pet Adoption Match

Pet Adoption Match is a CSC 307 team project for a swipe-style pet adoption MVP.
The current repo deliverable is the TE2 Software Requirements Document with the
product vision, coordinated user stories, functional requirements, and
non-functional requirements.

## Current documents

- `SRD.md` - Git-friendly source of truth for the TE2 SRD/SRS.
- `SRS_Template.docx` - optional DOCX copy/template version of the SRD.
- `pet_adoption_mvp_v2.md` - project concept, MVP scope, stack, and risks.

## Running locally

```bash
npm install
npm run dev
```

Then open <http://127.0.0.1:3000>.

## Testing

```bash
npm run typecheck
npm run test:e2e
```

`npm run test:e2e` starts the Next.js dev server and runs the Cypress E2E suite
against the adopter inquiry, saved-pet, shelter pet-creation, and photo-management flows.

## Deployable demo

Target: Vercel Next.js deployment using `vercel.json`.

Live demo URL: pending until the Vercel project is connected and the first production
deployment is published.

Environment variables:

```bash
PET_ADOPTION_DATA_DIR=/tmp/gitgoblins-pet-adoption
```

Demo data is seeded automatically when the app starts without an existing database file.
The deployed demo can support browsing, saved pets, pet profiles, inquiries, shelter
pet creation, and photo URL management. Current limitation: the MVP uses JSON file
persistence, so serverless demo data may reset between deployments or serverless
instance restarts. The production-oriented plan still calls for MongoDB and uploaded
image storage.

## Planned MVP stack

- Frontend: Next.js with React, Tailwind CSS, and shadcn-compatible component primitives in `components/ui`.
- Backend: Next.js route handlers for the local MVP API surface.
- Database: JSON persistence for demo data, with MongoDB still planned for the production-oriented backend.
- Image storage: image URL gallery support for the MVP, with Supabase Storage planned for uploaded files.
