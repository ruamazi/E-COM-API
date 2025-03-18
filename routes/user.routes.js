import { Router } from "express";
import {
 changeRole,
 getUserById,
 loginUser,
 registerUaer,
} from "../controllers/user.controller.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUaer);
router.post("/login", loginUser);
router.get("/profile/:id", protectRoute, getUserById);
router.put("/change-role/:id", changeRole);

export default router;
