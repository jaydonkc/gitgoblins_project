"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { AppChrome } from "@/components/AppChrome";
import { SelectField, TextAreaField, TextField } from "@/components/Field";
import type { Pet } from "@/lib/types";

type PetForm = {
  name: string;
  species: string;
  breed: string;
  age: string;
  size: string;
  energyLevel: string;
  location: string;
  description: string;
  compatibility: string;
  health: string;
  adoptionFee: string;
  shelterName: string;
  shelterEmail: string;
  imageUrls: string[];
};

const emptyPet: PetForm = {
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
  imageUrls: ["", ""],
};

export default function ShelterPage() {
  const [form, setForm] = useState<PetForm>(emptyPet);
  const [pets, setPets] = useState<Pet[]>([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/pets")
      .then((response) => response.json())
      .then((data: { pets: Pet[] }) => setPets(data.pets));
  }, []);

  function updateField(field: keyof PetForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateImage(index: number, value: string) {
    setForm((current) => {
      const imageUrls = [...current.imageUrls];
      imageUrls[index] = value;
      return { ...current, imageUrls };
    });
  }

  function addImageField() {
    setForm((current) => ({ ...current, imageUrls: [...current.imageUrls, ""] }));
  }

  function removeImageField(index: number) {
    setForm((current) => ({
      ...current,
      imageUrls: current.imageUrls.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function submitPet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    setError("");

    const response = await fetch("/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        adoptionFee: Number(form.adoptionFee),
        compatibility: form.compatibility
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        imageUrls: form.imageUrls.map((item) => item.trim()).filter(Boolean),
      }),
    });
    const data = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to create pet");
      return;
    }

    setForm(emptyPet);
    setPets((current) => [data.pet, ...current]);
    setStatus(`${data.pet.name} was created and is now visible in the discovery feed.`);
  }

  async function updateStatus(petId: string, petStatus: Pet["status"]) {
    setStatus("");
    setError("");

    const response = await fetch(`/api/pets/${petId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: petStatus }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to update pet status");
      return;
    }

    setPets((current) => current.map((pet) => (pet.id === petId ? data.pet : pet)));
    setStatus(`${data.pet.name} is now marked ${data.pet.status}.`);
  }

  return (
    <AppChrome>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-panel">
          <p className="text-sm font-semibold uppercase tracking-wide text-clay">Shelter portal</p>
          <h1 className="mt-1 text-3xl font-bold text-ink">Create a pet profile</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
            Add the details adopters need to evaluate fit. Multiple photos are supported through
            image URLs for the MVP.
          </p>

          {status ? (
            <div
              className="mt-5 rounded-md border border-moss/20 bg-moss/10 p-4 text-sm text-moss"
              data-cy="pet-create-success"
            >
              {status}
            </div>
          ) : null}
          {error ? (
            <div
              className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              data-cy="pet-create-error"
            >
              {error}
            </div>
          ) : null}

          <form className="mt-6 grid gap-4" onSubmit={submitPet} data-cy="pet-create-form">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Pet name"
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                data-cy="pet-name"
              />
              <SelectField
                label="Species"
                value={form.species}
                onChange={(event) => updateField("species", event.target.value)}
                data-cy="pet-species"
              >
                <option>Dog</option>
                <option>Cat</option>
                <option>Other</option>
              </SelectField>
              <TextField
                label="Breed"
                required
                value={form.breed}
                onChange={(event) => updateField("breed", event.target.value)}
                data-cy="pet-breed"
              />
              <TextField
                label="Age"
                required
                value={form.age}
                onChange={(event) => updateField("age", event.target.value)}
                data-cy="pet-age"
              />
              <SelectField
                label="Size"
                value={form.size}
                onChange={(event) => updateField("size", event.target.value)}
                data-cy="pet-size"
              >
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </SelectField>
              <SelectField
                label="Energy level"
                value={form.energyLevel}
                onChange={(event) => updateField("energyLevel", event.target.value)}
                data-cy="pet-energy"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </SelectField>
              <TextField
                label="Location"
                required
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                data-cy="pet-location"
              />
              <TextField
                label="Adoption fee"
                type="number"
                min="0"
                value={form.adoptionFee}
                onChange={(event) => updateField("adoptionFee", event.target.value)}
                data-cy="pet-fee"
              />
              <TextField
                label="Shelter name"
                required
                value={form.shelterName}
                onChange={(event) => updateField("shelterName", event.target.value)}
                data-cy="pet-shelter-name"
              />
              <TextField
                label="Shelter email"
                required
                type="email"
                value={form.shelterEmail}
                onChange={(event) => updateField("shelterEmail", event.target.value)}
                data-cy="pet-shelter-email"
              />
            </div>

            <TextAreaField
              label="Description"
              required
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              data-cy="pet-description"
            />
            <TextField
              label="Compatibility notes"
              hint="Comma-separated, e.g. Good with kids, Apartment friendly"
              value={form.compatibility}
              onChange={(event) => updateField("compatibility", event.target.value)}
              data-cy="pet-compatibility"
            />
            <TextField
              label="Health details"
              value={form.health}
              onChange={(event) => updateField("health", event.target.value)}
              data-cy="pet-health"
            />

            <div className="grid gap-3 rounded-md border border-ink/10 bg-paper p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-ink">Pet photos</h2>
                  <p className="text-sm text-ink/60">Add one or more image URLs.</p>
                </div>
                <button
                  type="button"
                  onClick={addImageField}
                  className="focus-ring inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm"
                  data-cy="add-photo-field"
                >
                  <ImagePlus size={16} aria-hidden="true" />
                  Add photo
                </button>
              </div>
              {form.imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    aria-label={`Photo URL ${index + 1}`}
                    value={url}
                    onChange={(event) => updateImage(index, event.target.value)}
                    className="focus-ring min-w-0 flex-1 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm shadow-sm"
                    data-cy="pet-photo-url"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="focus-ring rounded-md border border-ink/15 bg-white p-2 text-ink/70"
                    aria-label={`Remove photo URL ${index + 1}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-moss px-4 py-2.5 text-sm font-semibold text-white hover:bg-moss/90 disabled:cursor-not-allowed disabled:opacity-60"
              data-cy="submit-pet"
            >
              {submitting ? "Creating..." : "Create pet profile"}
              <Plus size={16} aria-hidden="true" />
            </button>
          </form>
        </div>

        <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-ink">Current pet profiles</h2>
          <div className="mt-4 grid gap-3" data-cy="shelter-pet-list">
            {pets.map((pet) => (
              <article
                key={pet.id}
                className="rounded-md border border-ink/10 p-3"
                data-cy="shelter-pet-item"
              >
                <p className="font-semibold text-ink">{pet.name}</p>
                <p className="text-sm text-ink/60">
                  {pet.breed} • {pet.imageUrls.length} photo
                  {pet.imageUrls.length === 1 ? "" : "s"}
                </p>
                <label className="mt-3 grid gap-1 text-xs font-semibold text-ink/70">
                  Availability
                  <select
                    value={pet.status}
                    onChange={(event) => updateStatus(pet.id, event.target.value as Pet["status"])}
                    className="focus-ring rounded-md border border-ink/15 bg-white px-2 py-1.5 text-sm font-medium text-ink"
                    data-cy="pet-status"
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="adopted">Adopted</option>
                  </select>
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/pets/${pet.id}`}
                    className="focus-ring rounded-md bg-ink px-3 py-2 text-xs font-semibold text-white hover:bg-ink/90"
                  >
                    View profile
                  </Link>
                  <Link
                    href={`/shelter/pets/${pet.id}/photos`}
                    className="focus-ring rounded-md border border-ink/15 px-3 py-2 text-xs font-semibold text-ink hover:bg-paper"
                    data-cy="manage-photos-link"
                  >
                    Manage photos
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </AppChrome>
  );
}
