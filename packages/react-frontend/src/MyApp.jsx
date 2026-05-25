import { useEffect, useMemo, useState } from "react";
import Login from "./Login.jsx";

const favoritesKey = "gitgoblins:favorites";
const authTokenKey = "gitgoblins:authToken";
const authRoleKey = "gitgoblins:authRole";
const authUsernameKey = "gitgoblins:authUsername";
const INVALID_TOKEN = "INVALID_TOKEN";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const seedPets = [
  {
    id: "luna",
    name: "Luna",
    species: "Dog",
    breed: "Australian Shepherd Mix",
    age: "2 years",
    size: "Medium",
    energyLevel: "High",
    location: "San Luis Obispo, CA",
    description:
      "Luna is a bright, active companion who loves long walks, puzzle toys, and patient adopters.",
    compatibility: ["Good with older kids", "Best as only dog"],
    health: "Vaccinated, spayed, microchipped",
    adoptionFee: 175,
    shelterName: "Central Coast Rescue",
    shelterEmail: "adoptions@centralcoastrescue.test",
    imageUrls: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1200&q=80"
    ],
    availability: "available"
  },
  {
    id: "milo",
    name: "Milo",
    species: "Cat",
    breed: "Domestic Shorthair",
    age: "9 months",
    size: "Small",
    energyLevel: "Medium",
    location: "Paso Robles, CA",
    description:
      "Milo is curious, gentle, and happiest near a sunny window. He warms up quickly with calm visitors.",
    compatibility: ["Good with cats", "Apartment friendly"],
    health: "Vaccinated, neutered",
    adoptionFee: 90,
    shelterName: "North County Shelter",
    shelterEmail: "cats@northcounty.test",
    imageUrls: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80"
    ],
    availability: "available"
  }
];

const emptyPet = {
  name: "",
  species: "Dog",
  breed: "",
  age: "",
  size: "Medium",
  energyLevel: "Medium",
  location: "",
  description: "",
  compatibility: "",
  health: "",
  adoptionFee: "0",
  shelterName: "",
  shelterEmail: "",
  imageUrls: ["", ""]
};

const emptyInquiry = {
  name: "",
  email: "",
  phone: "",
  housing: "",
  message: ""
};

const inquiryStatuses = ["new", "contacted", "approved", "rejected"];

function readJson(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function readToken() {
  return window.localStorage.getItem(authTokenKey) || INVALID_TOKEN;
}

function readRole() {
  return window.localStorage.getItem(authRoleKey) || "";
}

function readUsername() {
  return window.localStorage.getItem(authUsernameKey) || "";
}

function addAuthHeader(token, otherHeaders = {}) {
  if (token === INVALID_TOKEN) {
    return otherHeaders;
  } else {
    return {
      ...otherHeaders,
      Authorization: `Bearer ${token}`
    };
  }
}

async function apiRequest(path, options = {}, token = readToken()) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: addAuthHeader(token, {
      "Content-Type": "application/json",
      ...options.headers
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function normalizeInquiry(inquiry) {
  return {
    ...inquiry,
    id: inquiry.id || inquiry._id,
    petName: inquiry.pet?.name || inquiry.petName || "Unknown pet",
    name: inquiry.user?.name || inquiry.name || "Unknown adopter",
    email: inquiry.user?.email || inquiry.email || "No email provided",
    phone: inquiry.phone || "No phone provided",
    housing: inquiry.housing || "No housing information provided",
    message: inquiry.message || "No message provided",
    date: inquiry.date || inquiry.createdAt || ""
  };
}

function normalizePet(pet) {
  const imageUrls = Array.isArray(pet.imageUrls) && pet.imageUrls.length
    ? pet.imageUrls
    : [pet.image].filter(Boolean);

  return {
    ...pet,
    id: pet.id || pet._id,
    species: pet.species || pet.type || "Pet",
    imageUrls: normalizeImages(imageUrls),
    compatibility: Array.isArray(pet.compatibility) ? pet.compatibility : [],
    adoptionFee: Number(pet.adoptionFee || 0),
    availability: pet.availability || "available"
  };
}

function normalizeImages(imageUrls) {
  const cleaned = imageUrls.map((url) => url.trim()).filter(Boolean);
  return cleaned.length
    ? cleaned
    : ["/favicon.svg"];
}

function parseRoute() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "pets" && parts[1]) return { page: "profile", id: parts[1] };
  if (parts[0] === "favorites") return { page: "favorites" };
  if (parts[0] === "login") return { page: "login" };
  if (parts[0] === "signup") return { page: "signup" };
  if (parts[0] === "shelter" && parts[1] === "pets" && parts[2] && parts[3] === "photos") {
    return { page: "photos", id: parts[2] };
  }
  if (parts[0] === "shelter") return { page: "shelter" };
  return { page: "home" };
}

function AppChrome({ children, apiStatus, isAuthenticated, isOrganization, onLogout }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#/">
          <span className="brand-mark">PM</span>
          <span>Pet Adoption Match</span>
        </a>
        <nav className="nav-links">
          <a href="#/">Browse</a>
          <a href="#/favorites">Favorites</a>
          {isAuthenticated ? (
            <>
              {isOrganization ? <a className="nav-primary" href="#/shelter">Shelter portal</a> : null}
              <button type="button" className="nav-button" onClick={onLogout}>Log out</button>
            </>
          ) : (
            <>
              <a href="#/login">Log in</a>
              <a className="nav-primary" href="#/signup">Sign up</a>
            </>
          )}
        </nav>
      </header>
      {apiStatus ? <div className="api-banner">{apiStatus}</div> : null}
      <main>{children}</main>
    </div>
  );
}

function Photo({ src, alt, className = "", ...props }) {
  const imageSrc = src || "/favicon.svg";
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={failed ? "/favicon.svg" : imageSrc}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}

function Gallery({ pet }) {
  const photos = pet.imageUrls.length ? pet.imageUrls : ["/favicon.svg"];
  const [selected, setSelected] = useState(0);
  const selectedPhoto = photos[selected] || photos[0];

  return (
    <div className="gallery" data-cy="pet-gallery">
      <div className="gallery-main">
        <Photo
          src={selectedPhoto}
          alt={`${pet.name} photo ${selected + 1}`}
          className="gallery-main-image"
          data-cy="selected-pet-photo"
        />
      </div>
      <div className="gallery-thumbs">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={`${photo}-${index}`}
            onClick={() => setSelected(index)}
            aria-label={`Show ${pet.name} photo ${index + 1}`}
            data-cy="pet-photo-thumb"
            className={selected === index ? "thumb active" : "thumb"}
          >
            <Photo src={photo} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function LoginPage({ mode, handleSubmit, message, isAuthenticated }) {
  const isSignup = mode === "signup";

  return (
    <section className="auth-layout">
      <div className="panel auth-panel">
        <span className="eyebrow">{isSignup ? "Create account" : "Welcome back"}</span>
        <h1>{isSignup ? "Sign up" : "Log in"}</h1>
        {isAuthenticated ? <div className="success">You are authenticated.</div> : null}
        {message ? <div className="api-banner inline">{message}</div> : null}
        <Login
          handleSubmit={handleSubmit}
          buttonLabel={isSignup ? "Sign Up" : "Log In"}
          showRoleChoice={isSignup}
        />
        <p className="muted">
          {isSignup ? "Already have an account? " : "Need an account? "}
          <a className="text-link" href={isSignup ? "#/login" : "#/signup"}>
            {isSignup ? "Log in" : "Sign up"}
          </a>
        </p>
      </div>
    </section>
  );
}

function LoginRequired({ title = "Login required", message = "Sign in before creating pet profiles, managing photos, or sending adoption inquiries." }) {
  return (
    <section className="section">
      <div className="panel">
        <span className="eyebrow">Protected page</span>
        <h1>{title}</h1>
        <p>{message}</p>
        <div className="actions">
          <a className="button primary" href="#/login">Log in</a>
          <a className="button secondary" href="#/signup">Sign up</a>
        </div>
      </div>
    </section>
  );
}

function formatSubmittedDate(date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(parsedDate);
}

function HomePage({ pets }) {
  const visiblePets = pets.filter((pet) => pet.availability !== "adopted");
  const featured = visiblePets[0];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Shelter pet discovery MVP</span>
          <h1>Find adoptable pets faster.</h1>
          <p>
            Browse shelter pets, open detailed profiles, save favorites, and submit structured
            adoption interest from one focused workflow.
          </p>
          <div className="actions">
            <a className="button primary" href="#pets">Browse pets</a>
            <a className="button secondary" href="#/favorites">View favorites</a>
            <a className="button secondary" href="#/shelter">Add a pet</a>
          </div>
        </div>
        <div className="featured-card">
          {featured ? (
            <>
              <Photo src={featured.imageUrls[0]} alt={`${featured.name}, ${featured.breed}`} />
              <div>
                <span>Featured match</span>
                <h2>{featured.name}</h2>
                <p>{featured.breed} - {featured.age} - {featured.location}</p>
              </div>
            </>
          ) : (
            <p>No featured pets yet.</p>
          )}
        </div>
      </section>

      <section id="pets" className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Discovery feed</span>
            <h2>Available pets</h2>
          </div>
          <p>{visiblePets.length} pets ready to meet adopters</p>
        </div>
        <div className="pet-grid">
          {visiblePets.map((pet) => (
            <article className="pet-card" key={pet.id} data-cy="pet-card">
              <Photo src={pet.imageUrls[0]} alt={`${pet.name}, ${pet.breed}`} />
              <div className="card-body">
                <div className="card-title">
                  <div>
                    <h3>{pet.name}</h3>
                    <p>{pet.breed} - {pet.age}</p>
                  </div>
                  <span className="pill">{pet.availability}</span>
                </div>
                <p>{pet.description}</p>
                <p className="muted">{pet.location}</p>
                <a className="button dark" href={`#/pets/${pet.id}`} data-cy="pet-card-link">
                  View profile
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ProfilePage({ pet, favorites, setFavorites, addInquiry, isAuthenticated }) {
  const [form, setForm] = useState(emptyInquiry);
  const [status, setStatus] = useState("");
  const saved = favorites.includes(pet.id);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleFavorite() {
    const next = saved ? favorites.filter((id) => id !== pet.id) : [...favorites, pet.id];
    setFavorites(next);
    writeJson(favoritesKey, next);
  }

  async function submitInquiry(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      setStatus("Please log in before submitting an adoption inquiry.");
      return;
    }

    setStatus("Sending inquiry...");

    try {
      await addInquiry({
        pet: pet._id || pet.id,
        petId: pet.id,
        petName: pet.name,
        ...form,
        status: "new"
      });
      setForm(emptyInquiry);
      setStatus(`Inquiry sent for ${pet.name}. Shelter notification logged for the MVP.`);
    } catch {
      setStatus("Inquiry could not be saved. Check that the backend and MongoDB are running.");
    }
  }

  return (
    <section className="profile-layout">
      <a className="back-link" href="#/">Back to pets</a>
      <div className="profile-grid">
        <div className="profile-main">
          <Gallery pet={pet} />
          <div className="panel">
            <span className="eyebrow">Pet profile</span>
            <h1 data-cy="pet-profile-name">{pet.name}</h1>
            <p>{pet.description}</p>
            <p className="muted">{pet.location}</p>
          </div>
          <div className="panel">
            <h2>Details</h2>
            <div className="facts">
              {[
                ["Species", pet.species],
                ["Breed", pet.breed],
                ["Age", pet.age],
                ["Size", pet.size],
                ["Energy", pet.energyLevel],
                ["Fee", `$${pet.adoptionFee}`]
              ].map(([label, value]) => (
                <div key={label} className="fact">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div className="tag-row">
              {pet.compatibility.map((item) => <span key={item}>{item}</span>)}
            </div>
            <p><strong>Health:</strong> {pet.health}</p>
            <p><strong>Shelter:</strong> {pet.shelterName} - {pet.shelterEmail}</p>
          </div>
        </div>

        <aside className="panel sticky-panel">
          <button type="button" className="button save" onClick={toggleFavorite} data-cy="save-pet">
            {saved ? "Saved pet" : "Save pet"}
          </button>
          <a className="button dark" href="#inquiry-form" data-cy="start-inquiry">Start inquiry</a>
          <h2>I am interested</h2>
          <p>Send your contact and housing information so the shelter can evaluate fit.</p>
          {status ? <div className="success" data-cy="inquiry-success">{status}</div> : null}
          <form id="inquiry-form" className="form-grid" onSubmit={submitInquiry} data-cy="inquiry-form">
            <Field label="Name">
              <input required value={form.name} onChange={(event) => updateField("name", event.target.value)} data-cy="inquiry-name" />
            </Field>
            <Field label="Email">
              <input required type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} data-cy="inquiry-email" />
            </Field>
            <Field label="Phone">
              <input required value={form.phone} onChange={(event) => updateField("phone", event.target.value)} data-cy="inquiry-phone" />
            </Field>
            <Field label="Housing information">
              <textarea required value={form.housing} onChange={(event) => updateField("housing", event.target.value)} data-cy="inquiry-housing" />
            </Field>
            <Field label="Message">
              <textarea required value={form.message} onChange={(event) => updateField("message", event.target.value)} data-cy="inquiry-message" />
            </Field>
            <button type="submit" className="button primary" data-cy="submit-inquiry">Submit inquiry</button>
          </form>
        </aside>
      </div>
    </section>
  );
}

function FavoritesPage({ pets, favoriteIds }) {
  const favorites = pets.filter((pet) => favoriteIds.includes(pet.id));

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Saved pets</span>
          <h1>Favorites</h1>
        </div>
        <a className="button secondary" href="#/">Browse more pets</a>
      </div>
      {favorites.length === 0 ? (
        <div className="panel" data-cy="favorites-empty">No saved pets yet.</div>
      ) : (
        <div className="pet-grid" data-cy="favorites-list">
          {favorites.map((pet) => (
            <article className="pet-card" key={pet.id} data-cy="favorite-pet-card">
              <Photo src={pet.imageUrls[0]} alt={`${pet.name}, ${pet.breed}`} />
              <div className="card-body">
                <h2>{pet.name}</h2>
                <p>{pet.breed} - {pet.age}</p>
                <a className="button dark" href={`#/pets/${pet.id}`} data-cy="favorite-profile-link">
                  View profile
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ShelterPage({ pets, inquiries, addPet, updateInquiryStatus }) {
  const [form, setForm] = useState(emptyPet);
  const [status, setStatus] = useState("");
  const [inquiryStatusMessage, setInquiryStatusMessage] = useState("");
  const [updatingInquiryId, setUpdatingInquiryId] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateImage(index, value) {
    setForm((current) => {
      const imageUrls = [...current.imageUrls];
      imageUrls[index] = value;
      return { ...current, imageUrls };
    });
  }

  function addImageField() {
    setForm((current) => ({ ...current, imageUrls: [...current.imageUrls, ""] }));
  }

  function removeImageField(index) {
    setForm((current) => ({
      ...current,
      imageUrls: current.imageUrls.filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  async function submitPet(event) {
    event.preventDefault();
    const pet = {
      ...form,
      type: form.species,
      adoptionFee: Number(form.adoptionFee || 0),
      compatibility: form.compatibility.split(",").map((item) => item.trim()).filter(Boolean),
      imageUrls: normalizeImages(form.imageUrls),
      availability: "available"
    };

    setStatus("Saving pet profile...");

    try {
      const createdPet = await addPet(pet);
      setForm(emptyPet);
      setStatus(`${createdPet.name} was created and is now visible in the discovery feed.`);
    } catch {
      setStatus("Pet profile could not be saved. Check that the backend and MongoDB are running.");
    }
  }

  async function changeInquiryStatus(inquiry, nextStatus) {
    setInquiryStatusMessage(`Updating ${inquiry.petName} inquiry...`);
    setUpdatingInquiryId(inquiry.id);

    try {
      await updateInquiryStatus(inquiry.id, nextStatus);
      setInquiryStatusMessage(`${inquiry.petName} inquiry marked ${nextStatus}.`);
    } catch {
      setInquiryStatusMessage("Inquiry status could not be saved. Check that the backend is running.");
    } finally {
      setUpdatingInquiryId("");
    }
  }

  return (
    <section className="shelter-layout">
      <div className="panel">
        <span className="eyebrow">Shelter portal</span>
        <h1>Create a pet profile</h1>
        <p>Add the details adopters need to evaluate fit. Multiple photos are supported through image URLs for the MVP.</p>
        {status ? <div className="success" data-cy="pet-create-success">{status}</div> : null}
        <form className="form-grid" onSubmit={submitPet} data-cy="pet-create-form">
          <div className="two-col">
            <Field label="Pet name"><input required value={form.name} onChange={(event) => updateField("name", event.target.value)} data-cy="pet-name" /></Field>
            <Field label="Species"><select value={form.species} onChange={(event) => updateField("species", event.target.value)} data-cy="pet-species"><option>Dog</option><option>Cat</option><option>Other</option></select></Field>
            <Field label="Breed"><input required value={form.breed} onChange={(event) => updateField("breed", event.target.value)} data-cy="pet-breed" /></Field>
            <Field label="Age"><input required value={form.age} onChange={(event) => updateField("age", event.target.value)} data-cy="pet-age" /></Field>
            <Field label="Size"><select value={form.size} onChange={(event) => updateField("size", event.target.value)} data-cy="pet-size"><option>Small</option><option>Medium</option><option>Large</option></select></Field>
            <Field label="Energy level"><select value={form.energyLevel} onChange={(event) => updateField("energyLevel", event.target.value)} data-cy="pet-energy"><option>Low</option><option>Medium</option><option>High</option></select></Field>
            <Field label="Location"><input required value={form.location} onChange={(event) => updateField("location", event.target.value)} data-cy="pet-location" /></Field>
            <Field label="Adoption fee"><input type="number" min="0" value={form.adoptionFee} onChange={(event) => updateField("adoptionFee", event.target.value)} data-cy="pet-fee" /></Field>
            <Field label="Shelter name"><input required value={form.shelterName} onChange={(event) => updateField("shelterName", event.target.value)} data-cy="pet-shelter-name" /></Field>
            <Field label="Shelter email"><input required type="email" value={form.shelterEmail} onChange={(event) => updateField("shelterEmail", event.target.value)} data-cy="pet-shelter-email" /></Field>
          </div>
          <Field label="Description"><textarea required value={form.description} onChange={(event) => updateField("description", event.target.value)} data-cy="pet-description" /></Field>
          <Field label="Compatibility notes" hint="Comma-separated values"><input value={form.compatibility} onChange={(event) => updateField("compatibility", event.target.value)} data-cy="pet-compatibility" /></Field>
          <Field label="Health details"><input value={form.health} onChange={(event) => updateField("health", event.target.value)} data-cy="pet-health" /></Field>
          <div className="photo-editor">
            <div className="photo-editor-heading">
              <h2>Pet photos</h2>
              <button type="button" className="button secondary" onClick={addImageField} data-cy="add-photo-field">Add photo</button>
            </div>
            {form.imageUrls.map((url, index) => (
              <div className="photo-row" key={index}>
                <input aria-label={`Photo URL ${index + 1}`} value={url} onChange={(event) => updateImage(index, event.target.value)} data-cy="pet-photo-url" />
                <button type="button" onClick={() => removeImageField(index)}>Remove</button>
              </div>
            ))}
          </div>
          <button className="button primary" type="submit" data-cy="submit-pet">Create pet profile</button>
        </form>
      </div>
      <aside className="panel">
        <h2>Current pet profiles</h2>
        <div className="profile-list" data-cy="shelter-pet-list">
          {pets.map((pet) => (
            <article key={pet.id} data-cy="shelter-pet-item">
              <strong>{pet.name}</strong>
              <span>{pet.breed} - {pet.imageUrls.length} photo{pet.imageUrls.length === 1 ? "" : "s"}</span>
              <div className="mini-actions">
                <a href={`#/pets/${pet.id}`}>View profile</a>
                <a href={`#/shelter/pets/${pet.id}/photos`} data-cy="manage-photos-link">Manage photos</a>
              </div>
            </article>
          ))}
        </div>
      </aside>
      <section className="panel inquiry-panel">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">Adopter follow-up</span>
            <h2>Submitted inquiries</h2>
          </div>
          <p>{inquiries.length} total</p>
        </div>
        {inquiryStatusMessage ? (
          <div className="success" data-cy="inquiry-status-message">{inquiryStatusMessage}</div>
        ) : null}
        {inquiries.length === 0 ? (
          <div className="empty-state" data-cy="inquiries-empty">
            No adoption inquiries have been submitted yet.
          </div>
        ) : (
          <div className="inquiry-list" data-cy="inquiry-list">
            {inquiries.map((inquiry) => (
              <article className="inquiry-item" key={inquiry.id} data-cy="inquiry-item">
                <div className="inquiry-heading">
                  <div>
                    <h3>{inquiry.petName}</h3>
                    <p>{formatSubmittedDate(inquiry.date)}</p>
                  </div>
                  <label className="status-control">
                    <span>Status</span>
                    <select
                      value={inquiry.status || "new"}
                      onChange={(event) => changeInquiryStatus(inquiry, event.target.value)}
                      disabled={updatingInquiryId === inquiry.id}
                      data-cy="inquiry-status-select"
                    >
                      {inquiryStatuses.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="inquiry-details">
                  <div>
                    <span>Adopter</span>
                    <strong>{inquiry.name}</strong>
                    <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                    <a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a>
                  </div>
                  <div>
                    <span>Housing</span>
                    <p>{inquiry.housing}</p>
                  </div>
                  <div>
                    <span>Message</span>
                    <p>{inquiry.message}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function PhotoManagerPage({ pet, updatePetPhotos }) {
  const [imageUrls, setImageUrls] = useState(pet.imageUrls.length ? pet.imageUrls : [""]);
  const [status, setStatus] = useState("");
  const previewUrls = imageUrls.map((url) => url.trim()).filter((url) => /^https?:\/\//.test(url) || url.startsWith("/"));

  function updateImage(index, value) {
    setImageUrls((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  }

  async function savePhotos(event) {
    event.preventDefault();
    setStatus("Saving photos...");

    try {
      await updatePetPhotos(pet.id, normalizeImages(imageUrls));
      setStatus(`Photos updated for ${pet.name}.`);
    } catch {
      setStatus("Photos could not be saved. Check that the backend and MongoDB are running.");
    }
  }

  return (
    <section className="shelter-layout">
      <div className="panel">
        <a className="back-link" href="#/shelter">Back to shelter portal</a>
        <span className="eyebrow">Shelter photo manager</span>
        <h1>Manage {pet.name} photos</h1>
        {status ? <div className="success" data-cy="photo-manage-success">{status}</div> : null}
        <form className="form-grid" onSubmit={savePhotos} data-cy="photo-manage-form">
          {imageUrls.map((url, index) => (
            <Field label={`Photo URL ${index + 1}`} key={index}>
              <div className="photo-row">
                <input value={url} onChange={(event) => updateImage(index, event.target.value)} data-cy="managed-photo-url" />
                <button type="button" onClick={() => setImageUrls((current) => current.filter((_, itemIndex) => itemIndex !== index).length ? current.filter((_, itemIndex) => itemIndex !== index) : [""])} data-cy="remove-managed-photo">Remove</button>
              </div>
            </Field>
          ))}
          <div className="actions">
            <button type="button" className="button secondary" onClick={() => setImageUrls((current) => [...current, ""])} data-cy="add-managed-photo">Add photo</button>
            <button type="submit" className="button primary" data-cy="save-managed-photos">Save photos</button>
          </div>
        </form>
      </div>
      <aside className="panel">
        <h2>Current gallery</h2>
        <div className="preview-grid" data-cy="managed-photo-preview-list">
          {previewUrls.map((url, index) => (
            <Photo key={`${url}-${index}`} src={url} alt={`${pet.name} preview ${index + 1}`} className="preview-img" />
          ))}
          {previewUrls.map((url, index) => (
            <img key={`${url}-cy-${index}`} src={url} alt="" data-cy="managed-photo-preview" hidden />
          ))}
        </div>
      </aside>
    </section>
  );
}

function NotFound() {
  return (
    <section className="section">
      <div className="panel">
        <h1>Pet not found</h1>
        <a className="button secondary" href="#/">Back to pets</a>
      </div>
    </section>
  );
}

function MyApp() {
  const [route, setRoute] = useState(parseRoute);
  const [pets, setPets] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [favorites, setFavorites] = useState(() => readJson(favoritesKey, []));
  const [token, setToken] = useState(readToken);
  const [role, setRole] = useState(readRole);
  const [username, setUsername] = useState(readUsername);
  const [message, setMessage] = useState("");
  const [apiStatus, setApiStatus] = useState("Loading pets from backend...");
  const isAuthenticated = token !== INVALID_TOKEN;
  const isOrganization = role === "organization";

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadPets() {
      try {
        let backendPets = await apiRequest("/pets");

        if (backendPets.length === 0) {
          backendPets = seedPets;
        }

        if (!ignore) {
          setPets(backendPets.map(normalizePet));
          setApiStatus(backendPets === seedPets ? "Showing starter pet data. Log in to create saved backend records." : "");
        }
      } catch {
        if (!ignore) {
          setPets([]);
          setApiStatus("Backend unavailable. Start Express on port 8000 with MongoDB configured.");
        }
      }
    }

    loadPets();
    return () => {
      ignore = true;
    };
  }, []);

  function saveAuth(payload, fallbackUsername) {
    const nextRole = payload.role || "adopter";
    const nextUsername = payload.username || fallbackUsername || "";

    window.localStorage.setItem(authTokenKey, payload.token);
    window.localStorage.setItem(authRoleKey, nextRole);
    window.localStorage.setItem(authUsernameKey, nextUsername);
    setToken(payload.token);
    setRole(nextRole);
    setUsername(nextUsername);
  }

  function logoutUser() {
    window.localStorage.removeItem(authTokenKey);
    window.localStorage.removeItem(authRoleKey);
    window.localStorage.removeItem(authUsernameKey);
    setToken(INVALID_TOKEN);
    setRole("");
    setUsername("");
    setMessage("Logged out.");
    window.location.hash = "#/";
  }

  function loginUser(creds) {
    const promise = fetch(`${apiBaseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(creds)
    })
      .then((response) => {
        if (response.status === 200) {
          response
            .json()
            .then((payload) => {
              saveAuth(payload, creds.username);
              window.location.hash = payload.role === "organization" ? "#/shelter" : "#/";
            });
          setMessage("Login successful; auth token saved");
        } else {
          setMessage(`Login Error ${response.status}: Unauthorized`);
        }
      })
      .catch((error) => {
        setMessage(`Login Error: ${error}`);
      });

    return promise;
  }

  function signupUser(creds) {
    const promise = fetch(`${apiBaseUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(creds)
    })
      .then((response) => {
        if (response.status === 201) {
          response
            .json()
            .then((payload) => {
              saveAuth(payload, creds.username);
              window.location.hash = payload.role === "organization" ? "#/shelter" : "#/";
            });
          setMessage(`Signup successful for user: ${creds.username}; auth token saved`);
        } else {
          response.text().then((errorMessage) => {
            setMessage(errorMessage || `Signup Error ${response.status}`);
          });
        }
      })
      .catch((error) => {
        setMessage(`Signup Error: ${error}`);
      });

    return promise;
  }

  useEffect(() => {
    let ignore = false;

    async function loadInquiries() {
      if (!isOrganization) {
        setInquiries([]);
        return;
      }

      try {
        const backendInquiries = await apiRequest("/inquiries", {}, token);

        if (!ignore) {
          setInquiries(backendInquiries.map(normalizeInquiry));
        }
      } catch {
        if (!ignore) {
          setInquiries([]);
        }
      }
    }

    loadInquiries();
    return () => {
      ignore = true;
    };
  }, [isOrganization, token]);

  async function addPet(pet) {
    const createdPet = normalizePet(await apiRequest("/pets", {
      method: "POST",
      body: JSON.stringify(pet)
    }, token));
    setPets((current) => [createdPet, ...current]);
    return createdPet;
  }

  async function addInquiry(inquiry) {
    const createdInquiry = normalizeInquiry(await apiRequest("/inquiries", {
      method: "POST",
      body: JSON.stringify(inquiry)
    }, token));
    setInquiries((current) => [createdInquiry, ...current]);
    return createdInquiry;
  }

  async function updateInquiryStatus(id, status) {
    const updatedInquiry = normalizeInquiry(await apiRequest(`/inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }, token));
    setInquiries((current) =>
      current.map((inquiry) => (inquiry.id === id ? updatedInquiry : inquiry))
    );
    return updatedInquiry;
  }

  async function updatePetPhotos(id, imageUrls) {
    const updatedPet = normalizePet(await apiRequest(`/pets/${id}/photos`, {
      method: "PATCH",
      body: JSON.stringify({ imageUrls })
    }, token));
    setPets((current) => current.map((pet) => (pet.id === id ? updatedPet : pet)));
    return updatedPet;
  }

  const pet = useMemo(() => pets.find((item) => item.id === route.id), [pets, route.id]);

  let page;
  if (route.page === "login") page = <LoginPage mode="login" handleSubmit={loginUser} message={message} isAuthenticated={isAuthenticated} />;
  else if (route.page === "signup") page = <LoginPage mode="signup" handleSubmit={signupUser} message={message} isAuthenticated={isAuthenticated} />;
  else if (route.page === "profile") page = pet ? <ProfilePage pet={pet} favorites={favorites} setFavorites={setFavorites} addInquiry={addInquiry} isAuthenticated={isAuthenticated} /> : <NotFound />;
  else if (route.page === "favorites") page = <FavoritesPage pets={pets} favoriteIds={favorites} />;
  else if (route.page === "shelter") page = isOrganization ? <ShelterPage pets={pets.filter((item) => item.ownerUsername === username)} inquiries={inquiries} addPet={addPet} updateInquiryStatus={updateInquiryStatus} /> : <LoginRequired title={isAuthenticated ? "Organization account required" : "Log in to use the shelter portal"} message={isAuthenticated ? "Only organization accounts can create and manage pet profiles." : undefined} />;
  else if (route.page === "photos") page = isOrganization ? (pet ? <PhotoManagerPage pet={pet} updatePetPhotos={updatePetPhotos} /> : <NotFound />) : <LoginRequired title={isAuthenticated ? "Organization account required" : "Log in to manage photos"} message={isAuthenticated ? "Only organization accounts can manage pet photos." : undefined} />;
  else page = <HomePage pets={pets} />;

  return <AppChrome apiStatus={apiStatus} isAuthenticated={isAuthenticated} isOrganization={isOrganization} onLogout={logoutUser}>{page}</AppChrome>;
}

export default MyApp;
