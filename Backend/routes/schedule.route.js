// routes/schedule.routes.js

import express from "express";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/schedule.controller.js";

const router = express.Router();

// GET all schedules
router.get("/", getSchedules);

// POST create new schedule
router.post("/", createSchedule);

// PUT update schedule by ID
router.put("/:id", updateSchedule);

// DELETE schedule by ID
router.delete("/:id", deleteSchedule);

export default router;
