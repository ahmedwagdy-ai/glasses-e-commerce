const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
} = require('../controllers/productController');
const validate = require('../middleware/validate');
const {
    createProductSchema,
    updateProductSchema,
    reviewSchema
} = require('../validations/productValidation');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');
const { parseFiles, processMixedFiles } = require('../middleware/fileParser');

router.route('/').get(getProducts).post(protect, admin, upload.any(), processMixedFiles, validate(createProductSchema), createProduct);
router.route('/:id/reviews').post(protect, validate(reviewSchema), createProductReview);
router.route('/:id')
    .get(getProductById);

module.exports = router;
