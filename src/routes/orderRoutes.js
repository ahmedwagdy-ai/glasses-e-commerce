const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    getOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
} = require('../controllers/orderController');
const validate = require('../middleware/validate');
const { protect, admin } = require('../middleware/authMiddleware');
const { createOrderSchema } = require('../validations/orderValidation');

router.route('/').post(protect, validate(createOrderSchema), addOrderItems).get(protect, admin, getOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
