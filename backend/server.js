import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ success: true, data: "ok" }));
app.use("/api/bookmarks", bookmarkRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI. Copy .env.example to .env and fill it in.");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

start();
