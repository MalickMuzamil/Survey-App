import mongoose from "mongoose";

const surveyResponseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    surveyId: { type: mongoose.Schema.Types.ObjectId, ref: "Survey", required: true }, // <-- ADD THIS FIELD

    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "SurveyQuestion" },
        answer: mongoose.Schema.Types.Mixed,
      },
    ],

    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    is_deleted: { type: Boolean, default: false },

  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  deletedAt: { type: Date, default: null },

    surveyVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const SurveyResponse = mongoose.model("SurveyResponse", surveyResponseSchema);
export default SurveyResponse;
