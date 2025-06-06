const express = require("express");
const router = express.Router();
const { register, login , verifyEmail} = require("../Config/auth");

router.post("/register", register);
router.get("/verify/:token", verifyEmail);

router.post("/login", login);

module.exports = router;
