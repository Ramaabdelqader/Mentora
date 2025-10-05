import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";
import "./models/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true })); // dev: allow all
app.use(express.json());

// Health
app.get("/", (_req, res) => res.send("Mentora API is running"));

// API
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

// Errors
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

sequelize
  .authenticate()
  .then(() => console.log("✅ DB connected"))
  .then(() => sequelize.sync({ alter: true }))
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB error:", err.message);
    process.exit(1);
  });
