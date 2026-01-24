const Product = require('../models/Product');
const QueryHelper = require('../utils/QueryHelper');
const cloudinaryService = require('../services/cloudinaryService');

const Category = require('../models/Category');

class ProductService {
    async getAllProducts(queryString) {
        // Handle pageNumber alias
        if (queryString.pageNumber) {
            queryString.page = queryString.pageNumber;
            delete queryString.pageNumber;
        }

        // Handle duplicate keyword (take first match)
        if (queryString.keyword && Array.isArray(queryString.keyword)) {
            queryString.keyword = queryString.keyword[0];
        }

        if (queryString.category) {
            const category = await Category.findOne({
                $or: [
                    { 'name.en': { $regex: queryString.category, $options: 'i' } },
                    { 'name.ar': { $regex: queryString.category, $options: 'i' } }
                ]
            });
            if (category) {
                queryString.category = category._id;
            } else {
                return { products: [], page: 1, pages: 0, count: 0 };
            }
        }

        let productQuery = Product.find();

        if (queryString.keyword) {
            const categories = await Category.find({
                $or: [
                    { 'name.en': { $regex: queryString.keyword, $options: 'i' } },
                    { 'name.ar': { $regex: queryString.keyword, $options: 'i' } }
                ]
            });
            const categoryIds = categories.map((c) => c._id);

            const keywordRegex = { $regex: queryString.keyword, $options: 'i' };
            const searchConditions = [
                { name: keywordRegex },
                { name: keywordRegex },
                { 'description.en': keywordRegex },
                { 'description.ar': keywordRegex },
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

        const products = await features.query.populate('category');

        const page = queryString.page * 1 || 1;
        const limit = queryString.limit * 1 || 10;
        const pages = Math.ceil(count / limit);

        return { count, page, pages, products };
    }

    async getProductById(id) {
        const product = await Product.findById(id).populate('category');

        if (product) {
            product.numVisits = (product.numVisits || 0) + 1;
            await product.save({ validateBeforeSave: false });

            // Fetch related products (same category, exclude current)
            const relatedProducts = await Product.find({
                category: product.category._id,
                _id: { $ne: product._id }
            }).limit(4);

            return {
                ...product.toObject(),
                relatedProducts
            };
        }

        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async getTopProducts(limit = 8) {
        return await Product.find({}).sort({ numVisits: -1 }).limit(limit);
    }

    async getBestSellingProducts(limit = 8) {
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
        const { name, description, price, priceBeforeDiscount, shippingPrice, category, colors, countInStock } = data;

        const product = new Product({
            name,
            description,
            price,
            priceBeforeDiscount,
            shippingPrice,
            category,
            colors,
            countInStock
        });

        return await product.save();
    }

    async updateProduct(id, data) {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

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
        }

        // Use findByIdAndUpdate to handle updates more gracefully, especially with legacy data
        const updatedProduct = await Product.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });

        return updatedProduct;
    }

    async deleteProduct(id) {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

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
