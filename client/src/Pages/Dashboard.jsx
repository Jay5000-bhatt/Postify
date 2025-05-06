import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import CreatePost from "../Components/CreatePost";
import PostContext from "../Context/PostContext";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";

const Dashboard = () => {
  const { posts, setPosts, fetchPosts } = useContext(PostContext);

  const [comments, setComments] = useState({});
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);

        fetchPosts();
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    } else {
      console.warn("No token found in localStorage");
    }
  }, [fetchPosts]);

  const handlePostReaction = async (postId, type) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/reaction`, {
        type,
      });

      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          const updatedPost = { ...post };

          if (type === "like") {
            if (!updatedPost.likes.includes(currentUserId)) {
              updatedPost.likes = [...updatedPost.likes, currentUserId];
              updatedPost.dislikes = updatedPost.dislikes.filter(
                (id) => id !== currentUserId
              );
            }
          } else {
            if (!updatedPost.dislikes.includes(currentUserId)) {
              updatedPost.dislikes = [...updatedPost.dislikes, currentUserId];
              updatedPost.likes = updatedPost.likes.filter(
                (id) => id !== currentUserId
              );
            }
          }

          return updatedPost;
        }
        return post;
      });

      setPosts(updatedPosts);
      console.log(response.data);
    } catch (err) {
      setError("Failed to update reaction.");
      console.error("Error handling post reaction", err);
    }
  };

  const handleCommentReaction = async (postId, commentId, type) => {
    console.log("Post ID:", postId);
    console.log("Comment ID:", commentId);
    console.log("Reaction Type:", type);

    try {
      const response = await axios.post(
        `/api/posts/${postId}/comment/${commentId}/reaction`,
        { type }
      );

      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          const updatedComments = post.comments.map((comment) => {
            if (comment._id === commentId) {
              const updatedComment = { ...comment };
              if (type === "like") {
                if (!updatedComment.likes.includes(currentUserId)) {
                  updatedComment.likes = [
                    ...updatedComment.likes,
                    currentUserId,
                  ];
                  updatedComment.dislikes = updatedComment.dislikes.filter(
                    (id) => id !== currentUserId
                  );
                }
              } else {
                if (!updatedComment.dislikes.includes(currentUserId)) {
                  updatedComment.dislikes = [
                    ...updatedComment.dislikes,
                    currentUserId,
                  ];
                  updatedComment.likes = updatedComment.likes.filter(
                    (id) => id !== currentUserId
                  );
                }
              }
              return updatedComment;
            }
            return comment;
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      });

      setPosts(updatedPosts);
      console.log(response.data);
    } catch (err) {
      setError("Failed to update comment reaction.");
      console.error("Error handling comment reaction", err);
    }
  };

  const handleSubmitComment = async (postId) => {
    const commentText = comments[postId] || "";

    if (!commentText.trim()) {
      setError("Please enter a comment.");
      return;
    }

    try {
      await axios.post(`/api/posts/${postId}/comment`, {
        text: commentText,
      });

      await fetchPosts();
      setComments((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      setError("Failed to post comment.");
      console.error("Error posting comment", err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: value,
    }));
  };
  return (
    <>
      <div className="mx-10">
        <h1 className="text-4xl text-black font-extrabold my-5 border-0 border-b-orange-200">
          Posts
        </h1>
      </div>
      <div className="p-auto mx-10">
        {error && <p className="text-red-500">{error}</p>}

        <CreatePost />
        <div className="space-y-8">
          {currentUserId &&
            posts.length > 0 &&
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
              >
                <h2 className="text-sky-700 text-lg">@{post.author.name}</h2>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {post.title}
                </h3>
                <p className="text-gray-800 mt-4 whitespace-pre-line">
                  {post.content}
                </p>

                <div className="mt-4 flex items-center gap-6">
                  <button
                    onClick={() => handlePostReaction(post._id, "like")}
                    className="flex items-center gap-2 text-blue-600 hover:text-emerald-600 transition duration-200 cursor-pointer"
                  >
                    <SlLike
                      className={`text-xl transition duration-150 ${
                        post.likes.includes(currentUserId)
                          ? "text-emerald-600 scale-110"
                          : "text-blue-500"
                      }`}
                    />
                    <span>{post.likes.length}</span>
                  </button>
                  <button
                    onClick={() => handlePostReaction(post._id, "dislike")}
                    className="flex items-center gap-2 text-red-500 hover:text-black transition duration-200 cursor-pointer"
                  >
                    <SlDislike
                      className={`text-xl transition duration-150 ${
                        post.dislikes.includes(currentUserId)
                          ? "text-black scale-110"
                          : "text-red-500"
                      }`}
                    />
                    <span>{post.dislikes.length}</span>
                  </button>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-lg text-gray-800">
                    Comments:
                  </h4>
                  <div className="space-y-4 mt-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {[...post.comments]
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((comment) => (
                        <div
                          key={comment._id}
                          className="flex justify-between items-start p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
                        >
                          <p className="text-gray-700">{comment.text}</p>
                          <div className="flex gap-4">
                            <button
                              onClick={() =>
                                handleCommentReaction(
                                  post._id,
                                  comment._id,
                                  "like"
                                )
                              }
                              className="text-cyan-500 hover:text-emerald-600 transition cursor-pointer"
                            >
                              <SlLike
                                className={`text-xl ${
                                  comment.likes.includes(currentUserId)
                                    ? "text-emerald-600 scale-110"
                                    : ""
                                }`}
                              />
                            </button>
                            <button
                              onClick={() =>
                                handleCommentReaction(
                                  post._id,
                                  comment._id,
                                  "dislike"
                                )
                              }
                              className="text-red-500 hover:text-black transition cursor-pointer"
                            >
                              <SlDislike
                                className={`text-xl ${
                                  comment.dislikes.includes(currentUserId)
                                    ? "text-black scale-110"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mt-4">
                  <textarea
                    value={comments[post._id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post._id, e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    placeholder="Write a comment..."
                  />
                  <button
                    onClick={() => handleSubmitComment(post._id)}
                    className="mt-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                  >
                    Submit Comment
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
