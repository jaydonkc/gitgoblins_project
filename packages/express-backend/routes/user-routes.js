//user-routes.js
//This file is for the HTML routes for users
import express from "express";
const router = express.Router();
import userService from "../services/user-service.js";

const { addUser, getUsers, findUserById, removeUser } = userService;

router.get("/", (req, res) => {
  const name = req.query.name;
  const email = req.query.email;

  getUsers(name, email)
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

router.post("/", (req, res) => {
  const userToAdd = req.body;

  if (
    userToAdd != undefined &&
    userToAdd.email != "" &&
    userToAdd.name != ""
  ) {
    const newUser = userToAdd;
    addUser(newUser)
      .then((createdUser) => {
        res.status(201).send(createdUser);
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

  removeUser(id)
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

  findUserById(id)
    .then((user) => {
      if (user === undefined) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

export default router;