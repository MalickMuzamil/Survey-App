import express from "express";
import AccessController from "../controllers/AccessController.js";

const router = express.Router();

// API test route
router.get("/", AccessController.ApiWorking);

// Auth routes
router.post("/signup", AccessController.signup);
router.post("/login", AccessController.login);
router.post("/validate", AccessController.validate);

export default router;
