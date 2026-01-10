const asyncHandler = require('../middleware/asyncHandler');
const orderService = require('../services/orderService');

// @desc    Create new order
// @route   POST /api/orders
const addOrderItems = asyncHandler(async (req, res) => {
    try {
        const orderData = { ...req.body, user: req.user._id };
        const createdOrder = await orderService.createOrder(orderData);
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

// @desc    Get all orders
// @route   GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getOrders();
    res.json(orders);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
    try {
        const updatedOrder = await orderService.updateOrderToPaid(req.params.id, req.body);
        res.json(updatedOrder);
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    try {
        const updatedOrder = await orderService.updateOrderToDelivered(req.params.id);
        res.json(updatedOrder);
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

module.exports = {
    addOrderItems,
    getOrderById,
    getOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
};
