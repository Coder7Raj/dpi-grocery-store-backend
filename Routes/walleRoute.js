const express = require('express');
const router = express.Router();
const { transfer, getBalance } = require("../Config/wallet"); // ✅ fixed

router.post('/transfer', transfer); // ✅ pass the actual function
router.get('/getbalance/:payId', getBalance)

module.exports = router;
