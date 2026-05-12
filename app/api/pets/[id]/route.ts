import { NextResponse } from "next/server";
import { getPet, updatePetPhotos, updatePetStatus } from "@/lib/store";
import type { PetStatus } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pet = await getPet(id);
  if (!pet) return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  return NextResponse.json({ pet });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const pet =
      body.status !== undefined
        ? await updatePetStatus(id, body.status as PetStatus)
        : await updatePetPhotos(id, body.imageUrls);
    return NextResponse.json({ pet });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update pet" },
      { status: 400 },
    );
  }
}
