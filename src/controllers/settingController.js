const asyncHandler = require('../middleware/asyncHandler');
const settingService = require('../services/settingService');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
    const settings = await settingService.getSettings();
    res.json({
        success: true,
        message: 'Settings retrieved successfully',
        data: settings
    });
});

// @desc    Update site settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
    const settings = await settingService.updateSettings(req.body);
    res.json({
        success: true,
        message: 'Settings updated successfully',
        data: settings
    });
});

module.exports = {
    getSettings,
    updateSettings
};
