const express = require('express');
const {
	createCallingLetter,
	getAllCallingLetters,
	getCallingLetterById,
	getCallingLetterByIncidentId,
	updateCallingLetter,
	deleteCallingLetterById,
} = require('../../controllers/web/callingLetterController');

const { isAuthenticatedUser } = require('../../middleware/auth');
const router = express.Router();

router
	.route('/create-calling-letter')
	.post(isAuthenticatedUser, createCallingLetter);
router.route('/calling-letters').get(isAuthenticatedUser, getAllCallingLetters);
router
	.route('/calling-letter/:callingLetterId')
	.get(isAuthenticatedUser, getCallingLetterById);
router
	.route('/calling-letter/incident/:incidentId')
	.get(isAuthenticatedUser, getCallingLetterByIncidentId);
router
	.route('/calling-letter/:callingLetterId')
	.put(isAuthenticatedUser, updateCallingLetter);
router
	.route('/calling-letter/:callingLetterId')
	.delete(isAuthenticatedUser, deleteCallingLetterById);

module.exports = router;
