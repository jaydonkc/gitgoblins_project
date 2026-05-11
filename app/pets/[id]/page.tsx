"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Heart, Mail, MapPin, Send } from "lucide-react";
import { AppChrome } from "@/components/AppChrome";
import { PetGallery } from "@/components/PetGallery";
import { TextAreaField, TextField } from "@/components/Field";
import { readFavoriteIds, toggleFavoriteId } from "@/lib/favorites";
import type { Pet } from "@/lib/types";

type InquiryForm = {
  name: string;
  email: string;
  phone: string;
  housing: string;
  message: string;
};

const emptyInquiry: InquiryForm = {
  name: "",
  email: "",
  phone: "",
  housing: "",
  message: "",
};

export default function PetProfilePage() {
  const params = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<InquiryForm>(emptyInquiry);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(readFavoriteIds());
  }, []);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/pets/${params.id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Pet profile not found");
        return response.json();
      })
      .then((data: { pet: Pet }) => setPet(data.pet))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  const profileFacts = useMemo(() => {
    if (!pet) return [];
    return [
      ["Species", pet.species],
      ["Breed", pet.breed],
      ["Age", pet.age],
      ["Size", pet.size],
      ["Energy", pet.energyLevel],
      ["Fee", `$${pet.adoptionFee}`],
    ];
  }, [pet]);

  function updateField(field: keyof InquiryForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleSavedPet() {
    if (!pet) return;
    setFavoriteIds(toggleFavoriteId(pet.id));
  }

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pet) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petId: pet.id, ...form }),
    });
    const data = await response.json();

    setSubmitting(false);
    if (!response.ok) {
      setError(data.error ?? "Unable to submit inquiry");
      return;
    }

    setForm(emptyInquiry);
    setSuccess(`Inquiry sent for ${pet.name}. The shelter can follow up from the dashboard.`);
  }

  return (
    <AppChrome>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="focus-ring mb-6 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold text-ink/70 hover:bg-white"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to pets
        </Link>

        {loading ? (
          <div className="rounded-lg border border-ink/10 bg-white p-8 text-ink/60">
            Loading profile...
          </div>
        ) : error && !pet ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-red-700">
            {error}
          </div>
        ) : pet ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
            <div className="grid gap-6">
              <PetGallery imageUrls={pet.imageUrls} name={pet.name} />
              <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-clay">
                  Pet profile
                </p>
                <h1 className="mt-1 text-4xl font-bold text-ink" data-cy="pet-profile-name">
                  {pet.name}
                </h1>
                <p className="mt-3 max-w-3xl leading-7 text-ink/70">{pet.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm text-ink/60">
                  <MapPin size={16} aria-hidden="true" />
                  {pet.location}
                </div>
              </div>
              <div className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-ink">Details</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {profileFacts.map(([label, value]) => (
                    <div key={label} className="rounded-md bg-paper p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                        {label}
                      </p>
                      <p className="mt-1 font-semibold text-ink">{value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Compatibility</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pet.compatibility.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-moss/10 px-3 py-1 text-sm font-medium text-moss"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-ink/70">
                  <strong className="text-ink">Health:</strong> {pet.health}
                </p>
                <p className="text-sm text-ink/70">
                  <strong className="text-ink">Shelter:</strong> {pet.shelterName}{" "}
                  <span className="inline-flex items-center gap-1">
                    <Mail size={14} aria-hidden="true" />
                    {pet.shelterEmail}
                  </span>
                </p>
              </div>
            </div>

            <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5 shadow-panel">
              <div className="mb-5 grid gap-3">
                <button
                  type="button"
                  onClick={toggleSavedPet}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-clay/30 bg-clay/10 px-4 py-2.5 text-sm font-semibold text-clay hover:bg-clay/15"
                  data-cy="save-pet"
                >
                  <Heart
                    size={16}
                    aria-hidden="true"
                    className={favoriteIds.includes(pet.id) ? "fill-clay" : ""}
                  />
                  {favoriteIds.includes(pet.id) ? "Saved pet" : "Save pet"}
                </button>
                <a
                  href="#inquiry-form"
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink/90"
                  data-cy="start-inquiry"
                >
                  Start inquiry
                  <Send size={16} aria-hidden="true" />
                </a>
              </div>
              <h2 className="text-2xl font-bold text-ink">I am interested</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                Send your contact and housing information to help the shelter decide
                whether this is a good fit.
              </p>

              {success ? (
                <div
                  className="mt-5 flex gap-3 rounded-md border border-moss/20 bg-moss/10 p-4 text-sm text-moss"
                  data-cy="inquiry-success"
                >
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{success}</span>
                </div>
              ) : null}
              {error && pet ? (
                <div
                  className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  data-cy="inquiry-error"
                >
                  {error}
                </div>
              ) : null}

              <form
                id="inquiry-form"
                className="mt-5 grid gap-4"
                onSubmit={submitInquiry}
                data-cy="inquiry-form"
              >
                <TextField
                  label="Name"
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  data-cy="inquiry-name"
                />
                <TextField
                  label="Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  data-cy="inquiry-email"
                />
                <TextField
                  label="Phone"
                  required
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  data-cy="inquiry-phone"
                />
                <TextAreaField
                  label="Housing information"
                  required
                  value={form.housing}
                  onChange={(event) => updateField("housing", event.target.value)}
                  data-cy="inquiry-housing"
                />
                <TextAreaField
                  label="Message"
                  required
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  data-cy="inquiry-message"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-moss px-4 py-2.5 text-sm font-semibold text-white hover:bg-moss/90 disabled:cursor-not-allowed disabled:opacity-60"
                  data-cy="submit-inquiry"
                >
                  {submitting ? "Sending..." : "Submit inquiry"}
                  <Send size={16} aria-hidden="true" />
                </button>
              </form>
            </aside>
          </div>
        ) : null}
      </section>
    </AppChrome>
  );
}
