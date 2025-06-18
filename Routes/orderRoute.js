const express = require('express');
const router = express.Router();
const { placeOrder, updateOrderStatus } = require('../Config/order');

router.post('/place', placeOrder);
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;
