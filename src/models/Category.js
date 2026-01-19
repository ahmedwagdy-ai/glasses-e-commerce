const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    description: {
        en: { type: String },
        ar: { type: String }
    },
    image: {
        url: { type: String },
        public_id: { type: String }
    }
}, {
    timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
