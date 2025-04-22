import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import ConnectDB from "./Config/ConnectDB.js";
import authRoutes from "./Routes/authRoutes.js";
import postRoutes from "./Routes/postRoutes.js";

dotenv.config();
ConnectDB();

const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(
  cors({
    origin: "https://postify-coral.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.get("/", (req, res) => {
  res.send("My Server is Running Successfully 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
