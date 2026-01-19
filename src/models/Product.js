const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    price: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
    colors: [
        {
            name: { type: String, required: true },
            image: {
                url: { type: String, required: true },
                public_id: { type: String, required: true }
            }
        }
    ],
    countInStock: { type: Number, required: true, default: 0 },
    numVisits: { type: Number, required: true, default: 0 },
    numSales: { type: Number, required: true, default: 0 },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
            name: { type: String, required: true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
