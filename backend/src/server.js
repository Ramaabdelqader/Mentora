import dotenv from "dotenv";
dotenv.config(); // load .env BEFORE anything else

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { sequelize } from "./config/db.js";
import "./models/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import userRoutes from "./routes/user.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(express.json());

// Health
app.get("/", (_req, res) => res.send("Mentora API is running"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/uploads", express.static("uploads"));

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;

sequelize
  .authenticate()
  .then(() => console.log("✅ DB connected"))
  .then(() => sequelize.sync({ alter: true })) // Consider migrations in production
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB error:", err.message);
    process.exit(1);
  });

// Optional: graceful shutdown
process.on("SIGINT", () => {
  sequelize.close().then(() => process.exit(0));
});
