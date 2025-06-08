// server/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./Config/db.js");
const authRoutes = require("./Routes/authRoute.js")
const productRoutes = require("./Routes/productRoute.js")
const app = express();
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");



// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5000", // your frontend origin
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes)

// Sample route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
