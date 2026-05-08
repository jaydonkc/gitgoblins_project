//inquiry-routes.js
//This file is for the HTML routes for inquiries
import express from "express";
const router = express.Router();
import inquiryService from "../services/inquiry-service.js";

const { addInquiry, getInquiries, findInquiryById, removeInquiry } = inquiryService;

router.get("/", (req, res) => {

  getInquiries()
    .then((inquiries) => {
      res.send(inquiries);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

router.post("/", (req, res) => {
  const inquiryToAdd = req.body;

  if (
    inquiryToAdd &&
    inquiryToAdd.user != null &&
    inquiryToAdd.pet != null &&
    inquiryToAdd.date != null
    
  ) {
    const newInquiry = inquiryToAdd;
    addInquiry(newInquiry)
      .then((createdInquiry) => {
        res.status(201).send(createdInquiry);
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

  removeInquiry(id)
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

  findInquiryById(id)
    .then((inquiry) => {
      if (!inquiry) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(inquiry);
      }
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

export default router;