import express from "express";
import { body, validationResult } from "express-validator";
import protect from "../Middleware/authMiddleware.js";
import {
  createPost,
  getAllPosts,
  addComment,
  toggleReaction,
  toggleCommentReaction,
} from "../Controller/postController.js";
import {
  rapidRequestLimiter,
  userAgentBlocker,
} from "../Middleware/securityMiddleware.js";

const router = express.Router();

router.post(
  "/createpost",
  protect,
  userAgentBlocker,
  rapidRequestLimiter,
  [
    body("title")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
    body("content")
      .isLength({ min: 10 })
      .withMessage("Content must be at least 10 characters long"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createPost
);

router.get("/", protect, getAllPosts);

router.post(
  "/:id/comment",
  protect,
  userAgentBlocker,
  rapidRequestLimiter,
  addComment
);

router.post(
  "/:id/reaction",
  protect,
  userAgentBlocker,
  rapidRequestLimiter,
  toggleReaction
);

router.post(
  "/:postId/comment/:commentId/reaction",
  protect,
  userAgentBlocker,
  rapidRequestLimiter,
  toggleCommentReaction
);

export default router;
