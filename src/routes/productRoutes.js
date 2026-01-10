const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const validate = require('../middleware/validate');
const { createProductSchema, updateProductSchema } = require('../validations/productValidation');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');
const { parseFiles, processMixedFiles } = require('../middleware/fileParser');

router
    .route('/')
    .get(getProducts)
    .post(
        protect,
        admin,
        upload.fields([
            { name: 'colorImages', maxCount: 10 }
        ]),
        processMixedFiles,
        validate(createProductSchema),
        createProduct
    );

router
    .route('/:id')
    .get(getProductById)
    .put(
        protect,
        admin,
        upload.fields([
            { name: 'colorImages', maxCount: 10 }
        ]),
        processMixedFiles,
        validate(updateProductSchema),
        updateProduct
    )
    .delete(protect, admin, deleteProduct);

module.exports = router;
