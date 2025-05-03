import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const response = await axios.get("/api/auth/me");
          setUser(response.data);
        } catch (err) {
          console.error("Error fetching user", err);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post("/api/auth/login", { email, password });

    const { token, user } = data.data;
    localStorage.setItem("token", token);
    setUser(user);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const signup = async (name, email, password) => {
    const { data } = await axios.post("/api/auth/signup", {
      name,
      email,
      password,
    });

    const { token, user } = data.data;
    localStorage.setItem("token", token);
    setUser(user);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
