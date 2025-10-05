import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { allow } from "../middlewares/roles.js";
import { listCourses, getCourse, createCourse, updateCourse, deleteCourse } from "../controllers/course.controller.js";

const router = Router();

router.get("/", listCourses);
router.get("/:id", getCourse);
router.post("/", auth, allow("admin", "instructor"), createCourse);
router.put("/:id", auth, allow("admin", "instructor"), updateCourse);
router.delete("/:id", auth, allow("admin", "instructor"), deleteCourse);

export default router;
