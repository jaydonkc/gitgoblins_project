# Security Behavior Verification

This note records the implemented data relationships and route protections for the final demo and submission package.

## Data Relationships

| Model | Implemented relationship |
| --- | --- |
| User | Stores `username`, `hashedPassword`, and `role`. Supported roles are `adopter` and `organization`. JWTs include `username` and `role`. |
| Organization | Standalone organization profile with `name` and `email`. Pet records can also reference an organization through `linked_org`. |
| Pet | May reference an organization through `linked_org`. Pet ownership for protected shelter actions is enforced with `ownerUsername`, which is set from the authenticated JWT username on create. |
| Inquiry | References a required `pet` and optional `user`. If no user is linked, contact fields `name` and `email` are required. Shelter inquiry review is scoped to inquiries whose pet `ownerUsername` matches the authenticated organization username. |
| Swipe | References a required `user` and `pet`, with `swiped` storing the direction. Swipe routes currently require authentication but are not scoped to the authenticated user's own id. |

## Protected Route Behavior

| Route area | Expected behavior |
| --- | --- |
| Missing or invalid bearer token | `authenticateUser` returns `401`. |
| Organization-only route with adopter token | `requireOrganization` returns `403`. |
| `POST /pets` | Requires authenticated organization. Created pet receives `ownerUsername` from the JWT username. |
| `PATCH /pets/:id/photos` | Requires authenticated organization and matching pet `ownerUsername`; non-owners receive `403`. |
| `PATCH /pets/:id/availability` | Requires authenticated organization and matching pet `ownerUsername`; non-owners receive `403`. |
| `DELETE /pets/:id` | Requires authenticated organization and matching pet `ownerUsername`; non-owners receive `403`. |
| `GET /inquiries` | Requires authenticated organization and returns only inquiries for pets owned by that organization username. |
| `GET /inquiries/:id` | Requires authenticated organization and matching pet owner; non-owners receive `403`. |
| `PATCH /inquiries/:id/status` | Requires authenticated organization, valid status, and matching pet owner; invalid status returns `400`, non-owners receive `403`. The backend status value `approved` is displayed as "Accepted" in the frontend. |
| `DELETE /inquiries/:id` | Requires authenticated organization and matching pet owner; non-owners receive `403`. |
| `/swipes` and `/users` routes | Require authentication, but the current implementation does not enforce per-user ownership. Do not describe these as owner-scoped in the demo. |
| Public read routes | `GET /pets`, `GET /pets/:id`, `GET /orgs`, and `GET /orgs/:id` are public. |

## Demo Explanation

The demo security story is role-based plus owner-scoped shelter management. Adopters can browse pets and submit authenticated inquiries. Organization accounts can create pets, and the backend records the creating username as `ownerUsername`. Shelter management actions for pet photos, availability, deletion, and inquiry review are limited to records tied to that same owner username.

Known limitation: swipe and user endpoints are authenticated but not owner-scoped. They should be described as protected MVP endpoints, not as finalized privacy controls.
