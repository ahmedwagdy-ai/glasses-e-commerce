const asyncHandler = require('../middleware/asyncHandler');
const orderService = require('../services/orderService');

// @desc    Create new order (User)
// @route   POST /api/orders
const addOrderItems = asyncHandler(async (req, res) => {
    try {
        const { product, quantity, items, address, paymentMethod } = req.body;

        // User MUST have a phone number in profile
        if (!req.user.phone) {
            res.status(400);
            throw new Error('Please update your profile with a phone number or provide one in the request.');
        }

        let orderItems = [];
        if (items && Array.isArray(items) && items.length > 0) {
            orderItems = items;
        } else if (product) {
            orderItems = [{ product, quantity: quantity || 1 }];
        } else {
            res.status(400);
            throw new Error('No order items');
        }

        const orderData = {
            user: req.user._id,
            customerName: req.user.name,
            phone: req.user.phone,
            orderSource: 'online',
            address,
            paymentMethod,
            items: orderItems
        };
        const createdOrder = await orderService.createOrder(orderData);

        // Remove user ID from response
        const responseOrder = createdOrder.toObject();
        delete responseOrder.user;

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: responseOrder
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// @desc    Create new order (Admin Manual)
// @route   POST /api/orders/admin
const createAdminOrder = asyncHandler(async (req, res) => {
    try {
        // Double check for admin privileges
        if (!req.user || !req.user.isAdmin) {
            res.status(401);
            throw new Error('Not authorized as an admin');
        }

        const { product, quantity, items, address, paymentMethod, customerName, phone } = req.body;

        if (!customerName || !phone) {
            res.status(400);
            throw new Error('Customer name and phone are required for manual orders');
        }

        let orderItems = [];
        if (items && Array.isArray(items) && items.length > 0) {
            orderItems = items;
        } else if (product) {
            orderItems = [{ product, quantity: quantity || 1 }];
        } else {
            res.status(400);
            throw new Error('No order items');
        }

        const orderData = {
            user: req.user._id, // Created by Admin
            customerName: customerName,
            phone: phone,
            orderSource: 'offline',
            address,
            paymentMethod,
            items: orderItems
        };
        const createdOrder = await orderService.createOrder(orderData);

        // Remove user ID from response
        const responseOrder = createdOrder.toObject();
        delete responseOrder.user;

        res.status(201).json({
            success: true,
            message: 'Manual order created successfully',
            data: responseOrder
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
    const result = await orderService.getMyOrders(req.user._id, req.query);
    res.json({
        success: true,
        message: 'My orders retrieved successfully',
        data: result
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
    createAdminOrder,
    getOrderById,
    getOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getDeliveredOrders,
    getPaidOrders,
    getPendingOrders,
};
