const express = require('express');
const router = express.Router();
const { transfer, getBalance , getHistory, useCoinToAddBalance, useBalanceToBuyCoin} = require("../Config/wallet"); // ✅ fixed
const authMiddleware = require("../Config/middleware");

router.post('/transfer', transfer); // ✅ pass the actual function
router.get('/balance',authMiddleware, getBalance)
router.get('/history',authMiddleware, getHistory)
router.post('/useCoin', authMiddleware, useCoinToAddBalance);
router.post('/useBalance', authMiddleware, useBalanceToBuyCoin);

module.exports = router;
