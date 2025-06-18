const express = require('express');
const router = express.Router();
const { addCart } = require('../Config/cart');

router.post('/addCart', addCart );


module.exports = router;
