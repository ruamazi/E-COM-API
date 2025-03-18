import { Router } from "express";
import { upload, uploadImage } from "../controllers/image.controllers.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = Router();

router.post("/upload-image", protectRoute, upload.single("image"), uploadImage);

export default router;
