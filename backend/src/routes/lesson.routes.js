import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { allow } from "../middlewares/roles.js";
import {
  listLessons,
  getLessonSecure,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller.js";

const router = Router();

// Public curriculum list (SAFE FIELDS ONLY)
router.get("/", listLessons);

// 🔒 Full lesson (needs login + enrollment)
router.get("/:id", auth, getLessonSecure);

// Admin/Instructor writes
router.post("/", auth, allow("admin", "instructor"), createLesson);
router.put("/:id", auth, allow("admin", "instructor"), updateLesson);
router.delete("/:id", auth, allow("admin", "instructor"), deleteLesson);

export default router;
