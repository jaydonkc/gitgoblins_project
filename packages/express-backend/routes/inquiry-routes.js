//inquiry-routes.js
//This file is for the HTML routes for inquiries
import express from "express";
const router = express.Router();
import inquiryService from "../services/inquiry-service.js";
import { authenticateUser, requireOrganization } from "../auth.js";

const {
  addInquiry,
  getInquiriesForPetOwner,
  findInquiryByIdForPetOwner,
  removeInquiryForPetOwner,
  updateInquiryStatusForPetOwner
} = inquiryService;

const allowedStatuses = ["new", "contacted", "approved", "rejected"];

router.get("/", authenticateUser, requireOrganization, (req, res) => {

  getInquiriesForPetOwner(req.user.username)
    .then((inquiries) => {
      res.send(inquiries);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

router.post("/", authenticateUser, (req, res) => {
  const inquiryToAdd = req.body;

  if (
    inquiryToAdd &&
    inquiryToAdd.pet != null &&
    (inquiryToAdd.user != null ||
      (inquiryToAdd.name != null &&
        inquiryToAdd.email != null)) &&
    inquiryToAdd.phone != null &&
    inquiryToAdd.housing != null &&
    inquiryToAdd.message != null
    
  ) {
    const newInquiry = {
      user: inquiryToAdd.user,
      pet: inquiryToAdd.pet,
      name: inquiryToAdd.name,
      email: inquiryToAdd.email,
      phone: inquiryToAdd.phone,
      housing: inquiryToAdd.housing,
      message: inquiryToAdd.message,
      status: inquiryToAdd.status,
      date: inquiryToAdd.date || new Date()
    };
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

router.delete("/:id", authenticateUser, requireOrganization, (req, res) => {
  const id = req.params["id"];

  removeInquiryForPetOwner(id, req.user.username)
    .then((inquiry) => {
      if (!inquiry) {
        res.status(403).send("Forbidden: you can only manage inquiries for your own pet profiles.");
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send();
    });
});

router.patch("/:id/status", authenticateUser, requireOrganization, (req, res) => {
  const id = req.params["id"];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    res.status(400).send("Invalid inquiry status");
    return;
  }

  updateInquiryStatusForPetOwner(id, status, req.user.username)
    .then((inquiry) => {
      if (!inquiry) {
        res.status(403).send("Forbidden: you can only manage inquiries for your own pet profiles.");
      } else {
        res.send(inquiry);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Failed to update inquiry status");
    });
});

router.get("/:id", authenticateUser, requireOrganization, (req, res) => {
  const id = req.params["id"]; //or req.params.id

  findInquiryByIdForPetOwner(id, req.user.username)
    .then((inquiry) => {
      if (!inquiry) {
        res.status(403).send("Forbidden: you can only view inquiries for your own pet profiles.");
      } else {
        res.send(inquiry);
      }
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

export default router;
