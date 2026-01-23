const Product = require('../models/Product');
const Order = require('../models/Order');
const QueryHelper = require('../utils/QueryHelper');

class OrderService {
    async createOrder(data) {
        const {
            customerName,
            phone,
            orderSource,
            address,
            paymentMethod,
            items,
            user,
        } = data;

        if (items && items.length === 0) {
            throw new Error('No order items');
        }

        let itemsPrice = 0;
        // 1. Verify Stock & Prices & Calculate Total & Prepare Items
        let shippingPrice = 0;
        const orderItems = [];

        for (const item of items) {
            if (!item.product) {
                throw new Error('Product ID is missing in one of the items');
            }
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product not found: ${item.name || item.product}`);
            }
            if (product.countInStock < item.quantity) {
                throw new Error(`Not enough stock for ${product.name}`);
            }
            // Add product shipping cost * quantity (or just flat per product if preferred, but assuming quantity based)
            // Default to 0 if not set on product
            const productShipping = product.shippingPrice || 0;
            shippingPrice += productShipping * item.quantity;

            itemsPrice += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                shippingPrice: productShipping, // Store snapshot of shipping cost
                quantity: item.quantity,
                image: (product.colors && product.colors.length > 0) ? product.colors[0].image.url : null
            });
        }

        const finalTotalAmount = itemsPrice + shippingPrice;

        // 2. Create Order
        const order = new Order({
            user,
            customerName,
            phone,
            orderSource,
            address,
            paymentMethod,
            items: orderItems,
            shippingPrice: shippingPrice,
            totalAmount: finalTotalAmount,
        });

        const createdOrder = await order.save();

        // 3. Deduct Stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: {
                    countInStock: -item.quantity,
                    numSales: item.quantity
                }
            });
        }

        return createdOrder;
    }

    async getOrderById(id) {
        const order = await Order.findById(id)
            .populate('user', 'name email phone')
            .populate('items.product', 'name price image');
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async getMyOrders(userId) {
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        return {
            count: orders.length,
            orders
        };
    }

    async getOrders(queryString) {
        const countQuery = new QueryHelper(Order.find(), queryString).filter();
        const count = await countQuery.query.countDocuments();

        const features = new QueryHelper(Order.find(), queryString)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        // Populate after query helper execution if needed, but here we can chain populate 
        // Note: chained query methods work on the Mongoose Query object
        features.query
            .populate('user', 'name email phone')
            .populate('items.product', 'name price image');

        const orders = await features.query;

        const page = queryString ? (queryString.page * 1 || 1) : 1;
        const limit = queryString ? (queryString.limit * 1 || 10) : 10;
        const pages = Math.ceil(count / limit);

        return { count, page, pages, orders };
    }

    async updateOrderToPaid(id, paymentResult) {
        const order = await this.getOrderById(id);

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = paymentResult; // Add this when payment implementation is ready

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
