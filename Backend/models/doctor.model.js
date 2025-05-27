import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hospital: { type: Boolean, required: true },
    availability: { type: String, required: true },
    qualifications: { type: String, required: true },
    charges: { type: String, required: true },
    profilePicture: { type: String, required: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
