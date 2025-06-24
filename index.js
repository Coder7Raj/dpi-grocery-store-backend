// server/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./Config/db.js");
const authRoutes = require("./Routes/authRoute.js");
const productRoutes = require("./Routes/productRoute.js");
const userRoute = require("./Routes/userRoutes.js");
const updatProfile = require("./Routes/profileRoutes.js");
const order = require("./Routes/orderRoute.js");
const wallet = require("./Routes/walleRoute.js");
const cart = require("./Routes/cartRoute.js");
const app = express();
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");

const fs = require("fs");
const path = require("path");

// Connect DB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "https://starlit-seahorse-c2a8ac.netlify.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/user", userRoute);
app.use("/api/profile", updatProfile);
app.use("/api/wallet", wallet);
app.use("/api/order", order);
app.use("/api/cart", cart);

// Sample route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
