const express = require('express');
const router = express.Router();
const { placeOrder, updateOrderStatus, getUserOrders, getPendingOrders, getCompletedOrders } = require('../Config/order');
const authMiddleware = require("../Config/middleware")
const isAdmin = require("../Config/isAdmin")

router.post('/place',authMiddleware, placeOrder);
router.get('/myOrder',authMiddleware, getUserOrders);
router.get('/pending',authMiddleware, getPendingOrders);
router.put('/status/:orderId',authMiddleware, isAdmin, updateOrderStatus);
router.get("/completed", authMiddleware, isAdmin, getCompletedOrders);

module.exports = router;
