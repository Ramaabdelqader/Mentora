import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { allow } from "../middlewares/roles.js";
import { listUsers, setRole, resetPassword, deleteUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/", auth, allow("admin"), listUsers);
router.patch("/:id/role", auth, allow("admin"), setRole);
router.patch("/:id/password", auth, allow("admin"), resetPassword);
router.delete("/:id", auth, allow("admin"), deleteUser);

export default router;
