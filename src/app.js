const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(express.json());

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

app.use(cors());

app.get('/', (req, res) => {
    res.send('API is running...');
});

const adminRoutes = require('./routes/admin'); // Will resolve to /routes/admin/index.js
const settingRoutes = require('./routes/settingRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingRoutes);

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
const homeRoutes = require('./routes/homeRoutes');

app.use('/api/user/home', homeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', require('./routes/paymentRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
