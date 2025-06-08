const Product = require('../models/product.module');


// create -------
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, image, category, stock } = req.body;

    // Create new product with admin ID
    const newProduct = new Product({
      title,
      description,
      price,
      image,
      category,
      stock,
   
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.log(error)
  }
};

// update
// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true } // returns the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // You can add filters if needed
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Failed to get products", error: error.message });
  }
};

// Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Failed to get product", error: error.message });
  }
};

// sorting-----------\
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.name;
    const products = await Product.find({ category });

    if (!products.length) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category products", error: error.message });
  }
};

// search
exports.searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q;
    const products = await Product.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};

exports.sortProducts = async (req, res) => {
  try {
    const { by = "price", order = "asc" } = req.query;
    const sortOrder = order === "desc" ? -1 : 1;

    const products = await Product.find().sort({ [by]: sortOrder });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to sort products", error: error.message });
  }
};
