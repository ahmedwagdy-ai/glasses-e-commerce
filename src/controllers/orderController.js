const asyncHandler = require('../middleware/asyncHandler');
const orderService = require('../services/orderService');

// @desc    Create new order
// @route   POST /api/orders
const addOrderItems = asyncHandler(async (req, res) => {
    try {
        const { product, quantity, address, paymentMethod } = req.body;

        const orderData = {
            user: req.user._id,
            customerName: req.user.name,
            address,
            paymentMethod,
            items: [
                {
                    product,
                    quantity: quantity || 1
                }
            ]
        };
        const createdOrder = await orderService.createOrder(orderData);
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: createdOrder
        });
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
        res.json({
            success: true,
            message: 'Order retrieved successfully',
            data: order
        });
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getMyOrders(req.user._id);
    res.json({
        success: true,
        message: 'My orders retrieved successfully',
        data: orders
    });
});

// @desc    Get all orders
// @route   GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getOrders(req.query);
    res.json({
        success: true,
        message: 'Orders retrieved successfully',
        data: result
    });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
    try {
        const updatedOrder = await orderService.updateOrderToPaid(req.params.id, req.body);
        res.json({
            success: true,
            message: 'Order updated to paid successfully',
            data: updatedOrder
        });
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
        res.json({
            success: true,
            message: 'Order updated to delivered successfully',
            data: updatedOrder
        });
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

// @desc    Update order to done (completed)
// @route   PUT /api/orders/:id/done
const updateOrderToDone = asyncHandler(async (req, res) => {
    try {
        const updatedOrder = await orderService.updateOrderToDone(req.params.id);
        res.json({
            success: true,
            message: 'Order updated to done successfully',
            data: updatedOrder
        });
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

// @desc    Get delivered orders
// @route   GET /api/admin/orders/delivered
const getDeliveredOrders = asyncHandler(async (req, res) => {
    const query = { ...req.query, isDelivered: 'true' };
    const result = await orderService.getOrders(query);
    res.json({
        success: true,
        message: 'Delivered orders retrieved successfully',
        data: result
    });
});

// @desc    Get paid orders
// @route   GET /api/admin/orders/paid
const getPaidOrders = asyncHandler(async (req, res) => {
    const query = { ...req.query, isPaid: 'true' };
    const result = await orderService.getOrders(query);
    res.json({
        success: true,
        message: 'Paid orders retrieved successfully',
        data: result
    });
});

// @desc    Get pending orders
// @route   GET /api/admin/orders/pending
const getPendingOrders = asyncHandler(async (req, res) => {
    // Pending usually means status is 'pending' (default)
    const query = { ...req.query, status: 'pending' };
    const result = await orderService.getOrders(query);
    res.json({
        success: true,
        message: 'Pending orders retrieved successfully',
        data: result
    });
});

module.exports = {
    addOrderItems,
    getOrderById,
    getOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getDeliveredOrders,
    getPaidOrders,
    getPendingOrders,
};
