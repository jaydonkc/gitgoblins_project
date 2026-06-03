//pet-service.js
import petModel from "../models/pet.js";

function addPet(pet) {
  const petToAdd = new petModel(pet);
  return petToAdd.save();
}

function getPets() {
  return petModel.find().sort({ _id: -1 });
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
    { returnDocument: "after" }
  );
}

function updatePetAvailabilityForOwner(
  id,
  availability,
  ownerUsername
) {
  return petModel.findOneAndUpdate(
    { _id: id, ownerUsername },
    { availability },
    { returnDocument: "after" }
  );
}

function updatePetPhotos(id, imageUrls) {
  return petModel.findByIdAndUpdate(
    id,
    { imageUrls },
    { returnDocument: "after", runValidators: true }
  );
}

function updatePetPhotosForOwner(id, imageUrls, ownerUsername) {
  return petModel.findOneAndUpdate(
    { _id: id, ownerUsername },
    { imageUrls },
    { returnDocument: "after", runValidators: true }
  );
}

function getAvailablePets() {
  return petModel
    .find({ availability: { $ne: "adopted" } })
    .sort({ _id: -1 });
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
