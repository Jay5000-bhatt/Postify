import Post from "../Model/Post.js";
import { validationResult } from "express-validator";

const errorResponse = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({ success: false, message, errors });
};

const successResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 422, "Validation failed", errors.array());
  }

  try {
    const { title, content } = req.body;
    const newPost = await Post.create({
      title,
      content,
      author: req.user._id,
    });

    const populatedPost = await Post.findById(newPost._id).populate(
      "author",
      "name email"
    );
    return successResponse(
      res,
      201,
      "Post created successfully",
      populatedPost
    );
  } catch (err) {
    return errorResponse(res, 500, "Failed to create post", [err.message]);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .lean()
      .sort({ createdAt: -1 }); 
 
    const postsWithSortedComments = posts.map((post) => {
      const sortedComments = [...post.comments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      return {
        ...post,
        comments: sortedComments,
      };
    });

    return successResponse(
      res,
      200,
      "Posts fetched successfully",
      postsWithSortedComments
    );
  } catch (err) {
    return errorResponse(res, 500, "Failed to fetch posts", [err.message]);
  }
};

export const addComment = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return errorResponse(res, 400, "Comment text is required");
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return errorResponse(res, 404, "Post not found");

    post.comments.push({ text, user: req.user._id });
    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate("author", "name") 
      .populate("comments.user", "name");

    return successResponse(res, 200, "Comment added", updatedPost);
  } catch (err) {
    return errorResponse(res, 500, "Failed to add comment", [err.message]);
  }
};

export const toggleReaction = async (req, res) => {
  const { type } = req.body;
  const userId = req.user._id;

  if (!["like", "dislike"].includes(type)) {
    return errorResponse(res, 400, "Invalid reaction type");
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return errorResponse(res, 404, "Post not found");

    post.likes.pull(userId);
    post.dislikes.pull(userId);

    if (type === "like") post.likes.push(userId);
    if (type === "dislike") post.dislikes.push(userId);

    await post.save();
    return successResponse(res, 200, "Post reaction updated", {
      likes: post.likes.length,
      dislikes: post.dislikes.length,
    });
  } catch (err) {
    return errorResponse(res, 500, "Failed to update reaction", [err.message]);
  }
};

export const toggleCommentReaction = async (req, res) => {
  const { type } = req.body;
  const { postId, commentId } = req.params;
  const userId = req.user._id;

  if (!["like", "dislike"].includes(type)) {
    return errorResponse(res, 400, "Invalid reaction type");
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return errorResponse(res, 404, "Post not found");

    const comment = post.comments.id(commentId);
    if (!comment) return errorResponse(res, 404, "Comment not found");

    comment.likes.pull(userId);
    comment.dislikes.pull(userId);

    if (type === "like") comment.likes.push(userId);
    if (type === "dislike") comment.dislikes.push(userId);

    await post.save();
    return successResponse(res, 200, "Comment reaction updated", comment);
  } catch (err) {
    return errorResponse(res, 500, "Failed to react to comment", [err.message]);
  }
};
