import Post from "../Model/Post.js";

export const createPost = async (req, res) => {
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
    res.status(201).json(populatedPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create post", error: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email");
    res.status(200).json(posts);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Failed to get posts", error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ text, user: req.user._id });
    await post.save();

    res.status(200).json({ message: "Comment added", post });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add comment", error: err.message });
  }
};

export const toggleReaction = async (req, res) => {
  const { type } = req.body; 
  const userId = req.user._id;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasLiked = post.likes.includes(userId);
    const hasDisliked = post.dislikes.includes(userId);

    // Remove any existing reaction
    post.likes.pull(userId);
    post.dislikes.pull(userId);

    // Apply new reaction
    if (type === "like" && !hasLiked) post.likes.push(userId);
    if (type === "dislike" && !hasDisliked) post.dislikes.push(userId);

    await post.save();
    res.status(200).json({
      message: "Reaction updated",
      likes: post.likes.length,
      dislikes: post.dislikes.length,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update reaction", error: err.message });
  }
};

export const toggleCommentReaction = async (req, res) => {
  const { type } = req.body; // like / dislike
  const { postId, commentId } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Ensure reaction fields exist
    comment.likes = comment.likes || [];
    comment.dislikes = comment.dislikes || [];

    // Remove existing reaction
    comment.likes.pull(userId);
    comment.dislikes.pull(userId);

    // Add new one
    if (type === "like") comment.likes.push(userId);
    if (type === "dislike") comment.dislikes.push(userId);

    await post.save();
    res.status(200).json({ message: "Comment reaction updated", comment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to react to comment", error: err.message });
  }
};
