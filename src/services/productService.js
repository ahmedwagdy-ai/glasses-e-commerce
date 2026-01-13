const Product = require('../models/Product');
const QueryHelper = require('../utils/QueryHelper');
const cloudinaryService = require('../services/cloudinaryService');

const Category = require('../models/Category');

class ProductService {
    async getAllProducts(queryString) {
        if (queryString.category) {
            const category = await Category.findOne({ name: { $regex: queryString.category, $options: 'i' } });
            if (category) {
                queryString.category = category._id;
            } else {
                return { products: [], page: 1, pages: 0, count: 0 };
            }
        }

        let productQuery = Product.find();

        if (queryString.keyword) {
            const categories = await Category.find({ name: { $regex: queryString.keyword, $options: 'i' } });
            const categoryIds = categories.map((c) => c._id);

            const keywordRegex = { $regex: queryString.keyword, $options: 'i' };
            const searchConditions = [
                { name: keywordRegex },
                { description: keywordRegex },
                { 'colors.name': keywordRegex },
            ];

            if (categoryIds.length > 0) {
                searchConditions.push({ category: { $in: categoryIds } });
            }

            // Check if keyword is a valid ObjectId (for direct Category ID search)
            if (require('mongoose').isValidObjectId(queryString.keyword)) {
                searchConditions.push({ category: queryString.keyword });
            }

            productQuery = productQuery.find({ $or: searchConditions });
        }

        const countQuery = new QueryHelper(productQuery.clone(), queryString).filter();
        const count = await countQuery.query.countDocuments();

        const features = new QueryHelper(productQuery, queryString)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const products = await features.query;

        const page = queryString.page * 1 || 1;
        const limit = queryString.limit * 1 || 10;
        const pages = Math.ceil(count / limit);

        return { products, page, pages, count };
    }

    async getProductById(id) {
        const product = await Product.findById(id).populate('category');

        if (product) {
            product.numVisits = (product.numVisits || 0) + 1;
            await product.save({ validateBeforeSave: false });
        }

        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async getTopProducts(limit = 4) {
        return await Product.find({}).sort({ numVisits: -1 }).limit(limit);
    }

    async getBestSellingProducts(limit = 4) {
        return await Product.find({}).sort({ numSales: -1 }).limit(limit);
    }

    async createProductReview(productId, user, rating, comment) {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === user._id.toString()
        );

        if (alreadyReviewed) {
            throw new Error('Product already reviewed');
        }

        const review = {
            name: user.name,
            rating: Number(rating),
            comment,
            user: user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();

        return { message: 'Review added' };
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
