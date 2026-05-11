"use client";

import { useState } from "react";

export function PetGallery({ imageUrls, name }: { imageUrls: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const photos = imageUrls.length ? imageUrls : ["/placeholder.svg"];
  const selectedPhoto = photos[selected] ?? "/placeholder.svg";

  return (
    <div className="grid gap-3" data-cy="pet-gallery">
      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-ink/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selectedPhoto}
          alt={`${name} photo ${selected + 1}`}
          className="h-full w-full object-cover"
          data-cy="selected-pet-photo"
          onError={(event) => {
            event.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={`${photo}-${index}`}
            onClick={() => setSelected(index)}
            className="focus-ring aspect-square overflow-hidden rounded-md border border-ink/10 bg-white"
            aria-label={`Show ${name} photo ${index + 1}`}
            data-cy="pet-photo-thumb"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt=""
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = "/placeholder.svg";
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
