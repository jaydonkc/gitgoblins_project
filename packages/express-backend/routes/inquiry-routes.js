//inquiry-routes.js
//This file is for the HTML routes for inquiries
import express from "express";
const router = express.Router();
import inquiryService from "../services/inquiry-service.js";

const {
  addInquiry,
  getInquiries,
  findInquiryById,
  removeInquiry,
  updateInquiryStatus
} = inquiryService;

const allowedStatuses = ["new", "contacted", "approved", "rejected"];

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

router.patch("/:id/status", (req, res) => {
  const id = req.params["id"];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    res.status(400).send("Invalid inquiry status");
    return;
  }

  updateInquiryStatus(id, status)
    .then((inquiry) => {
      if (!inquiry) {
        res.status(404).send("Inquiry not found.");
      } else {
        res.send(inquiry);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Failed to update inquiry status");
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
