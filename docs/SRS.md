# Software Requirements Specification

## 1. Introduction

### 1.1 Project Purpose

Pet Adoption Match helps adopters discover shelter pets and helps shelters manage basic adoption interest. The MVP focuses on reliable pet browsing, saved preferences and favorites, adoption inquiry submission, and shelter follow-up workflows.

### 1.2 Intended Audience

- Pet adopters who want to compare available pets before contacting shelters.
- Shelter and rescue staff who need a simple way to publish pet profiles.
- CSC 307 reviewers evaluating product scope, architecture, security, and testing.

### 1.3 Project Scope

The MVP includes local account creation, pet discovery, pet profile details, saved favorites, adoption inquiries, organization pet creation, photo management, and inquiry status tracking. External shelter integrations, payment handling, production identity verification, and automated adoption matching are out of scope.

## 2. User Stories

- As an adopter, I want to browse available pets so that I can find animals that fit my home.
- As an adopter, I want to save favorite pets so that I can compare options later.
- As an adopter, I want my preferences and favorites to persist after refresh so that I do not lose progress.
- As an adopter, I want to submit an inquiry with contact and housing information so that a shelter can follow up.
- As shelter staff, I want to create and update pet profiles so that adopters see current listings.
- As shelter staff, I want to manage multiple pet photos so that adopters can evaluate each pet.
- As shelter staff, I want to view and update inquiry statuses so that follow-up work is organized.

## 3. Functional Requirements

### 3.1 Authentication

- The system shall allow users to sign up as an adopter or organization.
- The system shall allow existing users to log in.
- The system shall issue JWT access tokens after successful signup or login.
- The system shall restrict organization-only actions to organization accounts.

### 3.2 Pet Discovery

- The system shall display adoptable pet cards in a discovery feed.
- The system shall exclude adopted pets from the default discovery experience.
- The system shall show loading, empty, and error states for pet data.
- The system shall allow adopters to filter pets by species, size, and energy level.

### 3.3 Favorites and Session Persistence

- The system shall create or reuse an anonymous browser session id.
- The system shall persist favorites in browser storage.
- The system shall persist adopter preferences in browser storage.
- The system shall preserve basic browsing state and provide a temporary-session fallback if browser storage is unavailable.

### 3.4 Adoption Inquiries

- The system shall collect adopter name, email, phone, housing information, and message.
- The system shall validate required inquiry fields before submission.
- The system shall save inquiries to MongoDB.
- The system shall show a confirmation or recoverable error message after submission.

### 3.5 Shelter Portal

- The system shall allow organization accounts to create pet profiles.
- The system shall validate required pet profile fields before submission.
- The system shall allow organization accounts to add, replace, and remove pet image URLs.
- The system shall show organization-owned pet profiles in the shelter portal.
- The system shall show only inquiries for pets owned by the current organization account.
- The system shall allow organization accounts to mark inquiries as new, contacted, approved, or rejected.

## 4. Non-Functional Requirements

### 4.1 Data Integrity and Security

- Passwords shall be stored as bcrypt hashes.
- Credentials and connection strings shall be kept in local environment variables and excluded from Git.
- Sensitive routes shall require authentication.
- Organization-only routes shall check the authenticated user's role.
- Pet mutation routes shall only modify pet records owned by the current organization user.
- Inquiry dashboard routes shall only expose inquiries for organization-owned pets.

### 4.2 Usability

- Required forms shall show clear validation errors.
- Loading screens shall show visible feedback.
- Empty states shall explain what the user can do next.
- Failed API calls shall show recoverable messages or allow the user to retry.

### 4.3 Maintainability

- Backend code shall keep route handlers, service functions, and Mongoose models in separate modules.
- Frontend code shall use stable `data-cy` selectors for E2E testing.
- The repository shall include local setup, testing, and contribution instructions.

## 5. System Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for package structure, API endpoints, security matrix, and data model diagrams.

## 6. User Interface

See [UI_PROTOTYPE.md](UI_PROTOTYPE.md) for the implemented screen storyboard and prototype notes.

## 7. Data Requirements

Persistent data includes users, organizations, pets, swipes, inquiries, and inquiry statuses. Browser-local data includes anonymous session id, adopter preferences, favorites, and browsing state.

## 8. Traceability Matrix

| User story | Implementation | Verification |
| --- | --- | --- |
| Browse pets | React discovery feed, `GET /pets` | Cypress profile/favorites flow |
| Save favorites | Browser storage favorites | Cypress refresh-persistence flow |
| Persist preferences | Browser storage preferences | Cypress refresh-persistence flow |
| Submit inquiry | `POST /inquiries`, inquiry form | Cypress inquiry submission flow |
| Create pet profile | `POST /pets`, shelter portal | Cypress pet creation flow |
| Manage photos | `PATCH /pets/:id/photos`, photo manager | Cypress photo-management flow |
| Track inquiry status | `PATCH /inquiries/:id/status` | Cypress dashboard status flow |
| Protect sensitive routes | JWT auth middleware, role checks | Cypress unauthorized API checks |

## 9. AI Usage Disclosure

Codex was used to inspect the repository, implement validation/session/security fixes, add documentation, and run verification commands. Human review is still required before final Canvas submission.
