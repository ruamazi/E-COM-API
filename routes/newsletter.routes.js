import { Router } from "express";
import { subscribe } from "../controllers/newsletter.controllers.js";

const router = Router();

// "/api/newsletter"
router.post("/subscribe", subscribe);

export default router;
