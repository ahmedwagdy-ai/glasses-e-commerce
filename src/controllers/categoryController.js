const asyncHandler = require('../middleware/asyncHandler');
const categoryService = require('../services/categoryService');

// @desc    Fetch all categories
// @route   GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories();
    res.json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories
    });
});

// @desc    Fetch single category
// @route   GET /api/categories/:id
const getCategoryById = asyncHandler(async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.json({
            success: true,
            message: 'Category retrieved successfully',
            data: category
        });
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

// @desc    Create a category
// @route   POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
    try {
        const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
        res.json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const result = await categoryService.deleteCategory(req.params.id);
        res.json({
            success: true,
            message: 'Category deleted successfully',
            data: result
        });
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
