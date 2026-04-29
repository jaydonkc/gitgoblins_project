//user-service.js
import userModel from "../models/user.js";

function addUser(user) {
  const userToAdd = new userModel(user);
  return userToAdd.save();
}

function getUsers(name, email) {
  if (name === undefined && email === undefined) {
    return userModel.find();
  } else if (name && !email) {
    return findUserByName(name);
  } else if (email && !name) {
    return findUserByEmail(email);
  } else {
    return userModel.find({ name: name, email: email });
  }
}

function findUserById(id) {
  return userModel.findById(id);
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByEmail(email) {
  return userModel.find({ email: email });
}

function removeUser(id) {
  return userModel.findByIdAndDelete(id);
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByEmail,
  removeUser
};
