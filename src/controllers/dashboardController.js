const asyncHandler = require('../middleware/asyncHandler');
const dashboardService = require('../services/dashboardService');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
const getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await dashboardService.getStatistics();
    res.json({
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: stats
    });
});

module.exports = {
    getDashboardStats
};
