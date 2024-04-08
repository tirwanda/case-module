const express = require('express');
const {
	createStatementLetter,
	getStatementLetters,
	getStatementLetterById,
	getStatementLettersByIncidentId,
	updateStatementLetter,
	deleteStatementLetter,
} = require('../../controllers/web/statementLetterController');

const { isAuthenticatedUser } = require('../../middleware/auth');
const router = express.Router();

router
	.route('/create-statement-letter')
	.post(isAuthenticatedUser, createStatementLetter);
router
	.route('/statement-letters')
	.get(isAuthenticatedUser, getStatementLetters);
router
	.route('/statement-letter/:statementLetterId')
	.get(isAuthenticatedUser, getStatementLetterById);
router
	.route('/statement-letter-incident/:incidentId')
	.get(isAuthenticatedUser, getStatementLettersByIncidentId);
router
	.route('/statement-letter/:statementLetterId')
	.put(isAuthenticatedUser, updateStatementLetter);
router
	.route('/statement-letter/:statementLetterId')
	.delete(isAuthenticatedUser, deleteStatementLetter);

module.exports = router;
