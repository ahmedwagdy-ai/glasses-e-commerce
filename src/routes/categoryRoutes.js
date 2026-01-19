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
const { parseFile, processMixedFiles } = require('../middleware/fileParser');

router
    .route('/')
    .get(getCategories)
    .post(protect, admin, upload.single('image'), parseFile('image'), processMixedFiles, validate(createCategorySchema), createCategory);

router
    .route('/:id')
    .get(getCategoryById)
    .put(protect, admin, upload.single('image'), parseFile('image'), processMixedFiles, validate(updateCategorySchema), updateCategory)
    .delete(protect, admin, deleteCategory);

module.exports = router;
