//org-routes.js
//This file is for the HTML routes for orgs
import express from "express";
const router = express.Router();
import orgService from "../services/org-service.js";

const { addOrg, getOrgs, findOrgById, removeOrg } = orgService;

router.get("/", (req, res) => {

  getOrgs()
    .then((orgs) => {
      res.send(orgs);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

router.post("/", (req, res) => {
  const orgToAdd = req.body;
  console.log("BODY:", req.body);

  if (
    orgToAdd != undefined &&
    orgToAdd.email != "" &&
    orgToAdd.name != ""
  ) {
    const newOrg = orgToAdd;
    addOrg(newOrg)
      .then((createdOrg) => {
        res.status(201).send(createdOrg);
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

  removeOrg(id)
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

  findOrgById(id)
    .then((org) => {
      if (!org) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(org);
      }
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

export default router;