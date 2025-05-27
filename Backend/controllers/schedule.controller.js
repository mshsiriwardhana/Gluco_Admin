// controllers/schedule.controller.js

import mongoose from "mongoose";
import Schedule from "../models/schedule.model.js";

// Get all schedules
export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({})
      .populate("doctor", "name specialization contact email"); // Populate doctor info (select key fields)
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    console.error("Error fetching schedules:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create new schedule
export const createSchedule = async (req, res) => {
  const { doctor, date, slots } = req.body;

  if (!doctor || !date || !slots || !Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide doctor, date, and slots (array of time slots).",
    });
  }

  // Validate slots content
  for (const slot of slots) {
    if (!slot.startTime || !slot.endTime) {
      return res.status(400).json({
        success: false,
        message: "Each slot must have startTime and endTime.",
      });
    }
  }

  try {
    // Optional: check if schedule for this doctor and date already exists to prevent duplicates
    const existingSchedule = await Schedule.findOne({ doctor, date });
    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message: "Schedule already exists for this doctor and date.",
      });
    }

    const newSchedule = new Schedule({ doctor, date, slots });
    await newSchedule.save();

    res.status(201).json({ success: true, data: newSchedule });
  } catch (error) {
    console.error("Error creating schedule:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update schedule by ID
export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid schedule ID" });
  }

  // If slots are present in update, validate them
  if (updates.slots) {
    if (!Array.isArray(updates.slots) || updates.slots.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Slots must be a non-empty array.",
      });
    }
    for (const slot of updates.slots) {
      if (!slot.startTime || !slot.endTime) {
        return res.status(400).json({
          success: false,
          message: "Each slot must have startTime and endTime.",
        });
      }
    }
  }

  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedSchedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }
    res.status(200).json({ success: true, data: updatedSchedule });
  } catch (error) {
    console.error("Error updating schedule:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete schedule by ID
export const deleteSchedule = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid schedule ID" });
  }

  try {
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }
    await Schedule.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Schedule deleted" });
  } catch (error) {
    console.error("Error deleting schedule:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
