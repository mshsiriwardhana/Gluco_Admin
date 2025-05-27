import Doctor from "../models/doctor.model.js"; // Import the Doctor model
import mongoose from "mongoose";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error.message);
    res.status(500).json({ success: false, message: "Server Error",error: error.message  });
  }
};

export const createDoctor = async (req, res) => {
  const {
    name,
    specialization,
    experience,
    contact,
    email,
    hospital,
    availability,
    qualifications,
    charges,
    profilePicture,
  } = req.body; // Extract fields

  
  // Validate required fields

  if (
    !name ||
    !specialization ||
    !experience ||
    !contact ||
    !email ||
    hospital === undefined ||
    !availability ||
    !qualifications ||
    !charges ||
    !profilePicture
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required fields",
    });
  }

  try {
   //  Check for existing doctor by email
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor with this email already exists." });
    }
    const newDoctor = new Doctor({
      name,
      specialization,
      experience,
      contact,
      email,
      hospital,
      availability,
      qualifications,
      charges,
      profilePicture,
    });
    await newDoctor.save();
    res.status(201).json({ success: true, data: newDoctor });
  } catch (error) {
    console.error("Error creating doctor:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateDoctor = async (req, res) => {
  const { id } = req.params;

  const doctor = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid ID" });
  }

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, doctor, {
      new: true,
    });
    res.status(200).json({ success: true, message: "Doctor updated" });
  } catch (error) {
    console.error("Error updating doctor:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid ID" });
  }

  try {
    // Check if the doctor exists
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Attempt to delete the doctor
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Doctor deleted" });
  } catch (error) {
    console.error("Error deleting doctor:", error); // Log the error
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
