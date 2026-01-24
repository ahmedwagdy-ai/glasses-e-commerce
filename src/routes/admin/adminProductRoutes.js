const express = require('express');
const router = express.Router();
const {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductById,
    backfillProducts
} = require('../../controllers/productController');
const { protect, admin } = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const { createProductSchema, updateProductSchema } = require('../../validations/productValidation');
const upload = require('../../config/cloudinary');
const { parseFile } = require('../../middleware/fileParser');
const { processMixedFiles } = require('../../middleware/fileParser');

router.route('/')
    .get(protect, admin, getProducts)
    .post(protect, admin, upload.fields([{ name: 'colorImages', maxCount: 10 }]), processMixedFiles, validate(createProductSchema), createProduct);

router.route('/:id')
    .get(protect, admin, getProductById)
    .put(protect, admin, upload.fields([{ name: 'colorImages', maxCount: 10 }]), processMixedFiles, validate(updateProductSchema), updateProduct)
    .delete(protect, admin, deleteProduct);

router.route('/migration/backfill-price')
    .put(protect, admin, backfillProducts);

module.exports = router;
