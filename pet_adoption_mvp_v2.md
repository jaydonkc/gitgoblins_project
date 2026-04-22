# Pet Adoption Match (Tinder-Style) MVP

## Core Idea
A swipe-style pet discovery app where users browse adoptable pets from shelters, save favorites, and submit adoption interest.

## Goal of the MVP
Validate demand for a faster, engaging way to discover shelter pets before building complex integrations.

## Target Users
- People looking to adopt pets
- Shelters/rescues seeking visibility

---

## Tech Stack (MVP)

### Frontend
- **Framework:** Next.js/Node.js (React)

### Backend
- Express.js

### Database
- MongoDB


### Storage
- Supabase Storage (pet images)
- CDN-backed delivery for fast loading

### APIs / Integrations (Phase 2+)
- Petfinder API (for scaling listings)
- Shelterluv API
- Adopt-a-Pet API

### Hosting / Deployment
- **Frontend:** Vercel

---

## User Flow

### 1. Landing Page
- Hero: “Find your match. Adopt, don’t shop.”
- CTA: Start Browsing
- Secondary CTA: For Shelters

### 2. Onboarding / Preferences
- Pet type (dog/cat)
- Size, age, energy level
- Good with kids/pets
- Location radius

### 3. Discovery Feed
- Swipeable pet cards
- Key info: name, breed, age, distance
- Swipe right = interested
- Swipe left = pass

### 4. Pet Profile Page
- Photos
- Shelter info
- Personality + health info
- Adoption fee
- CTA: I’m Interested

### 5. Favorites Page
- Saved pets
- Compare options
- Move to inquiry

### 6. Adoption Inquiry
- Name, email, phone
- Housing info
- Message
- Sends to shelter

### 7. Shelter Page
- Benefits + onboarding
- CTA: Join as Shelter

---

## Core Features
- Preferences
- Swipe UI
- Pet profiles
- Favorites
- Inquiry form

---

## Data Model

### Pet
- id, name, species, breed, age
- size, energy_level
- description
- compatibility flags
- vaccinated, fixed
- adoption_fee
- shelter_id
- location
- images

### Shelter
- id, name, address
- contact info

### User
- id, name, email
- preferences

### Swipe
- user_id, pet_id, action

### Inquiry
- user_id, pet_id, message

---

## MVP Scope

### Phase 1
- Manual pet uploads
- Swipe feed
- Favorites
- Inquiry form

### Phase 2
- Accounts
- Matching improvements
- Notifications

### Phase 3
- Shelter integrations
- AI recommendations

---

## Success Metrics
- Swipe → profile rate
- Save rate
- Inquiry rate
- Adoption conversion

---

## Risks
- Adoption is serious, not just swiping
- Supply side (shelters) is hard
- Needs enough listings to be useful

---

## Pitch
A swipe-based pet adoption platform that helps people discover shelter animals faster and helps shelters generate more qualified leads.
