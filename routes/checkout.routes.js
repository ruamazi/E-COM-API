import { Router } from "express";
import {
 createCheckout,
 finalizeCheckout,
 updateCheckout,
} from "../controllers/checkout.controllers.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = Router();

router.post("/create", protectRoute, createCheckout);
router.put("/update/:id", protectRoute, updateCheckout);
router.get("/finalize/:id", protectRoute, finalizeCheckout);

export default router;
