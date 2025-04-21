import { useContext, useState } from "react";
import axios from "axios";
import CreatePost from "../Components/CreatePost";
import PostContext from "../Context/PostContext";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";

const Dashboard = () => {
  const currentUserId = localStorage.getItem("userId"); 

  const { posts, setPosts } = useContext(PostContext);
  const [comments, setComments] = useState({});
  const [error, setError] = useState("");

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
      console.log(response);
    } catch (err) {
      setError("Failed to update reaction.");
      console.error("Error handling post reaction", err);
    }
  };

  const handleCommentReaction = async (postId, commentId, type) => {
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
      const response = await axios.post(`/api/posts/${postId}/comment`, {
        text: commentText,
      });
      const updatedPosts = posts.map((post) =>
        post._id === postId
          ? { ...post, comments: [...post.comments, response.data] }
          : post
      );
      await setPosts(updatedPosts);
      console.log(response.data);
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: "",
      }));
      window.location.reload();
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-96">
          {posts.map((post) => {
            return (
              <div key={post._id} className="mb-6 p-4 border rounded">
                <h2>@{post.author.name}</h2>
                <div className="flex flex-row justify-between">
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <div className="flex flex-row mt-2 gap-5 mr-4">
                    <SlLike
                      onClick={() => handlePostReaction(post._id, "like")}
                      className={`cursor-pointer text-xl ${
                        post.likes.includes(currentUserId)
                          ? "text-emerald-500"
                          : "text-blue-500"
                      }`}
                    />
                    <SlDislike
                      onClick={() => handlePostReaction(post._id, "dislike")}
                      className={`cursor-pointer text-xl ${
                        post.dislikes.includes(currentUserId)
                          ? "text-black"
                          : "text-red-500"
                      }`}
                    />
                  </div>
                </div>

                <p>{post.content}</p>

                <div className="mt-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  <h3 className="font-semibold">Comments:</h3>
                  {post.comments.map((comment) => (
                    <div
                      key={comment._id} 
                      className="flex justify-between p-2 border-b-2 border-b-gray-400 mt-4 shadow shadow-neutral-50"
                    >
                      <p>{comment.text}</p>
                      <div className="flex flex-row mt-2 gap-5">
                        <SlLike
                          onClick={() =>
                            handleCommentReaction(post._id, comment._id, "like")
                          }
                          className={`cursor-pointer text-xl ${
                            comment.likes.includes(currentUserId)
                              ? "text-emerald-700"
                              : "text-cyan-500"
                          }`}
                        />
                        <SlDislike
                          onClick={() =>
                            handleCommentReaction(
                              post._id,
                              comment._id,
                              "dislike"
                            )
                          }
                          className={`cursor-pointer text-xl ${
                            comment.dislikes.includes(currentUserId)
                              ? "text-black"
                              : "text-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <textarea
                    id={post._id}
                    value={comments[post._id] || ""} 
                    onChange={(e) =>
                      handleCommentChange(post._id, e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Add a comment"
                  />
                  <button
                    onClick={() => handleSubmitComment(post._id)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Submit Comment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
