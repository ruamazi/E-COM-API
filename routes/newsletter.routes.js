import { Router } from "express";
import { subscribe } from "../controllers/newsletter.controllers.js";

const router = Router();

router.post("/subscribe", subscribe);

export default router;
