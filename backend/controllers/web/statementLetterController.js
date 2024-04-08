const StatementLetter = require('../../models/StatementLetterModel');
const Employee = require('../../models/EmployeeModel');
const Incident = require('../../models/IncidentModel');
const ErrorHandler = require('../../utils/ErrorHandler');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

exports.createStatementLetter = catchAsyncErrors(async (req, res, next) => {
	try {
		const {
			type,
			name,
			nrp,
			picId,
			incidentId,
			vendorName,
			attachment,
			attachmentName,
		} = req.body;

		const employe = await Employee.findById(picId);
		const checkIncident = await Incident.findById(incidentId);

		if (!employe) {
			return next(new ErrorHandler('PIC Area is not exist', 401));
		}
		if (!checkIncident) {
			return next(new ErrorHandler('Incident is not exist', 401));
		}

		const createStatementLetter = await StatementLetter.create({
			type,
			name,
			pic: employe,
			incident: checkIncident,
			vendorName,
			nrp,
			attachment,
			attachmentName,
		}).then((statementLetter) => statementLetter.populate('pic'));

		res.status(201).json({
			success: true,
			message: 'Statement Letter created successfully',
			statementLetter: createStatementLetter,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getStatementLetters = catchAsyncErrors(async (req, res, next) => {
	const statementLetters = await StatementLetter.find()
		.populate('pic')
		.populate('incident')
		.sort({ createdAt: -1 });

	res.status(200).json({
		success: true,
		statementLetters,
	});
});

exports.getStatementLetterById = catchAsyncErrors(async (req, res, next) => {
	try {
		const statementLetter = await StatementLetter.findById(
			req.params.statementLetterId
		).populate('pic');

		if (!statementLetter) {
			return next(new ErrorHandler('Statement Letter not found', 404));
		}

		res.status(200).json({
			success: true,
			statementLetter,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getStatementLettersByIncidentId = catchAsyncErrors(
	async (req, res, next) => {
		try {
			const incidentId = req.params.incidentId;

			const statementLetters = await StatementLetter.find({
				incident: incidentId,
			}).populate('pic');

			res.status(200).json({
				success: true,
				count: statementLetters.length,
				statementLetters,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 401));
		}
	}
);

exports.updateStatementLetter = catchAsyncErrors(async (req, res, next) => {
	try {
		const statementLetterId = req.params.statementLetterId;
		const {
			type,
			name,
			nrp,
			picId,
			incidentId,
			vendorName,
			attachment,
			attachmentName,
		} = req.body;

		const employe = await Employee.findById(picId);
		const checkIncident = await Incident.findById(incidentId);

		if (!employe) {
			return next(new ErrorHandler('PIC Area is not exist', 401));
		}
		if (!checkIncident) {
			return next(new ErrorHandler('Incident is not exist', 401));
		}

		const statementLetter = await StatementLetter.findById(
			statementLetterId
		);

		if (!statementLetter) {
			return next(new ErrorHandler('Statement Letter not found', 404));
		}

		statementLetter.type = type;
		statementLetter.name = name;
		statementLetter.nrp = nrp;
		statementLetter.pic = employe;
		statementLetter.incident = checkIncident;
		statementLetter.vendorName = vendorName;
		statementLetter.attachment = attachment;
		statementLetter.attachmentName = attachmentName;

		await statementLetter.save();

		res.status(200).json({
			success: true,
			message: 'Statement Letter is updated',
			statementLetter,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.deleteStatementLetter = catchAsyncErrors(async (req, res, next) => {
	try {
		const statementLetterId = req.params.statementLetterId;

		const statementLetter = await StatementLetter.findById(
			statementLetterId
		);
		await statementLetter.deleteOne();

		res.status(200).json({
			success: true,
			message: 'Statement Letter is deleted',
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});
