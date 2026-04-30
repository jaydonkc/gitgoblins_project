//swipe-routes.js
//This file is for the HTML routes for swipes
import express from "express";
const router = express.Router();
import swipeService from "../services/swipe-service.js";

const { addSwipe, getSwipes, findSwipeById, removeSwipe } = swipeService;

router.get("/", (req, res) => {

  getSwipes()
    .then((swipes) => {
      res.send(swipes);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

router.post("/", (req, res) => {
  const swipeToAdd = req.body;

  if (
    swipeToAdd &&
    swipeToAdd.user != null &&
    swipeToAdd.pet != null &&
    swipeToAdd.swiped != null
    
  ) {
    const newSwipe = swipeToAdd;
    addSwipe(newSwipe)
      .then((createdSwipe) => {
        res.status(201).send(createdSwipe);
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

  removeSwipe(id)
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

  findSwipeById(id)
    .then((swipe) => {
      if (!swipe) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(swipe);
      }
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

export default router;