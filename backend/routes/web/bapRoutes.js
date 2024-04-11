const express = require('express');
const {
	createBap,
	getAllBap,
	getBapById,
	getBapByIncidentId,
	updateBap,
	deleteBapById,
} = require('../../controllers/web/bapController');

const { isAuthenticatedUser } = require('../../middleware/auth');
const router = express.Router();

router.route('/create-bap').post(isAuthenticatedUser, createBap);
router.route('/baps').get(isAuthenticatedUser, getAllBap);
router.route('/bap/:bapId').get(isAuthenticatedUser, getBapById);
router
	.route('/bap/incident/:incidentId')
	.get(isAuthenticatedUser, getBapByIncidentId);
router.route('/bap/:bapId').put(isAuthenticatedUser, updateBap);
router.route('/bap/:bapId').delete(isAuthenticatedUser, deleteBapById);

module.exports = router;
