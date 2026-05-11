//pet-routes.js
//This file is for the HTML routes for pets
import express from "express";
const router = express.Router();
import petService from "../services/pet-service.js";

const {
  addPet,
  getPets,
  findPetById,
  removePet,
  updatePetAvailability,
  updatePetPhotos,
  getAvailablePets
} = petService;

router.get("/", (req, res) => {

  getPets()
    .then((pets) => {
      res.send(pets);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

router.post("/", (req, res) => {
  const petToAdd = req.body;

  if (
    petToAdd &&
    petToAdd.name != "" &&
    petToAdd.age != "" &&
    (petToAdd.type != "" || petToAdd.species != "") &&
    (petToAdd.linked_org != null || petToAdd.shelterEmail != null)
    
  ) {
    const newPet = {
      ...petToAdd,
      type: petToAdd.type || petToAdd.species,
      species: petToAdd.species || petToAdd.type,
      imageUrls: Array.isArray(petToAdd.imageUrls) ? petToAdd.imageUrls.filter(Boolean) : []
    };
    addPet(newPet)
      .then((createdPet) => {
        res.status(201).send(createdPet);
      })
      .catch((error) => {
        console.log(error);
        res.status(404).send();
      });
  } else {
    res.status(404).send();
  }
});

router.patch("/:id/photos", (req, res) => {
  const id = req.params["id"];
  const imageUrls = Array.isArray(req.body.imageUrls)
    ? req.body.imageUrls.map((url) => String(url).trim()).filter(Boolean)
    : [];

  updatePetPhotos(id, imageUrls)
    .then((pet) => {
      if (!pet) {
        res.status(404).send("Pet not found.");
      } else {
        res.send(pet);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Failed to update pet photos");
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params["id"];

  removePet(id)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send();
    });
});

router.get("/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id

  findPetById(id)
    .then((pet) => {
      if (!pet) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(pet);
      }
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

router.get("/discover/available", (req, res) => {
  getAvailablePets()
    .then((pets) => {
      res.send(pets);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

router.patch("/:id/availability", (req, res) => {
  const id = req.params["id"];
  const { availability } = req.body;

  if (!availability || !["available", "pending", "adopted"].includes(availability)) {
    res.status(400).send("Invalid availability status");
    return;
  }

  updatePetAvailability(id, availability)
    .then((pet) => {
      if (!pet) {
        res.status(404).send("Pet not found.");
      } else {
        res.send(pet);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Failed to update pet availability");
    });
});

export default router;
