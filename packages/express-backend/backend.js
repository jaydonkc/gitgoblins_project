// backend.js
import express from "express";
import cors from "cors";
import "./config/database.js";
import userService from "./services/user-service.js";

const { addUser, getUsers, findUserById, removeUser } =
  userService;

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
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

app.post("/users", (req, res) => {
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

app.delete("/users/:id", (req, res) => {
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

app.get("/users/:id", (req, res) => {
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

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
