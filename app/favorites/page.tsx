"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, Trash2 } from "lucide-react";
import { AppChrome } from "@/components/AppChrome";
import { readFavoriteIds, writeFavoriteIds } from "@/lib/favorites";
import type { Pet } from "@/lib/types";

export default function FavoritesPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setFavoriteIds(readFavoriteIds());
    fetch("/api/pets")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load pets");
        return response.json();
      })
      .then((data: { pets: Pet[] }) => setPets(data.pets))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const favorites = useMemo(
    () => pets.filter((pet) => favoriteIds.includes(pet.id)),
    [favoriteIds, pets],
  );

  function removeFavorite(id: string) {
    const nextIds = favoriteIds.filter((favoriteId) => favoriteId !== id);
    writeFavoriteIds(nextIds);
    setFavoriteIds(nextIds);
  }

  return (
    <AppChrome>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clay">
              Saved pets
            </p>
            <h1 className="text-3xl font-bold text-ink">Favorites</h1>
          </div>
          <Link
            href="/"
            className="focus-ring inline-flex w-fit items-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm"
          >
            Browse more pets
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-lg border border-ink/10 bg-white p-8 text-ink/60">
            Loading favorites...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-red-700">
            {error}
          </div>
        ) : favorites.length === 0 ? (
          <div
            className="rounded-lg border border-ink/10 bg-white p-8 text-ink/65"
            data-cy="favorites-empty"
          >
            No saved pets yet. Open a pet profile and save it to compare later.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-cy="favorites-list">
            {favorites.map((pet) => (
              <article
                key={pet.id}
                className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm"
                data-cy="favorite-pet-card"
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
                      <h2 className="text-xl font-bold text-ink">{pet.name}</h2>
                      <p className="text-sm text-ink/65">
                        {pet.breed} • {pet.age}
                      </p>
                    </div>
                    <Heart size={18} className="fill-clay text-clay" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-ink/55">
                    <MapPin size={15} aria-hidden="true" />
                    {pet.location}
                  </div>
                  <Link
                    href={`/pets/${pet.id}`}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-ink/90"
                    data-cy="favorite-profile-link"
                  >
                    View profile
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFavorite(pet.id)}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-ink/15 px-3 py-2 text-sm font-semibold text-ink hover:bg-paper"
                    data-cy="remove-favorite"
                  >
                    Remove
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppChrome>
  );
}
