import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Inquiry, Pet } from "./types";

type Db = {
  pets: Pet[];
  inquiries: Inquiry[];
};

const dataDir =
  process.env.PET_ADOPTION_DATA_DIR ??
  (process.env.VERCEL ? "/tmp/gitgoblins-pet-adoption" : path.join(process.cwd(), ".data"));
const dbPath = path.join(dataDir, "db.json");

const seedPets: Pet[] = [
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
      "Luna is a bright, active companion who loves long walks, puzzle toys, and meeting patient adopters.",
    compatibility: ["Good with older kids", "Best as only dog"],
    health: "Vaccinated, spayed, microchipped",
    adoptionFee: 175,
    shelterName: "Central Coast Rescue",
    shelterEmail: "adoptions@centralcoastrescue.test",
    imageUrls: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1200&q=80",
    ],
    status: "available",
    createdAt: "2026-05-01T12:00:00.000Z",
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
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80",
    ],
    status: "available",
    createdAt: "2026-05-01T12:00:00.000Z",
  },
];

async function readDb(): Promise<Db> {
  await mkdir(dataDir, { recursive: true });
  try {
    const raw = await readFile(dbPath, "utf8");
    return JSON.parse(raw) as Db;
  } catch {
    const db = { pets: seedPets, inquiries: [] };
    await writeDb(db);
    return db;
  }
}

async function writeDb(db: Db) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, JSON.stringify(db, null, 2));
}

function cleanImages(imageUrls: unknown): string[] {
  if (!Array.isArray(imageUrls)) return [];
  return imageUrls
    .map((url) => String(url).trim())
    .filter(Boolean)
    .slice(0, 6);
}

export async function resetDb() {
  const db = { pets: seedPets, inquiries: [] };
  await writeDb(db);
  return db;
}

export async function listPets() {
  const db = await readDb();
  return db.pets.filter((pet) => pet.status !== "adopted");
}

export async function getPet(id: string) {
  const db = await readDb();
  return db.pets.find((pet) => pet.id === id) ?? null;
}

export async function createPet(input: Partial<Pet>) {
  const required = [
    "name",
    "species",
    "breed",
    "age",
    "size",
    "energyLevel",
    "location",
    "description",
    "shelterName",
    "shelterEmail",
  ] as const;
  const missing = required.filter((field) => !String(input[field] ?? "").trim());
  if (missing.length) {
    throw new Error(`Missing required pet fields: ${missing.join(", ")}`);
  }

  const db = await readDb();
  const pet: Pet = {
    id: randomUUID(),
    name: String(input.name).trim(),
    species: String(input.species).trim(),
    breed: String(input.breed).trim(),
    age: String(input.age).trim(),
    size: String(input.size).trim(),
    energyLevel: String(input.energyLevel).trim(),
    location: String(input.location).trim(),
    description: String(input.description).trim(),
    compatibility: Array.isArray(input.compatibility)
      ? input.compatibility.map(String).filter(Boolean)
      : [],
    health: String(input.health ?? "Health details pending").trim(),
    adoptionFee: Number(input.adoptionFee ?? 0),
    shelterName: String(input.shelterName).trim(),
    shelterEmail: String(input.shelterEmail).trim(),
    imageUrls: cleanImages(input.imageUrls),
    status: input.status ?? "available",
    createdAt: new Date().toISOString(),
  };

  if (!pet.imageUrls.length) {
    pet.imageUrls = [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
    ];
  }

  db.pets.unshift(pet);
  await writeDb(db);
  return pet;
}

export async function updatePetPhotos(id: string, imageUrls: unknown) {
  const db = await readDb();
  const pet = db.pets.find((item) => item.id === id);
  if (!pet) throw new Error("Pet not found");

  const cleanedImages = cleanImages(imageUrls);
  pet.imageUrls = cleanedImages.length ? cleanedImages : ["/placeholder.svg"];
  await writeDb(db);
  return pet;
}

export async function listInquiries() {
  const db = await readDb();
  return db.inquiries;
}

export async function createInquiry(input: Partial<Inquiry>) {
  const required = ["petId", "name", "email", "phone", "housing", "message"] as const;
  const missing = required.filter((field) => !String(input[field] ?? "").trim());
  if (missing.length) {
    throw new Error(`Missing required inquiry fields: ${missing.join(", ")}`);
  }

  const db = await readDb();
  const pet = db.pets.find((item) => item.id === input.petId);
  if (!pet) throw new Error("Pet not found");

  const inquiry: Inquiry = {
    id: randomUUID(),
    petId: pet.id,
    petName: pet.name,
    name: String(input.name).trim(),
    email: String(input.email).trim(),
    phone: String(input.phone).trim(),
    housing: String(input.housing).trim(),
    message: String(input.message).trim(),
    status: "new",
    createdAt: new Date().toISOString(),
  };

  db.inquiries.unshift(inquiry);
  await writeDb(db);
  return inquiry;
}
