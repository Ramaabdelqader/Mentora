import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { allow } from "../middlewares/roles.js";
import { listCategories, createCategory, deleteCategory } from "../controllers/category.controller.js";

const router = Router();

router.get("/", listCategories);
router.post("/", auth, allow("admin", "instructor"), createCategory);
router.delete("/:id", auth, allow("admin", "instructor"), deleteCategory);

export default router;
