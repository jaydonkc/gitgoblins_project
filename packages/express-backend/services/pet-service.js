//pet-service.js
import petModel from "../models/pet.js";

function addPet(pet) {
  const petToAdd = new petModel(pet);
  return petToAdd.save();
}

function getPets() {
  return petModel.find();
}

function removePet(id) {
  return petModel.findByIdAndDelete(id);
}

function findPetById(id) {
  return petModel.findById(id);
}

export default {
  addPet,
  getPets,
  removePet,
  findPetById
};
