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

app.use(cors({
  origin: 'https://postify-nine.vercel.app/', 
  methods: 'GET,POST,PUT,DELETE',          
  allowedHeaders: 'Content-Type,Authorization'
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("My Server is Running Succesfully. 🚀");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
