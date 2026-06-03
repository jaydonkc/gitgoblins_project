const DEFAULT_API_BASE_URL =
  "https://gitgoblins-api-jaydonkc-bbbsbaeae4fhdfct.canadacentral-01.azurewebsites.net";

const apiBaseUrl = (
  process.env.DEMO_API_BASE_URL ||
  process.env.VITE_API_BASE_URL ||
  DEFAULT_API_BASE_URL
).replace(/\/$/, "");

const demoPassword = process.env.DEMO_PASSWORD;

if (!demoPassword) {
  console.error(
    "DEMO_PASSWORD is required. Example: DEMO_PASSWORD='temporary-password' npm run seed:demo"
  );
  process.exit(1);
}

const accounts = {
  primaryShelter: {
    username: "central_coast_rescue",
    role: "organization",
    label: "Central Coast Pet Alliance"
  },
  secondShelter: {
    username: "green_mesa_rescue",
    role: "organization",
    label: "Green Mesa Animal Rescue"
  },
  adopter: {
    username: "maria_gonzalez_demo",
    role: "adopter",
    label: "Maria Gonzalez"
  }
};

const demoPets = [
  {
    owner: "primaryShelter",
    name: "Rosie",
    type: "Dog",
    species: "Dog",
    breed: "Golden Retriever Mix",
    age: "4 years",
    size: "Medium",
    energyLevel: "Medium",
    location: "San Luis Obispo, CA",
    description:
      "Rosie is a gentle, people-focused retriever mix who enjoys morning walks, puzzle feeders, and quiet evenings near her person.",
    compatibility: [
      "Good with kids",
      "House trained",
      "Enjoys calm dogs"
    ],
    health:
      "Spayed, vaccinated, microchipped, and cleared by a vet exam on May 21, 2026.",
    adoptionFee: 175,
    shelterName: "Central Coast Pet Alliance",
    shelterEmail: "adoptions@centralcoastpetalliance.org",
    imageUrls: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1200&q=80"
    ],
    availability: "available"
  },
  {
    owner: "primaryShelter",
    name: "Mochi",
    type: "Cat",
    species: "Cat",
    breed: "Domestic Shorthair",
    age: "2 years",
    size: "Small",
    energyLevel: "Low",
    location: "Pismo Beach, CA",
    description:
      "Mochi is a soft-spoken lap cat who warms up quickly with treats and a sunny window perch.",
    compatibility: [
      "Apartment friendly",
      "Good with calm cats",
      "Best with older children"
    ],
    health:
      "Neutered, vaccinated, FIV/FeLV negative, and current on flea prevention.",
    adoptionFee: 95,
    shelterName: "Central Coast Pet Alliance",
    shelterEmail: "adoptions@centralcoastpetalliance.org",
    imageUrls: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80"
    ],
    availability: "available"
  },
  {
    owner: "primaryShelter",
    name: "Atlas",
    type: "Dog",
    species: "Dog",
    breed: "Australian Shepherd Mix",
    age: "1 year",
    size: "Medium",
    energyLevel: "High",
    location: "Paso Robles, CA",
    description:
      "Atlas is a smart, athletic young dog who is already learning leash manners and would thrive with an active adopter.",
    compatibility: [
      "Needs active home",
      "Crate trained",
      "Enjoys training games"
    ],
    health:
      "Neutered, vaccinated, microchipped, and recovering well from a minor paw scrape.",
    adoptionFee: 150,
    shelterName: "Central Coast Pet Alliance",
    shelterEmail: "adoptions@centralcoastpetalliance.org",
    imageUrls: [
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80"
    ],
    availability: "pending"
  },
  {
    owner: "secondShelter",
    name: "Clover",
    type: "Other",
    species: "Other",
    breed: "Mini Rex Rabbit",
    age: "10 months",
    size: "Small",
    energyLevel: "Low",
    location: "Atascadero, CA",
    description:
      "Clover is a tidy, curious rabbit who likes cilantro, cardboard tunnels, and gentle handling.",
    compatibility: [
      "Quiet home preferred",
      "Litter trained",
      "Indoor habitat required"
    ],
    health:
      "Spayed, vaccinated for RHDV2, and checked by an exotic animal veterinarian.",
    adoptionFee: 45,
    shelterName: "Green Mesa Animal Rescue",
    shelterEmail: "hello@greenmesarescue.org",
    imageUrls: [
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?auto=format&fit=crop&w=1200&q=80"
    ],
    availability: "available"
  }
];

const inquiryPlans = [
  {
    petName: "Rosie",
    name: "Maria Gonzalez",
    email: "maria.gonzalez@example.com",
    phone: "(805) 555-0138",
    housing:
      "Two-bedroom townhouse in San Luis Obispo with landlord approval and a fenced patio.",
    message:
      "I work from home three days a week and would love to meet Rosie this weekend. My family has adopted a retriever mix before.",
    date: "2026-06-01T17:30:00.000Z",
    status: "new"
  },
  {
    petName: "Rosie",
    name: "Ethan Park",
    email: "ethan.park@example.com",
    phone: "(805) 555-0142",
    housing:
      "Single-family home in Arroyo Grande with a fenced yard and one senior dog.",
    message:
      "Rosie seems like a good fit for our older dog. We can bring vet references to the meet-and-greet.",
    date: "2026-05-31T21:15:00.000Z",
    status: "contacted"
  },
  {
    petName: "Mochi",
    name: "Priya Shah",
    email: "priya.shah@example.com",
    phone: "(805) 555-0164",
    housing:
      "Pet-friendly apartment in Pismo Beach with a quiet office and screened balcony.",
    message:
      "I am looking for a calm indoor cat and can schedule a visit any afternoon after 3 p.m.",
    date: "2026-05-30T18:45:00.000Z",
    status: "approved"
  },
  {
    petName: "Atlas",
    name: "Ava Martinez",
    email: "ava.martinez@example.com",
    phone: "(805) 555-0177",
    housing:
      "House near hiking trails in Paso Robles with a six-foot fenced backyard.",
    message:
      "I run most mornings and am interested in a high-energy dog who enjoys training.",
    date: "2026-06-02T16:10:00.000Z",
    status: "new"
  }
];

async function apiRequest(path, options = {}, token) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  const text = await response.text();
  const payload = text ? safeJson(text) : undefined;

  if (!response.ok) {
    throw new Error(
      `${options.method || "GET"} ${path} failed with ${response.status}: ${text}`
    );
  }

  return payload;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function ensureAccount(account) {
  try {
    const created = await apiRequest("/signup", {
      method: "POST",
      body: JSON.stringify({
        username: account.username,
        pwd: demoPassword,
        role: account.role
      })
    });

    return { ...created, created: true };
  } catch (error) {
    if (!String(error.message).includes("409")) throw error;

    const loggedIn = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({
        username: account.username,
        pwd: demoPassword
      })
    });

    return { ...loggedIn, created: false };
  }
}

async function ensurePet(pet, auth, existingPets) {
  const existing = existingPets.find(
    (candidate) =>
      candidate.name === pet.name &&
      candidate.ownerUsername === auth.username
  );

  if (existing) return { pet: existing, created: false };

  const created = await apiRequest(
    "/pets",
    {
      method: "POST",
      body: JSON.stringify(pet)
    },
    auth.token
  );

  existingPets.unshift(created);
  return { pet: created, created: true };
}

async function getShelterInquiries(auth) {
  return apiRequest("/inquiries", {}, auth.token);
}

function hasInquiry(inquiries, plan, pet) {
  return inquiries.some((inquiry) => {
    const inquiryPet = inquiry.pet || {};
    const inquiryPetId =
      inquiryPet._id || inquiryPet.id || inquiry.pet;
    const petId = pet._id || pet.id;

    return (
      inquiry.email === plan.email &&
      inquiryPetId === petId &&
      inquiry.date?.slice(0, 10) === plan.date.slice(0, 10)
    );
  });
}

async function ensureInquiry(
  plan,
  pet,
  shelterAuth,
  adopterAuth
) {
  const inquiries = await getShelterInquiries(shelterAuth);

  if (hasInquiry(inquiries, plan, pet)) {
    return { created: false };
  }

  await apiRequest(
    "/inquiries",
    {
      method: "POST",
      body: JSON.stringify({
        pet: pet._id || pet.id,
        ...plan
      })
    },
    adopterAuth.token
  );

  return { created: true };
}

function printSummary(accountAuth, petResults, inquiryResults) {
  console.log(`Seeded demo API: ${apiBaseUrl}`);
  console.log("\nDemo accounts:");

  for (const [key, account] of Object.entries(accounts)) {
    const action = accountAuth[key].created
      ? "created"
      : "reused";
    console.log(
      `- ${account.label}: ${account.username} (${account.role}, ${action})`
    );
  }

  console.log("\nDemo pets:");
  for (const result of petResults) {
    const action = result.created ? "created" : "reused";
    console.log(
      `- ${result.pet.name}: ${result.pet.shelterName} (${action})`
    );
  }

  console.log("\nDemo inquiries:");
  for (const result of inquiryResults) {
    const action = result.created ? "created" : "reused";
    console.log(
      `- ${result.plan.name} for ${result.plan.petName}: ${action}`
    );
  }
}

async function main() {
  console.log(`Using deployed API: ${apiBaseUrl}`);

  const accountAuth = {};
  for (const [key, account] of Object.entries(accounts)) {
    accountAuth[key] = await ensureAccount(account);
  }

  const existingPets = await apiRequest("/pets");
  const petResults = [];
  const petByName = new Map();

  for (const pet of demoPets) {
    const auth = accountAuth[pet.owner];
    const result = await ensurePet(pet, auth, existingPets);
    petResults.push(result);
    petByName.set(result.pet.name, {
      pet: result.pet,
      shelterAuth: auth
    });
  }

  const inquiryResults = [];
  for (const plan of inquiryPlans) {
    const target = petByName.get(plan.petName);
    const result = await ensureInquiry(
      plan,
      target.pet,
      target.shelterAuth,
      accountAuth.adopter
    );
    inquiryResults.push({ ...result, plan });
  }

  printSummary(accountAuth, petResults, inquiryResults);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
