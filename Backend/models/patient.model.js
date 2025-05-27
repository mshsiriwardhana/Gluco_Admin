import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: false },
    visitDate: { type: Date, required: true },
    visitReason: { type: String, required: true },
    visitCompanions: { type: String, required: true },
    cleanliness: { type: Number, required: true },
    staffHelpfulness: { type: Number, required: true },
    animalEnclosures: { type: Number, required: true },
    educationalInfo: { type: Number, required: true },
    foodServices: { type: Number, required: true },
    overallSatisfaction: { type: Number, required: true },
    mostEnjoyedAspect: { type: String, required: true },
    improvementSuggestions: { type: String, required: true },
    notedIssues: { type: String, required: true },
    recommendPark: { type: String, required: true },
    wantsUpdates: { type: String, required: true },
    additionalComments: { type: String, required: false },
  },

  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
