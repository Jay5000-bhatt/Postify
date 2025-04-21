import express from "express";
import { signup, login, getProfile } from "../Controller/authController.js";

import protect from "../Middleware/authMiddleware.js"; // Protect middleware

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post("/signup", signup);

// @route   POST /api/auth/login
// @desc    Login with existing user
router.post("/login", login);

// @route   GET /api/auth/me
// @desc    Get current user's profile (protected route)
router.get("/me", protect, getProfile);

export default router;
