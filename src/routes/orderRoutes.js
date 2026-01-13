const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
} = require('../controllers/orderController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { createOrderSchema } = require('../validations/orderValidation');

router.route('/').post(protect, validate(createOrderSchema), addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

module.exports = router;
