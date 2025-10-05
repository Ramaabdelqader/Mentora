import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { enroll, myCourses, drop } from "../controllers/enrollment.controller.js";

const router = Router();

router.post("/", auth, enroll);              // body: { courseId }
router.get("/my-courses", auth, myCourses);  // list current user's enrolled courses
router.delete("/:courseId", auth, drop);     // drop enrollment

export default router;
