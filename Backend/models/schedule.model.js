// models/schedule.model.js

import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    slots: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isBooked: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
