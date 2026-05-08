//pet-routes.js
//This file is for the HTML routes for pets
import express from "express";
const router = express.Router();
import petService from "../services/pet-service.js";

const { addPet, getPets, findPetById, removePet } = petService;

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
    petToAdd.type != "" &&
    petToAdd.linked_org != null
    
  ) {
    const newPet = petToAdd;
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

export default router;