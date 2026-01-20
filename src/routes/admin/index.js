const express = require('express');
const router = express.Router();

const adminProductRoutes = require('./adminProductRoutes');
const adminCategoryRoutes = require('./adminCategoryRoutes');
const adminUserRoutes = require('./adminUserRoutes');
const adminOrderRoutes = require('./adminOrderRoutes');
const adminSettingRoutes = require('./adminSettingRoutes');

router.use('/products', adminProductRoutes);
router.use('/categories', adminCategoryRoutes);
router.use('/users', adminUserRoutes);
router.use('/orders', adminOrderRoutes);
router.use('/settings', adminSettingRoutes);
router.use('/dashboard', require('./adminDashboardRoutes'));

module.exports = router;
