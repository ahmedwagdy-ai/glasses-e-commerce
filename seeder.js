const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./src/data/users');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');
const Category = require('./src/models/Category');

const categoriesData = require('./src/data/categories');
const productsData = require('./src/data/products');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

const importData = async () => {
    try {
        // Clear existing data
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        // Import Users
        for (const user of users) {
            await User.create(user);
        }

        // Import Categories
        const createdCategories = await Category.insertMany(categoriesData);
        const categoryId = createdCategories[0]._id; // Assign all products to the first category for simplicity

        // Import Products
        const sampleProducts = productsData.map(product => {
            return { ...product, category: categoryId };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
