//inquiry-service.js
import inquiryModel from "../models/inquiry.js";
import petModel from "../models/pet.js";

function addInquiry(inquiry) {
  const inquiryToAdd = new inquiryModel(inquiry);
  return inquiryToAdd.save().then((createdInquiry) =>
    createdInquiry.populate(["pet", "user"])
  );
}

function getInquiries() {
  return inquiryModel.find().sort({ date: -1 }).populate(["pet", "user"]);
}

function getInquiriesForPetOwner(ownerUsername) {
  return petModel
    .find({ ownerUsername })
    .select("_id")
    .then((pets) => {
      const petIds = pets.map((pet) => pet._id);
      return inquiryModel
        .find({ pet: { $in: petIds } })
        .sort({ date: -1 })
        .populate(["pet", "user"]);
    });
}

function removeInquiry(id) {
  return inquiryModel.findByIdAndDelete(id);
}

function removeInquiryForPetOwner(id, ownerUsername) {
  return findInquiryByIdForPetOwner(id, ownerUsername).then((inquiry) => {
    if (!inquiry) {
      return null;
    }

    return inquiryModel.findByIdAndDelete(id).then(() => inquiry);
  });
}

function findInquiryById(id) {
  return inquiryModel.findById(id);
}

function findInquiryByIdForPetOwner(id, ownerUsername) {
  return inquiryModel
    .findById(id)
    .populate(["pet", "user"])
    .then((inquiry) => {
      if (!inquiry || inquiry.pet?.ownerUsername !== ownerUsername) {
        return null;
      }

      return inquiry;
    });
}

function updateInquiryStatus(id, status) {
  return inquiryModel.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after", runValidators: true }
  ).populate(["pet", "user"]);
}

function updateInquiryStatusForPetOwner(id, status, ownerUsername) {
  return findInquiryByIdForPetOwner(id, ownerUsername).then((inquiry) => {
    if (!inquiry) {
      return null;
    }

    return updateInquiryStatus(id, status);
  });
}

export default {
  addInquiry,
  getInquiries,
  getInquiriesForPetOwner,
  removeInquiry,
  removeInquiryForPetOwner,
  findInquiryById,
  findInquiryByIdForPetOwner,
  updateInquiryStatus,
  updateInquiryStatusForPetOwner
};
