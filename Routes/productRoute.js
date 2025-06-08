const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById, getProductsByCategory, searchProducts, sortProducts } = require('../Config/product');
const adminAuth = require('../Config/isAdmin');

router.post('/create', createProduct);
// Update Product
 router.put("/update/:id", updateProduct);
 
// Delete Product
router.delete("/delete/:id", deleteProduct);

// get all
router.get("/all", getAllProducts);
router.get('/search', searchProducts);

router.get('/sort', sortProducts);
router.get("/:id", getProductById);

// sorting
router.get('/category/:name', getProductsByCategory);




module.exports = router;
