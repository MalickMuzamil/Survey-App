import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

import AuthController from "./AuthController.js";

import User from "../models/UserModel.js";
import RoleModel from "../models/RoleModel.js";

class AccessController extends AuthController {
  static ApiWorking = asyncHandler(async (req, res) => {
    try {
      res.status(200).json(this.generateResponse(200, "Api Working of Survey App"));
    } catch (error) {
      res.status(400);
      throw new Error("Api not working");
    }
  });

  static validate = asyncHandler(async (req, res) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res
          .status(200)
          .json(this.generateResponse(200, "Validated", decoded, token));
      } catch (error) {
        res.status(401);
        throw new Error("Authorization Token Not Valid");
      }
    }
    if (!token) {
      res.status(401);
      throw new Error("Authorization Token Not Present");
    }
  });

  static signup = asyncHandler(async (req, res) => {
    try {
      const { first_name, last_name, email, password, phonenumber, role } = req.body;

      if (!first_name || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: "first_name, email, password & role are required"
        });
      }

      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email"
        });
      }

      // Allowed roles and levels (strict check)
      const defaultLevels = {
        "CEO": 1,
        "CTO": 2,
        "PM": 3,
        "TeamLead": 4,
        "Developer": 5,
        "Intern": 6
      };

      // Check if role is valid
      if (!defaultLevels[role]) {
        return res.status(400).json({
          success: false,
          message: "Role does not exist"
        });
      }

      // Find role in DB
      let findRole = await RoleModel.findOne({ name: role });

      // Create role if not found but is allowed
      if (!findRole) {
        findRole = await RoleModel.create({
          name: role,
          level: defaultLevels[role]
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create User
      const newUser = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phonenumber,
        roleId: findRole._id
      });

      // Populate role details
      const populatedUser = await User.findById(newUser._id).populate("roleId");

      // Generate token
      const token = this.generateToken(newUser._id);

      return res.status(201).json(
        this.generateResponse(201, "Signup successful", populatedUser, token)
      );

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  });



  static login = asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400);
        throw new Error("Email and password are required");
      }

      // Find user
      const user = await User.findOne({
        email: email.toLowerCase(),
      }).populate("roleId");

      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401); // unauthorized
        throw new Error("Invalid password");
      }

      // Generate JWT token
      const token = this.generateToken(user._id);

      // Successful response
      const response = this.generateResponse(
        200,
        "Login successful",
        {
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name || "",
          email: user.email,
          phonenumber: user.phonenumber || "",
          role: user.roleId.name,
          level: user.roleId.level
        },
        token
      );

      return res.status(200).json(response);

    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });


}

export default AccessController;
