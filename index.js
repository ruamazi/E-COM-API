import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import seedData from "./routes/seeds.js";
import cartRoutes from "./routes/cart.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import orderRoutes from "./routes/order.routes.js";
import imageRoutes from "./routes/image.routes.js";
import newsletterRoutes from "./routes/newsletter.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(
 cors({
  origin: "*",
  credentials: true,
 })
);

app.get("/api", (req, res) => {
 res.json({ message: "welcome to the api" });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/seed", seedData);

app.listen(port, () => {
 console.log(`Server is listening on http://localhost:${port}`);
 connectDB();
});
