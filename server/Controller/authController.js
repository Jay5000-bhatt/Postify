import User from "../Model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const errorResponse = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({ success: false, message, errors });
};

const successResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({ success: true, message, data });
};

// Signup
export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 422, "Validation failed", errors.array());
  }

  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, "Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return successResponse(res, 201, "User registered successfully", {
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token,
    });
  } catch (err) {
    return errorResponse(res, 500, "Signup failed", [err.message]);
  }
};

// Login
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 422, "Validation failed", errors.array());
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return errorResponse(res, 400, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 400, "Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return successResponse(res, 200, "Login successful", {
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    return errorResponse(res, 500, "Login failed", [err.message]);
  }
};


// Get Profile
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(res, 200, "User profile fetched", req.user);
  } catch (err) {
    return errorResponse(res, 500, "Failed to fetch profile", [err.message]);
  }
};
