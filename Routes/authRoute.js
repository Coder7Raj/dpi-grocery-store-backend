const express = require("express");
const router = express.Router();
const { register, login , verifyEmail, logout } = require("../Config/auth");
const authMiddleware = require('../Config/middleware')
router.post("/register", register);
router.get("/verify/:token", verifyEmail);

router.post("/login",  login);
router.post("/logout", logout);


module.exports = router;
