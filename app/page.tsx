"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, PawPrint } from "lucide-react";
import { AppChrome } from "@/components/AppChrome";
import type { Pet } from "@/lib/types";

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/pets")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load pets");
        return response.json();
      })
      .then((data: { pets: Pet[] }) => setPets(data.pets))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppChrome>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
        <div className="flex flex-col justify-center gap-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-moss shadow-sm">
            <PawPrint size={16} aria-hidden="true" />
            Shelter pet discovery MVP
          </div>
          <div className="grid gap-3">
            <h1 className="max-w-xl text-4xl font-bold tracking-normal text-ink sm:text-5xl">
              Find adoptable pets faster.
            </h1>
            <p className="max-w-xl text-base leading-7 text-ink/70">
              Browse shelter pets, open detailed profiles, save favorites, and submit
              structured adoption interest from one focused workflow.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#pets"
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-moss px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-moss/90"
            >
              Browse pets
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <Link
              href="/favorites"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm hover:bg-white/80"
            >
              View favorites
            </Link>
            <Link
              href="/shelter"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm hover:bg-white/80"
            >
              Add a pet
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-panel">
          {pets[0] ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pets[0].imageUrls[0] ?? "/placeholder.svg"}
                alt={`${pets[0].name}, ${pets[0].breed}`}
                className="h-80 w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="grid gap-2 p-5">
                <p className="text-sm font-medium text-moss">Featured match</p>
                <h2 className="text-2xl font-bold text-ink">{pets[0].name}</h2>
                <p className="text-sm text-ink/65">
                  {pets[0].breed} • {pets[0].age} • {pets[0].location}
                </p>
              </div>
            </>
          ) : (
            <div className="grid min-h-96 place-items-center p-8 text-center text-ink/60">
              Featured pet will appear once data loads.
            </div>
          )}
        </div>
      </section>

      <section id="pets" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clay">
              Discovery feed
            </p>
            <h2 className="text-2xl font-bold text-ink">Available pets</h2>
          </div>
          <p className="text-sm text-ink/60">{pets.length} pets ready to meet adopters</p>
        </div>

        {loading ? (
          <div className="rounded-lg border border-ink/10 bg-white p-8 text-ink/60">
            Loading pets...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-red-700">
            {error}
          </div>
        ) : pets.length === 0 ? (
          <div className="rounded-lg border border-ink/10 bg-white p-8 text-ink/60">
            No pets are available yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <article
                key={pet.id}
                className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm"
                data-cy="pet-card"
              >
                <div className="aspect-[4/3] overflow-hidden bg-ink/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pet.imageUrls[0] ?? "/placeholder.svg"}
                    alt={`${pet.name}, ${pet.breed}`}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="grid gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-ink">{pet.name}</h3>
                      <p className="text-sm text-ink/65">
                        {pet.breed} • {pet.age}
                      </p>
                    </div>
                    <span className="rounded-full bg-moss/10 px-2 py-1 text-xs font-semibold text-moss">
                      {pet.status}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm leading-6 text-ink/70">{pet.description}</p>
                  <div className="flex items-center gap-1 text-sm text-ink/55">
                    <MapPin size={15} aria-hidden="true" />
                    {pet.location}
                  </div>
                  <Link
                    href={`/pets/${pet.id}`}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-ink/90"
                    data-cy="pet-card-link"
                  >
                    View profile
                    <Heart size={15} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppChrome>
  );
}
