import asyncHandler from "express-async-handler";
import SurveyQuestion from "../models/SurveyQuestions.js";
import SurveyResponse from "../models/SurveyResponse.js";
import User from "../models/UserModel.js";
import Survey from '../models/SurveySchema.js';

class SurveyController {

    // ============= CREATE SURVEY (WITH QUESTIONS) ==================
    static createSurvey = asyncHandler(async (req, res) => {
        const { questions } = req.body;

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Questions are required"
            });
        }

        await Survey.updateMany({}, { isActive: false });

        const lastSurvey = await Survey.findOne().sort({ version: -1 });
        const newVersion = lastSurvey ? lastSurvey.version + 1 : 1;

        const newSurvey = await Survey.create({
            version: newVersion,
            isActive: true
        });

        const createdQuestions = await SurveyQuestion.insertMany(
            questions.map(q => ({
                surveyId: newSurvey._id,
                question: q.question,
                type: q.type,
                options: q.options
            }))
        );

        return res.status(201).json({
            success: true,
            message: "Survey created successfully",
            data: {
                survey: newSurvey,
                questions: createdQuestions
            }
        });
    });

    // ============= GET QUESTIONS ==================
    static getQuestionsForUser = asyncHandler(async (req, res) => {
        const surveys = await Survey.find().sort({ version: -1 });

        if (!surveys || surveys.length === 0) {
            return res.status(200).json({ success: true, message: "No surveys found", data: [] });
        }

        const surveyData = await Promise.all(surveys.map(async (survey) => {
            const questions = await SurveyQuestion.find({
                surveyId: survey._id,
                is_deleted: false
            });

            return {
                survey,
                questions
            };
        }));

        return res.status(200).json({
            success: true,
            message: "All surveys loaded",
            data: surveyData
        });
    });

    // ============= SUBMIT ANSWERS ==================
    static submitSurvey = asyncHandler(async (req, res) => {
        const userId = req.user._id;
        const { answers, surveyId } = req.body;

        if (!surveyId) {
            return res.status(400).json({
                success: false,
                message: "Survey ID is required"
            });
        }

        if (!answers || answers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Answers are required"
            });
        }

        const alreadySubmitted = await SurveyResponse.findOne({ userId, surveyId, is_deleted: false });

        if (alreadySubmitted) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted this survey",
                data: alreadySubmitted
            });
        }

        const response = await SurveyResponse.create({
            userId,
            surveyId,
            answers,
            submittedBy: userId
        });

            // Allow delete if user is deleting their own response or is senior
            if (!(String(loggedIn._id) === String(response.userId._id) || loggedPriority > targetPriority)) {
                return res.status(403).json({ success: false, message: 'You can only delete your own or subordinate users\' responses' });
            }
        return res.status(201).json({
            success: true,
            message: "Survey submitted successfully",
            data: response
        });
    });

    // ============= LEADER VIEW RESULTS ==================
    static viewSubordinateSurveys = asyncHandler(async (req, res) => {
        const loggedIn = await User.findById(req.user._id).populate("roleId");

        if (!loggedIn) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const allUsers = await User.find().populate("roleId");

        let allowedUsers = allUsers
            .filter(u => u.roleId.level >= loggedIn.roleId.level)
            .map(u => u._id);

        const roleName = String(loggedIn.roleId?.name || '').toLowerCase();
        if (roleName === 'internee' || roleName === 'intern') {
            allowedUsers = [loggedIn._id];
        }

        const results = await SurveyResponse.find({
            userId: { $in: allowedUsers },
            is_deleted: false
        })
            .populate({ path: 'userId', populate: { path: 'roleId' } })
            .populate('answers.questionId')
            .populate('surveyId');

        return res.status(200).json({
            success: true,
            message: "Accessible survey results fetched",
            data: results
        });
    });

    static getMySurveyStatus = asyncHandler(async (req, res) => {
        const userId = req.user._id;

        const activeSurvey = await Survey.findOne({ isActive: true }).sort({ version: -1 });

        if (!activeSurvey) {
            return res.status(200).json({
                success: true,
                message: "No active survey available",
                data: { submitted: false, surveyId: null }
            });
        }

        const existingResponse = await SurveyResponse.findOne({
            userId,
            surveyId: activeSurvey._id,
            is_deleted: false
        });

        return res.status(200).json({
            success: true,
            message: "Survey status fetched",
            data: {
                submitted: existingResponse ? true : false,
                surveyId: activeSurvey._id
            }
        });
    });

    // ============= GET ALL SURVEYS SUBMITTED BY USER ==================
    static getMyResponses = asyncHandler(async (req, res) => {
        const userId = req.user._id;

        const responses = await SurveyResponse.find({ userId, is_deleted: false }).populate('surveyId');

        const submittedSurveyIds = responses
            .map(r => (r.surveyId ? r.surveyId._id : null))
            .filter(id => id != null);

        return res.status(200).json({
            success: true,
            message: 'User responses fetched',
            data: submittedSurveyIds
        });
    });

    // ============= DELETE A SURVEY RESPONSE (soft delete) ==================
    static deleteResponse = asyncHandler(async (req, res) => {
        const responseId = req.params.id;

        const loggedIn = await User.findById(req.user._id).populate('roleId');
        if (!loggedIn) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const response = await SurveyResponse.findById(responseId).populate({ path: 'userId', populate: { path: 'roleId' } });

        if (!response || response.is_deleted) {
            return res.status(404).json({ success: false, message: 'Response not found' });
        }

        const loggedRoleName = String(loggedIn.roleId?.name || '').toLowerCase();
        if (['developer', 'intern', 'internee'].includes(loggedRoleName)) {
            return res.status(403).json({ success: false, message: 'Insufficient permissions to delete responses' });
        }

        const rolePriority = {
            ceo: 6,
            cto: 5,
            pm: 4,
            teamlead: 3,
            developer: 2,
            intern: 1,
            internee: 1,
        };

        const loggedLevel = Number(loggedIn.roleId?.level ?? 0);
        const targetLevel = Number(response.userId?.roleId?.level ?? 0);

        const loggedPriority = rolePriority[String(loggedIn.roleId?.name || '').toLowerCase()] ?? loggedLevel;
        const targetPriority = rolePriority[String(response.userId?.roleId?.name || '').toLowerCase()] ?? targetLevel;

        // Allow self-delete or delete of juniors only
        if (String(loggedIn._id) !== String(response.userId._id) && loggedPriority <= targetPriority) {
            return res.status(403).json({ success: false, message: 'You can only delete your own or subordinate users\' responses' });
        }

        response.is_deleted = true;
        response.deletedBy = loggedIn._id;
        response.deletedAt = new Date();
        await response.save();

        return res.status(200).json({ success: true, message: 'Response deleted' });
    });

}

export default SurveyController;
