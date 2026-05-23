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

function removePetForOwner(id, ownerUsername) {
  return petModel.findOneAndDelete({ _id: id, ownerUsername });
}

function findPetById(id) {
  return petModel.findById(id);
}

function updatePetAvailability(id, availability) {
  return petModel.findByIdAndUpdate(
    id,
    { availability },
    { new: true }
  );
}

function updatePetAvailabilityForOwner(id, availability, ownerUsername) {
  return petModel.findOneAndUpdate(
    { _id: id, ownerUsername },
    { availability },
    { new: true }
  );
}

function updatePetPhotos(id, imageUrls) {
  return petModel.findByIdAndUpdate(
    id,
    { imageUrls },
    { new: true, runValidators: true }
  );
}

function updatePetPhotosForOwner(id, imageUrls, ownerUsername) {
  return petModel.findOneAndUpdate(
    { _id: id, ownerUsername },
    { imageUrls },
    { new: true, runValidators: true }
  );
}

function getAvailablePets() {
  return petModel.find({ availability: { $ne: "adopted" } });
}

export default {
  addPet,
  getPets,
  removePet,
  removePetForOwner,
  findPetById,
  updatePetAvailability,
  updatePetAvailabilityForOwner,
  updatePetPhotos,
  updatePetPhotosForOwner,
  getAvailablePets
};
