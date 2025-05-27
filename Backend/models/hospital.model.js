import mongoose from "mongoose"; //  Correct import

const hospitalSchema = new mongoose.Schema( // ✅ Use lowercase `mongoose`
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true } // ✅ Adds createdAt and updatedAt automatically
);

const Hospital = mongoose.model("Hospital", hospitalSchema); // ✅ Use lowercase `mongoose`

export default Hospital;
