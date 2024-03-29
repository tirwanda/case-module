const express = require('express');
const {
	createIncident,
	getAllIncidents,
	updateIncident,
	getIncidentById,
	deleteIncident,
	updateIncidentByKaru,
	deleteIncidentPicture,
	deleteEvidence,
} = require('../../controllers/web/incidentController');

const { isAuthenticatedUser } = require('../../middleware/auth');
const router = express.Router();

router.route('/create-incident').post(isAuthenticatedUser, createIncident);

router.route('/incidents').get(isAuthenticatedUser, getAllIncidents);

router.route('/incident/:id').get(isAuthenticatedUser, getIncidentById);

router.route('/incident/:id').put(isAuthenticatedUser, updateIncident);

router.route('/incident/:id').delete(isAuthenticatedUser, deleteIncident);

router
	.route('/incident/update-by-karu/:id')
	.put(isAuthenticatedUser, updateIncidentByKaru);

router
	.route('/incident-picture/:incidentId/:pictureId')
	.delete(isAuthenticatedUser, deleteIncidentPicture);

router
	.route('/evidence/:incidentId/:evidenceId')
	.delete(isAuthenticatedUser, deleteEvidence);

module.exports = router;
