const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check if we have an active connection
        if (mongoose.connections[0].readyState) {
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/glasses-shop');

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Do not exit process in serverless environment
        throw error;
    }
};

module.exports = connectDB;
