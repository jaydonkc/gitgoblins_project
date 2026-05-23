//pet-routes.js
//This file is for the HTML routes for pets
import express from "express";
const router = express.Router();
import petService from "../services/pet-service.js";
import { authenticateUser, requireOrganization } from "../auth.js";

const {
  addPet,
  getPets,
  findPetById,
  removePetForOwner,
  updatePetAvailabilityForOwner,
  updatePetPhotosForOwner,
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

router.post("/", authenticateUser, requireOrganization, (req, res) => {
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
      ownerUsername: req.user.username,
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

router.patch("/:id/photos", authenticateUser, requireOrganization, (req, res) => {
  const id = req.params["id"];
  const imageUrls = Array.isArray(req.body.imageUrls)
    ? req.body.imageUrls.map((url) => String(url).trim()).filter(Boolean)
    : [];

  updatePetPhotosForOwner(id, imageUrls, req.user.username)
    .then((pet) => {
      if (!pet) {
        res.status(403).send("Forbidden: you can only manage your own pet profiles.");
      } else {
        res.send(pet);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Failed to update pet photos");
    });
});

router.delete("/:id", authenticateUser, requireOrganization, (req, res) => {
  const id = req.params["id"];

  removePetForOwner(id, req.user.username)
    .then((pet) => {
      if (!pet) {
        res.status(403).send("Forbidden: you can only manage your own pet profiles.");
      } else {
        res.status(204).send();
      }
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

router.patch("/:id/availability", authenticateUser, requireOrganization, (req, res) => {
  const id = req.params["id"];
  const { availability } = req.body;

  if (!availability || !["available", "pending", "adopted"].includes(availability)) {
    res.status(400).send("Invalid availability status");
    return;
  }

  updatePetAvailabilityForOwner(id, availability, req.user.username)
    .then((pet) => {
      if (!pet) {
        res.status(403).send("Forbidden: you can only manage your own pet profiles.");
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
