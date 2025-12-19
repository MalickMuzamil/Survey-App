import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
  version: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Survey = mongoose.model("Survey", surveySchema);
export default Survey;
