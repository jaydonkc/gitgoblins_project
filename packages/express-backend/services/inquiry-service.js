//inquiry-service.js
import inquiryModel from "../models/inquiry.js";

function addInquiry(inquiry) {
  const inquiryToAdd = new inquiryModel(inquiry);
  return inquiryToAdd.save();
}

function getInquiries() {
  return inquiryModel.find();
}

function removeInquiry(id) {
  return inquiryModel.findByIdAndDelete(id);
}

function findInquiryById(id) {
  return inquiryModel.findById(id);
}

export default {
  addInquiry,
  getInquiries,
  removeInquiry,
  findInquiryById
};