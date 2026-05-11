import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";
import Pet from "../models/pet.js";
import Organization from "../models/org.js";
import "../config/database.js";

const seedPets = async () => {
  try {
    // Correct path to pets.json (Windows-safe)
    const seedDataPath = path.join(
      process.cwd(), // current working directory, should be express-backend
      "seeds",
      "pets.json"
    );

    const petsData = JSON.parse(fs.readFileSync(seedDataPath, "utf-8"));

    // Find or create a default organization
    let org = await Organization.findOne();
    if (!org) {
      org = await Organization.create({
        name: "Default Shelter",
        address: "123 Main St",
        phone: "555-0000",
        email: "shelter@example.com",
      });
      console.log("Created default organization:", org.name);
    }

    // Clear existing seed pets (optional)
    // await Pet.deleteMany({});

    // Create pets
    const petsWithOrg = petsData.map((pet) => ({
      ...pet,
      linked_org: org._id,
      availability: "available",
    }));

    const createdPets = await Pet.insertMany(petsWithOrg, { ordered: false });
    console.log(`Successfully seeded ${createdPets.length} pets!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedPets();