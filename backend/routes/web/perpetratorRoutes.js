const express = require('express');
const {
	createPerpetrator,
	getPerpetratorById,
	getPerpetratorsByIncidentId,
	deletePerpetratorById,
	getAllPerpetrators,
} = require('../../controllers/web/perpetratorController');
const { isAuthenticatedUser } = require('../../middleware/auth');
const router = express.Router();

router
	.route('/create-perpetrator')
	.post(isAuthenticatedUser, createPerpetrator);
router
	.route('/perpetrator/:perpetratorId')
	.get(isAuthenticatedUser, getPerpetratorById);
router.route('/perpetrators').get(isAuthenticatedUser, getAllPerpetrators);
router
	.route('/perpetrators/:incidentId')
	.get(isAuthenticatedUser, getPerpetratorsByIncidentId);
router
	.route('/perpetrator/:perpetratorId')
	.delete(isAuthenticatedUser, deletePerpetratorById);

module.exports = router;
