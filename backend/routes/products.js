const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products for the authenticated user with pagination
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const sortBy = req.query.sortBy || 'name';

    const query = { user: req.user.id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sort = {};
    if (sortBy === 'name') sort = { name: 1 };
    else if (sortBy === 'price-asc') sort = { price: 1 };
    else if (sortBy === 'price-desc') sort = { price: -1 };
    else sort = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product belongs to user
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

const upload = require('../middleware/upload');

// ... (existing imports)

// Create product
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, subcategory } = req.body;
    const numericPrice = Number(price);

    if (!name || !description || !category || !subcategory || Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: 'Validation error' });
    }
    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = req.file.path;
    }

    const product = new Product({
      name,
      description,
      price: numericPrice,
      category,
      subcategory,
      image: imageUrl,
      user: req.user.id,
    });

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update product
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, subcategory } = req.body;
    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = req.file.path;
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product belongs to user
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const update = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (category !== undefined) update.category = category;
    if (subcategory !== undefined) update.subcategory = subcategory;
    if (price !== undefined) {
      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ message: 'Validation error' });
      }
      update.price = numericPrice;
    }
    if (imageUrl !== undefined) update.image = imageUrl || product.image;

    product = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product belongs to user
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
