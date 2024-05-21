const express = require('express');
const {
	createPICArea,
	getAllPICArea,
	getPICAreaById,
	updatePICArea,
	deletePICAreaById,
	findEmployeesNotInPICArea,
	searchPICArea,
} = require('../../controllers/web/PICAreaController');

const { isAuthenticatedUser } = require('../../middleware/auth');
const router = express.Router();

router.route('/create-pic-area').post(isAuthenticatedUser, createPICArea);

router.route('/pic-area/search').post(isAuthenticatedUser, searchPICArea);

router.route('/pic-areas').get(isAuthenticatedUser, getAllPICArea);

router
	.route('/pic-area/employe-not-in-pic-area')
	.get(isAuthenticatedUser, findEmployeesNotInPICArea);

router.route('/pic-area/:id').get(isAuthenticatedUser, getPICAreaById);

router.route('/pic-area/:PICAreaId').put(isAuthenticatedUser, updatePICArea);

router
	.route('/pic-area/:PICAreaId')
	.delete(isAuthenticatedUser, deletePICAreaById);

module.exports = router;
