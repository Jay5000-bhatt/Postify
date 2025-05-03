import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import ConnectDB from "./Config/ConnectDB.js";
import authRoutes from "./Routes/authRoutes.js";
import postRoutes from "./Routes/postRoutes.js";

dotenv.config();

ConnectDB().catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(helmet());

// Configure CORS
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? "https://postify-coral.vercel.app"
    : "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("My Server is Running Successfully 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
