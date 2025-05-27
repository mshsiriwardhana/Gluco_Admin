import express from "express";
import {
  createHospital,
  deleteHospital,
  getHospitals,
  updateHospital,
} from "../controllers/hospital.controller.js";

const router = express.Router();

router.get("/", getHospitals);

router.post("/", createHospital);

router.put("/:id", updateHospital);

router.delete("/:id", deleteHospital);

export default router;
