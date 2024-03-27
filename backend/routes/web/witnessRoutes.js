const express = require('express');
const {
	createWitness,
	getAllWitnesses,
	getWitnessById,
	getWitnessByIncidentId,
	deleteWitnessById,
} = require('../../controllers/web/witnessController');
const { isAuthenticatedUser } = require('../../middleware/auth');
const router = express.Router();

router.route('/create-witness').post(isAuthenticatedUser, createWitness);
router.route('/witnesses').get(isAuthenticatedUser, getAllWitnesses);
router.route('/witness/:witnessId').get(isAuthenticatedUser, getWitnessById);
router
	.route('/witnesses/:incidentId')
	.get(isAuthenticatedUser, getWitnessByIncidentId);
router
	.route('/witness/:witnessId')
	.delete(isAuthenticatedUser, deleteWitnessById);
router
	.route('/witness/:witnessId')
	.delete(isAuthenticatedUser, deleteWitnessById);

module.exports = router;
