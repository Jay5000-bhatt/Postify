import express from "express";
import { signup, login, getProfile } from "../Controller/authController.js";

import protect from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getProfile);

export default router;
