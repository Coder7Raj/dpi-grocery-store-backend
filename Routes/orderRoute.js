const express = require('express');
const router = express.Router();
const { placeOrder } = require('../Config/order');

router.post('/place', placeOrder);

module.exports = router;
