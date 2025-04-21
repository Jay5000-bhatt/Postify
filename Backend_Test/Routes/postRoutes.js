import express from "express";

import protect from "../Middleware/authMiddleware.js";
import {
  createPost,
  getAllPosts,
  addComment,
  toggleReaction,
  toggleCommentReaction,
} from "../Controller/postController.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", getAllPosts);
router.post("/:id/comment", protect, addComment);
router.post("/:id/reaction", protect, toggleReaction);
router.post(
  "/:postId/comment/:commentId/reaction",
  protect,
  toggleCommentReaction
);

export default router;
