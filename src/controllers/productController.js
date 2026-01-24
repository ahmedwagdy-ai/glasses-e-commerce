const asyncHandler = require('../middleware/asyncHandler');
const productService = require('../services/productService');

// @desc    Fetch all products
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
    // Filter out of stock products for non-admins (User APIs)
    // Admin routes use 'protect' middleware which populates req.user
    if (!(req.user && req.user.isAdmin)) {
        req.query.countInStock = { $gt: 0 };
    }

    const products = await productService.getAllProducts(req.query);
    res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: products
    });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json({
            success: true,
            message: 'Product retrieved successfully',
            data: product
        });
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

// @desc    Create a product
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        res.json({
            success: true,
            message: 'Product deleted successfully',
            data: result
        });
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    await productService.createProductReview(req.params.id, req.user, rating, comment);
    res.status(201).json({
        success: true,
        message: 'Review added'
    });
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
};
