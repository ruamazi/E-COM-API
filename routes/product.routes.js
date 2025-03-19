import { Router } from "express";
import protectRoute, { isAdmin } from "../middleware/authMiddleware.js";
import {
 bestSeller,
 getProductById,
 getProductBySort,
 getSimilarProducts,
 newArrivals,
} from "../controllers/product.controller.js";

const router = Router();

// "/api/products"
router.get("/all-by-sort", getProductBySort);
router.get("/single-product/:id", getProductById);
router.get("/similar-products/:id", getSimilarProducts);
router.get("/best-seller", bestSeller);
router.get("/new-arrivals", newArrivals);

export default router;
