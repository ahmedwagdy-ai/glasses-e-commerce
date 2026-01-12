const express = require('express');
const router = express.Router();
const { updateSettings } = require('../../controllers/settingController');
const { protect, admin } = require('../../middleware/authMiddleware');

router.put('/', protect, admin, updateSettings);

module.exports = router;
