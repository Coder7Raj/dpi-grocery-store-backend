const express = require('express');
const router = express.Router();
const { transfer, getBalance , getHistory} = require("../Config/wallet"); // ✅ fixed

router.post('/transfer', transfer); // ✅ pass the actual function
router.get('/balance/:payId', getBalance)
router.get('/history/:payId', getHistory)

module.exports = router;
