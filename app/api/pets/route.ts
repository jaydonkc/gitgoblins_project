import { NextResponse } from "next/server";
import { createPet, listPets } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ pets: await listPets() });
}

export async function POST(request: Request) {
  try {
    const pet = await createPet(await request.json());
    return NextResponse.json({ pet }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create pet" },
      { status: 400 },
    );
  }
}
