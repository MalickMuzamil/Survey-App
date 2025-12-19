import path from "path";
import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

import connectDB from "./dbconfig/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

// Import routes
import accessRoute from "./routes/accessRoute.js";
import SurveyRoute from "./routes/SurveyRoute.js";

dotenv.config();
// Server setup
const app = express();
const port = process.env.PORT || 3000;

// Path helpers (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/", accessRoute);
app.use("/survey", SurveyRoute);

// Error handler (should be after routes)
app.use(errorHandler);

// Start server
app.listen(port, () => console.log(colors.cyan(`🚀 Server started on port ${port}`)));
