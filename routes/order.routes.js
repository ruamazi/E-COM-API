import { Router } from "express";
import {
 deleteOrder,
 getMyOrders,
 getOrderById,
} from "../controllers/order.controllers.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = Router();

// "/api/orders"
router.get("/my-orders", protectRoute, getMyOrders);
router.get("/single-order/:id", protectRoute, getOrderById);
router.delete("/delete-order/:id", protectRoute, deleteOrder);

export default router;
