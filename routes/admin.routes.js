import { Router } from "express";
import {
 addNewUser,
 createProduct,
 deleteOrder,
 deleteProduct,
 deleteUser,
 getAllOrders,
 getAllProducts,
 getAllUsers,
 updateOrderStatus,
 updateProduct,
 updateUser,
} from "../controllers/admin.controllers.js";
import protectRoute, { isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// "/api/admin"

router.get("/users", protectRoute, isAdmin, getAllUsers);
router.post("/create-user", protectRoute, isAdmin, addNewUser);
router.put("/update-user/:id", protectRoute, isAdmin, updateUser);
router.delete("/delete-user/:id", protectRoute, isAdmin, deleteUser);

router.get("/products", protectRoute, isAdmin, getAllProducts);
router.post("/create-product", protectRoute, isAdmin, createProduct);
router.put("/update-product/:id", protectRoute, isAdmin, updateProduct);
router.delete("/delete-product/:id", protectRoute, isAdmin, deleteProduct);

router.get("/orders", protectRoute, isAdmin, getAllOrders);
router.put("/order-status/:id", protectRoute, isAdmin, updateOrderStatus);
router.delete("/delete-order/:id", protectRoute, isAdmin, deleteOrder);

export default router;
