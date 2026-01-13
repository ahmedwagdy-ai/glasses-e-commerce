const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getCategoryById,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createCategorySchema, updateCategorySchema } = require('../validations/categoryValidation');
const upload = require('../config/cloudinary');
const { parseFile } = require('../middleware/fileParser');

router
    .route('/')
    .get(getCategories);

router
    .route('/:id')
    .get(getCategoryById);

module.exports = router;
