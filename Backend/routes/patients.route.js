import express from "express";
import {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/feedback", createFeedback);
router.get("/feedback", getFeedbacks);
router.get("/feedback/:id", getFeedbackById);
router.put("/feedback/:id", updateFeedback);
router.delete("/feedback/:id", deleteFeedback);

export default router;
