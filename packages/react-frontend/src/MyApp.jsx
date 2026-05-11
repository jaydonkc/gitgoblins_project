import { useEffect, useMemo, useState } from "react";

const petsKey = "gitgoblins:pets";
const inquiriesKey = "gitgoblins:inquiries";
const favoritesKey = "gitgoblins:favorites";

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

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
  if (parts[0] === "shelter" && parts[1] === "pets" && parts[2] && parts[3] === "photos") {
    return { page: "photos", id: parts[2] };
  }
  if (parts[0] === "shelter") return { page: "shelter" };
  return { page: "home" };
}

function AppChrome({ children }) {
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
          <a className="nav-primary" href="#/shelter">Shelter portal</a>
        </nav>
      </header>
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

function ProfilePage({ pet, favorites, setFavorites, addInquiry }) {
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

  function submitInquiry(event) {
    event.preventDefault();
    addInquiry({
      id: makeId("inquiry"),
      petId: pet.id,
      petName: pet.name,
      ...form,
      status: "new",
      createdAt: new Date().toISOString()
    });
    setForm(emptyInquiry);
    setStatus(`Inquiry sent for ${pet.name}. Shelter notification logged for the MVP.`);
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

function ShelterPage({ pets, addPet }) {
  const [form, setForm] = useState(emptyPet);
  const [status, setStatus] = useState("");

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

  function submitPet(event) {
    event.preventDefault();
    const pet = {
      ...form,
      id: makeId("pet"),
      adoptionFee: Number(form.adoptionFee || 0),
      compatibility: form.compatibility.split(",").map((item) => item.trim()).filter(Boolean),
      imageUrls: normalizeImages(form.imageUrls),
      availability: "available"
    };
    addPet(pet);
    setForm(emptyPet);
    setStatus(`${pet.name} was created and is now visible in the discovery feed.`);
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

  function savePhotos(event) {
    event.preventDefault();
    updatePetPhotos(pet.id, normalizeImages(imageUrls));
    setStatus(`Photos updated for ${pet.name}.`);
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
  const [pets, setPets] = useState(() => readJson(petsKey, seedPets));
  const [favorites, setFavorites] = useState(() => readJson(favoritesKey, []));
  const [inquiries, setInquiries] = useState(() => readJson(inquiriesKey, []));

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => writeJson(petsKey, pets), [pets]);
  useEffect(() => writeJson(inquiriesKey, inquiries), [inquiries]);

  function addPet(pet) {
    setPets((current) => [pet, ...current]);
  }

  function addInquiry(inquiry) {
    setInquiries((current) => [inquiry, ...current]);
  }

  function updatePetPhotos(id, imageUrls) {
    setPets((current) => current.map((pet) => (pet.id === id ? { ...pet, imageUrls } : pet)));
  }

  const pet = useMemo(() => pets.find((item) => item.id === route.id), [pets, route.id]);

  let page;
  if (route.page === "profile") page = pet ? <ProfilePage pet={pet} favorites={favorites} setFavorites={setFavorites} addInquiry={addInquiry} /> : <NotFound />;
  else if (route.page === "favorites") page = <FavoritesPage pets={pets} favoriteIds={favorites} />;
  else if (route.page === "shelter") page = <ShelterPage pets={pets} addPet={addPet} />;
  else if (route.page === "photos") page = pet ? <PhotoManagerPage pet={pet} updatePetPhotos={updatePetPhotos} /> : <NotFound />;
  else page = <HomePage pets={pets} />;

  return <AppChrome>{page}</AppChrome>;
}

export default MyApp;
