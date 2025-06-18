const express = require('express');
const router = express.Router();
const { addCart, getCart } = require('../Config/cart');
const authMiddleware = require("../Config/middleware")

router.post('/addCart', authMiddleware, addCart );
router.get('/getCart', authMiddleware, getCart); 

module.exports = router;
