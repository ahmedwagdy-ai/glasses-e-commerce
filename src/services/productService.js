const Product = require('../models/Product');
const QueryHelper = require('../utils/QueryHelper');
const cloudinaryService = require('../services/cloudinaryService');

class ProductService {
    async getAllProducts(queryString) {
        const features = new QueryHelper(Product.find({}).populate('category'), queryString)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        return await features.query;
    }

    async getProductById(id) {
        const product = await Product.findById(id).populate('category');
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async createProduct(data) {
        const { name, description, price, category, colors, countInStock } = data;

        const product = new Product({
            name,
            description,
            price,
            category,
            colors,
            countInStock
        });

        return await product.save();
    }

    async updateProduct(id, data) {
        const product = await this.getProductById(id);

        // Cleanup images if they are being updated
        if (data.colors) {
            for (const col of product.colors) {
                if (col.image && col.image.public_id) {
                    const isKept = data.colors.find((newCol) => newCol.image.public_id === col.image.public_id);
                    if (!isKept) {
                        await cloudinaryService.deleteImage(col.image.public_id);
                    }
                }
            }
            product.colors = data.colors;
        }

        product.name = data.name || product.name;
        product.description = data.description || product.description;
        product.price = data.price || product.price;
        product.category = data.category || product.category;
        product.countInStock = data.countInStock !== undefined ? data.countInStock : product.countInStock;

        return await product.save();
    }

    async deleteProduct(id) {
        const product = await this.getProductById(id);

        // Delete all associated images from Cloudinary
        if (product.colors && product.colors.length > 0) {
            for (const col of product.colors) {
                if (col.image && col.image.public_id) {
                    await cloudinaryService.deleteImage(col.image.public_id);
                }
            }
        }

        await product.deleteOne();
        return { message: 'Product removed' };
    }
}

module.exports = new ProductService();
