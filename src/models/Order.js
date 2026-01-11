const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Visa', 'Didital Wallet', 'Cash on Delivery']
    },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
