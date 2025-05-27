import express from "express";
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";

const router = express.Router();

// GET all doctors
router.get("/", getDoctors);

// POST create a new doctor
router.post("/", createDoctor);

// PUT update a doctor by ID
router.put("/:id", updateDoctor);

// DELETE a doctor by ID
router.delete("/:id", deleteDoctor);

export default router;