import Feedback from "../models/patient.model.js";
import mongoose from "mongoose";

// Create Feedback
export const createFeedback = async (req, res) => {
  const {
    name,
    email,
    visitDate,
    visitReason,
    visitCompanions,
    cleanliness,
    staffHelpfulness,
    animalEnclosures,
    educationalInfo,
    foodServices,
    overallSatisfaction,
    mostEnjoyedAspect,
    improvementSuggestions,
    notedIssues,
    recommendPark,
    wantsUpdates,
    additionalComments,
  } = req.body;

  try {
    const newFeedback = new Feedback({
      name,
      email,
      visitDate,
      visitReason,
      visitCompanions,
      cleanliness,
      staffHelpfulness,
      animalEnclosures,
      educationalInfo,
      foodServices,
      overallSatisfaction,
      mostEnjoyedAspect,
      improvementSuggestions,
      notedIssues,
      recommendPark,
      wantsUpdates,
      additionalComments,
    });

    await newFeedback.save();
    res.status(201).json({ success: true, data: newFeedback });
  } catch (error) {
    console.error("Error creating feedback:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get All Feedback
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({});
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Feedback by ID
export const getFeedbackById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid ID" });
  }

  try {
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    console.error("Error fetching feedback:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Feedback
export const updateFeedback = async (req, res) => {
  const { id } = req.params;
  const feedbackData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid ID" });
  }

  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(id, feedbackData, {
      new: true,
    });
    if (!updatedFeedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }
    res.status(200).json({ success: true, data: updatedFeedback });
  } catch (error) {
    console.error("Error updating feedback:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete Feedback
export const deleteFeedback = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid ID" });
  }

  try {
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }

    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Feedback deleted" });
  } catch (error) {
    console.error("Error deleting feedback:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
