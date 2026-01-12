const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const productService = require('../services/productService');

// @desc    Get top visited products
// @route   GET /api/user/home/top-visited
const getTopVisited = asyncHandler(async (req, res) => {
    const products = await productService.getTopProducts(4);

    res.json({
        success: true,
        message: 'Top visited products retrieved successfully',
        data: products
    });
});

// @desc    Get best selling products
// @route   GET /api/user/home/best-selling
const getBestSelling = asyncHandler(async (req, res) => {
    const products = await productService.getBestSellingProducts(4);

    res.json({
        success: true,
        message: 'Best selling products retrieved successfully',
        data: products
    });
});

router.get('/top-visited', getTopVisited);
router.get('/best-selling', getBestSelling);

module.exports = router;
