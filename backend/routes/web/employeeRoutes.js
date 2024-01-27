const express = require('express');
const {
	createEmployee,
	getAllEmployes,
	getEmployeeById,
	updateEmployee,
	deleteEmployeeById,
} = require('../../controllers/web/employeeController');

const { isAuthenticatedUser } = require('../../middleware/auth');
const router = express.Router();

router.route('/create-employee').post(isAuthenticatedUser, createEmployee);

router.route('/employes').get(isAuthenticatedUser, getAllEmployes);

router.route('/employee/:employeeId').get(isAuthenticatedUser, getEmployeeById);

router.route('/employee/:employeeId').put(isAuthenticatedUser, updateEmployee);

router
	.route('/employee/:employeeId')
	.delete(isAuthenticatedUser, deleteEmployeeById);

module.exports = router;
