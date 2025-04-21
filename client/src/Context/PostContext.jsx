// src/context/PostContext.jsx
import React, { createContext,  useState, useEffect } from "react";
import axios from "axios";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const addPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider value={{ posts, setPosts, addPost, fetchPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostContext;
