const express = require('express');
const router = express.Router();
const { addCart, getCart , deleteCartItem} = require('../Config/cart');
const authMiddleware = require("../Config/middleware")

router.post('/addCart', authMiddleware, addCart );
router.get('/getCart', authMiddleware, getCart); 
router.delete('/delete/:productId', authMiddleware, deleteCartItem);


module.exports = router;
