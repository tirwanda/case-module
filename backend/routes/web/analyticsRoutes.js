const express = require('express');
const {
	getAnalyticsDataByPlant,
} = require('../../controllers/web/analyticsController');

const { isAuthenticatedUser } = require('../../middleware/auth');
const router = express.Router();

router
	.route('/analytics-data-by-plant')
	.post(isAuthenticatedUser, getAnalyticsDataByPlant);

module.exports = router;
