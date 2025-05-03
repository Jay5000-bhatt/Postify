import express from "express";
import { body, validationResult } from "express-validator";

import { signup, login, getProfile } from "../Controller/authController.js";
import protect from "../Middleware/authMiddleware.js";
import {
  userAgentBlocker,
  rapidRequestLimiter,
} from "../Middleware/securityMiddleware.js";

const router = express.Router();

router.post(
  "/signup",
  userAgentBlocker,
  rapidRequestLimiter,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  signup
);

router.post(
  "/login",
  userAgentBlocker,
  rapidRequestLimiter,
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  login
);

router.get("/me", protect, getProfile);

export default router;
