import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer token ${token}`;
      try {
        const response = await axios.get("/api/posts");
        setPosts(response.data.data);
      } catch (err) {
        console.error("Error fetching posts", err);
      }
    }
  }, []); 
  const addPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <PostContext.Provider value={{ posts, setPosts, addPost, fetchPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostContext;
