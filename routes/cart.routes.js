import { Router } from "express";
import protectRoute from "../middleware/authMiddleware.js";
import {
 addToCart,
 getCart,
 mergeGuestCartIntoUserCart,
 removeFromCart,
 updateCart,
 updateProductQuantity,
} from "../controllers/cart.controllers.js";

const router = Router();

router.post("/add-to-cart", protectRoute, addToCart);
router.put("/update-product-quantity", updateProductQuantity);
router.get("/get-cart", getCart);
router.delete("/remove-from-cart", removeFromCart);
router.post("/merge-guest-cart", protectRoute, mergeGuestCartIntoUserCart);

router.put("/update-cart", protectRoute, updateCart);

export default router;
