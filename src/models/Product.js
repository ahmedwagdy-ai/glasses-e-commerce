const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    price: { type: Number, required: true },
    priceBeforeDiscount: { type: Number, required: false, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
    colors: [
        {
            name: { type: String, required: true },
            images: [
                {
                    url: { type: String, required: true },
                    public_id: { type: String, required: true }
                }
            ]
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
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            // Enforce field order to keep prices together
            return {
                _id: ret._id,
                name: ret.name,
                description: ret.description,
                price: ret.price,
                priceBeforeDiscount: ret.priceBeforeDiscount,
                // Spread the rest of the fields
                ...ret
            };
        }
    },
    toObject: { virtuals: true }
});

productSchema.virtual('availability').get(function () {
    if (this.countInStock === 0) {
        return { en: "Out of Stock", ar: "غير متوفر" };
    } else {
        return { en: "In Stock", ar: "متوفر" };
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
