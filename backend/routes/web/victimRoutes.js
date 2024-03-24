const express = require('express');
const {
	createVictim,
	getAllVictims,
	getVictimById,
	getVictimByIncidentId,
	deleteVictimById,
} = require('../../controllers/web/victimController');

const { isAuthenticatedUser } = require('../../middleware/auth');
const router = express.Router();

router.route('/create-victim').post(isAuthenticatedUser, createVictim);
router.route('/victims').get(isAuthenticatedUser, getAllVictims);
router.route('/victim/:victimId').get(isAuthenticatedUser, getVictimById);
router
	.route('/victims/:incidentId')
	.get(isAuthenticatedUser, getVictimByIncidentId);
router.route('/victim/:victimId').delete(isAuthenticatedUser, deleteVictimById);

module.exports = router;
