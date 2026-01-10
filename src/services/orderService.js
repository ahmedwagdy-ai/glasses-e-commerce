const Product = require('../models/Product');

class OrderService {
    async createOrder(data) {
        const {
            customerName,
            address,
            paymentMethod,
            items,
            totalAmount,
            user,
        } = data;

        if (items && items.length === 0) {
            throw new Error('No order items');
        }

        // 1. Verify Stock & Prices
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product not found: ${item.name}`);
            }
            if (product.countInStock < item.quantity) {
                throw new Error(`Not enough stock for ${product.name}`);
            }
        }

        // 2. Create Order
        const order = new Order({
            user,
            customerName,
            address,
            paymentMethod,
            items,
            totalAmount,
        });

        const createdOrder = await order.save();

        // 3. Deduct Stock
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock -= item.quantity;
                await product.save();
            }
        }

        return createdOrder;
    }

    async getOrderById(id) {
        const order = await Order.findById(id).populate('items.product', 'name price image');
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async getOrders() {
        return await Order.find({}).populate('items.product', 'name price image');
    }

    async updateOrderToPaid(id, paymentResult) {
        const order = await this.getOrderById(id);

        order.isPaid = true;
        order.paidAt = Date.now();
        // order.paymentResult = paymentResult; // Add this when payment implementation is ready

        return await order.save();
    }

    async updateOrderToDelivered(id) {
        const order = await this.getOrderById(id);

        order.isDelivered = true;
        order.deliveredAt = Date.now();

        return await order.save();
    }
}

module.exports = new OrderService();
