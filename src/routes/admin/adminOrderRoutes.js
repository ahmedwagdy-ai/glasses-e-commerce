const express = require('express');
const router = express.Router();
const {
    getOrders,
    updateOrderToDelivered,
    updateOrderToPaid,
    getDeliveredOrders,
    getPaidOrders,
    getPendingOrders,
} = require('../../controllers/orderController');
const { protect, admin } = require('../../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getOrders);

router.route('/:id/deliver')
    .put(protect, admin, updateOrderToDelivered);

router.route('/:id/pay')
    .put(protect, admin, updateOrderToPaid);

router.route('/delivered')
    .get(protect, admin, getDeliveredOrders);

router.route('/paid')
    .get(protect, admin, getPaidOrders);

router.route('/pending')
    .get(protect, admin, getPendingOrders);

module.exports = router;
