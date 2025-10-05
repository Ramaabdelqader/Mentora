import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { allow } from "../middlewares/roles.js";
import {
  listLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller.js";

const router = Router();

// public list (optionally filter by courseId)
router.get("/", listLessons);

// instructors & admins can create/update/delete
router.post("/", auth, allow("admin", "instructor"), createLesson);
router.put("/:id", auth, allow("admin", "instructor"), updateLesson);
router.delete("/:id", auth, allow("admin", "instructor"), deleteLesson);

export default router; // 👈 MUST be a default export of the Router function
