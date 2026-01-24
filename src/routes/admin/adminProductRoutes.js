const express = require('express');
const router = express.Router();
const {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductById,
} = require('../../controllers/productController');
const { protect, admin } = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const { createProductSchema, updateProductSchema } = require('../../validations/productValidation');
const upload = require('../../config/cloudinary');
const { parseFile } = require('../../middleware/fileParser');
const { processMixedFiles } = require('../../middleware/fileParser');

router.route('/')
    .get(protect, admin, getProducts)
    .post(protect, admin, upload.any(), processMixedFiles, validate(createProductSchema), createProduct);

router.route('/:id')
    .get(protect, admin, getProductById)
    .put(protect, admin, upload.any(), processMixedFiles, validate(updateProductSchema), updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
