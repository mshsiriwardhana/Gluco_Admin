import Hospital from "../models/hospital.model.js";
import mongoose from "mongoose";

export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({});
    res.status(200).json({ success: true, data: hospitals });
  } catch (error) {
    console.error("Error fetching hospitals:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createHospital = async (req, res) => {
  const { name, location, description, image } = req.body; // Extract fields

  if (!name || !location || !description || !image) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required fields",
    });
  }

  try {
    const newHospital = new Hospital({
      name,
      location,
      description,
      image,
    });
    await newHospital.save();
    res.status(201).json({ success: true, data: newHospital });
  } catch (error) {
    console.error("Error creating hospital:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateHospital = async (req, res) => {
  const { id } = req.params;
  const hospital = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid ID" });
  }

  try {
    const updatedHospital = await Hospital.findByIdAndUpdate(id, hospital, {
      new: true,
    });
    res.status(200).json({ success: true, message: "Hospital updated" });
  } catch (error) {
    console.error("Error updating Hospital:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteHospital = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid ID" });
  }

  try {
    // Check if the Hospital exists
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res
        .status(404)
        .json({ success: false, message: "Hospital not found" });
    }

    // Attempt to delete the Hospital
    await Hospital.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Hospital deleted" });
  } catch (error) {
    console.error("Error deleting Hospital:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};