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

// Enable CORS for specific domain (your frontend URL)
const corsOptions = {
  origin: 'https://postify-nine.vercel.app/', // your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  allowedHeaders: 'Content-Type,Authorization', // Allowed headers
};

app.use(cors(corsOptions)); // Use CORS middleware with the options

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("My App is Running");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
