import express from "express";
import SurveyController from "../controllers/SurveyController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, SurveyController.createSurvey);
router.get("/questions", authMiddleware, SurveyController.getQuestionsForUser);
router.post("/submit", authMiddleware, SurveyController.submitSurvey);
router.get("/subordinate-surveys", authMiddleware, SurveyController.viewSubordinateSurveys);
router.delete("/response/:id", authMiddleware, SurveyController.deleteResponse);
router.get("/my-survey-status", authMiddleware, SurveyController.getMySurveyStatus);
router.get("/my-responses", authMiddleware, SurveyController.getMyResponses);

export default router;
