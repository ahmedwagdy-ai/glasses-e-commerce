const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

class DashboardService {
    async getStatistics() {
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();

        const paidOrders = await Order.find({ isPaid: true });
        const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalSales = paidOrders.length;

        const lowStockProducts = await Product.countDocuments({ countInStock: { $lt: 5 } });

        // 1. Monthly Revenue (Current vs Last Month)
        const currentMonthStart = new Date(new Date().setDate(1));
        const lastMonthStart = new Date(new Date().setMonth(new Date().getMonth() - 1));
        lastMonthStart.setDate(1);

        const currentMonthRevenue = (await Order.find({
            isPaid: true,
            createdAt: { $gte: currentMonthStart }
        })).reduce((acc, order) => acc + order.totalAmount, 0);

        const lastMonthRevenue = (await Order.find({
            isPaid: true,
            createdAt: { $gte: lastMonthStart, $lt: currentMonthStart }
        })).reduce((acc, order) => acc + order.totalAmount, 0);

        // 2. Daily Sales (Last 7 Days)
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const last7DaysOrders = await Order.aggregate([
            { $match: { isPaid: true, createdAt: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 3. Order Status Breakdown
        const statusBreakdown = await Order.aggregate([
            {
                $group: {
                    _id: "$isDelivered",
                    count: { $sum: 1 }
                }
            }
        ]);

        const deliveredOrdersCount = statusBreakdown.find(s => s._id === true)?.count || 0;
        const pendingOrdersCount = statusBreakdown.find(s => s._id === false)?.count || 0;


        return {
            userCount,
            productCount,
            orderCount,
            totalRevenue,
            totalSales,
            lowStockProducts,
            revenueStats: {
                currentMonth: currentMonthRevenue,
                lastMonth: lastMonthRevenue,
                growth: lastMonthRevenue === 0 ? 100 : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            },
            salesChart: last7DaysOrders,
            ordersBreakdown: {
                delivered: deliveredOrdersCount,
                pending: pendingOrdersCount
            }
        };
    }
}

module.exports = new DashboardService();
