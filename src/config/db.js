const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check if we have an active connection
        if (mongoose.connections[0].readyState) {
            return;
        }

        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is NOT defined in environment variables');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Do not exit process in serverless environment
        throw error;
    }
};

module.exports = connectDB;
