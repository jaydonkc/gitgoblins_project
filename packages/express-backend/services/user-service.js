import mongoose from "mongoose";
import userModel from "../models/user.js";
import dotenv from "dotenv";
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.set("debug", true);
dotenv.config();

function getMongoURI(dbname) {
  // Pull the single connection string from the environment
  const connection_string = process.env.MONGO_CONNECTION_STRING;

  if (!connection_string) {
    console.error(
      "Error: MONGO_CONNECTION_STRING is not defined in .env"
    );
    return "";
  }

  // Ensure there is exactly one slash between the URI and the dbname
  const baseURI = connection_string.endsWith("/")
    ? connection_string
    : `${connection_string}/`;

  const finalURI = `${baseURI}${dbname}?retryWrites=true&w=majority`;

  console.log("Connecting to MongoDB database:", dbname);
  return finalURI;
}

// Mongoose 6+ does not need useNewUrlParser or useUnifiedTopology
mongoose
  .connect(getMongoURI("primaryDB"))
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((error) => console.log("Connection Error:", error));

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
