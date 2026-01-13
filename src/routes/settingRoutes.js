const express = require('express');
const router = express.Router();
const { getSettings } = require('../controllers/settingController');

router.get('/', getSettings);

module.exports = router;
