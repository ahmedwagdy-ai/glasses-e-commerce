const Category = require('../models/Category');
const cloudinaryService = require('../services/cloudinaryService');

class CategoryService {
    async getAllCategories() {
        return await Category.find({});
    }

    async getCategoryById(id) {
        const category = await Category.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    async createCategory(data) {
        return await Category.create(data);
    }

    async updateCategory(id, data) {
        const category = await this.getCategoryById(id);

        if (data.image && category.image && category.image.public_id) {
            if (data.image.public_id !== category.image.public_id) {
                await cloudinaryService.deleteImage(category.image.public_id);
            }
        }

        category.name = data.name || category.name;
        category.description = data.description || category.description;
        category.image = data.image || category.image;

        return await category.save();
    }

    async deleteCategory(id) {
        const category = await this.getCategoryById(id);

        if (category.image && category.image.public_id) {
            await cloudinaryService.deleteImage(category.image.public_id);
        }

        await category.deleteOne();
        return { message: 'Category removed' };
    }
}

module.exports = new CategoryService();
