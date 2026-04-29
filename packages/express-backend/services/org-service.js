//org-service.js
import orgModel from "../models/org.js";

function addOrg(org) {
  const orgToAdd = new orgModel(org);
  return orgToAdd.save();
}

function getOrgs() {
  return orgModel.find();
}

function findOrgById(id) {
  return orgModel.findById(id);
}

function removeOrg(id) {
  return orgModel.findByIdAndDelete(id);
}

export default {
  addOrg,
  getOrgs,
  removeOrg,
  findOrgById
};
