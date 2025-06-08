const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, deleteProduct } = require('../Config/product');
const adminAuth = require('../Config/isAdmin');

router.post('/create', createProduct);
// Update Product
 router.put("/update/:id", updateProduct);
 
// Delete Product
router.delete("/delete/:id", deleteProduct);

module.exports = router;
