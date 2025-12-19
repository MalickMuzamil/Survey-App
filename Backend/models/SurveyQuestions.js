import mongoose from "mongoose";

const surveyQuestionSchema = new mongoose.Schema({
    surveyId: { type: mongoose.Schema.Types.ObjectId, ref: "Survey", required: true },
    question: { type: String, required: true, trim: true },
    type: { type: String, enum: ["text", "rating", "yesno", "mcq"], default: "text" },
    options: [{ type: String }],
    is_deleted: { type: Boolean, default: false }
}, { timestamps: true });

const SurveyQuestion = mongoose.model("SurveyQuestion", surveyQuestionSchema);
export default SurveyQuestion;
