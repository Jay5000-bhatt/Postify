import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import ConnectDB from "../Config/ConnectDB.js";
import authRoutes from "../Routes/authRoutes.js";
import postRoutes from "../Routes/postRoutes.js";

dotenv.config();
ConnectDB();

const app = express();

app.use(
  cors({
    origin: "https://postify-nine.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("My Server is Running Successfully 🚀");
});

export default app;
