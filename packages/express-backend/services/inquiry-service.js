//inquiry-service.js
import inquiryModel from "../models/inquiry.js";

function addInquiry(inquiry) {
  const inquiryToAdd = new inquiryModel(inquiry);
  return inquiryToAdd.save().then((createdInquiry) =>
    createdInquiry.populate(["pet", "user"])
  );
}

function getInquiries() {
  return inquiryModel.find().sort({ date: -1 }).populate(["pet", "user"]);
}

function removeInquiry(id) {
  return inquiryModel.findByIdAndDelete(id);
}

function findInquiryById(id) {
  return inquiryModel.findById(id);
}

function updateInquiryStatus(id, status) {
  return inquiryModel.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after", runValidators: true }
  ).populate(["pet", "user"]);
}

export default {
  addInquiry,
  getInquiries,
  removeInquiry,
  findInquiryById,
  updateInquiryStatus
};
