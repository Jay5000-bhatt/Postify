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

// ✅ Create a post (Private)
router.post("/", protect, createPost);

// ✅ Get all posts (Public)
router.get("/", getAllPosts);

// ✅ Add comment to a post (Private)
router.post("/:id/comment", protect, addComment);

// ✅ Like/Dislike a post (Private)
router.post("/:id/reaction", protect, toggleReaction);

// ✅ Like/Dislike a specific comment on a post (Private)
router.post(
  "/:postId/comment/:commentId/reaction",
  protect,
  toggleCommentReaction
);

export default router;
