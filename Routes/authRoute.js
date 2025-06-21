const express = require("express");
const router = express.Router();
const User = require("../models/user.module")
const { register, login , verifyEmail, logout } = require("../Config/auth");
const authMiddleware = require('../Config/middleware')
router.post("/register", register);
router.get("/verify/:token", verifyEmail);

router.post("/login",  login);
router.post("/logout", logout);
router.get('/me', authMiddleware, async(req, res)=>{
     try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
})


module.exports = router;
