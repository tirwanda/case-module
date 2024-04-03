const CallingLetter = require('../../models/CallingLetterModel');
const Employee = require('../../models/EmployeeModel');
const Incident = require('../../models/IncidentModel');
const ErrorHandler = require('../../utils/ErrorHandler');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

exports.createCallingLetter = catchAsyncErrors(async (req, res, next) => {
	try {
		const {
			type,
			name,
			nrp,
			picId,
			callerId,
			invitationDate,
			location,
			reason,
			purposes,
			incidentId,
			vendorName,
			attachment,
			attachmentName,
		} = req.body;
		const employe = await Employee.findById(picId);
		const caller = await Employee.findById(callerId);
		const checkIncident = await Incident.findById(incidentId);

		if (!employe) {
			return next(new ErrorHandler('PIC Area is not exist', 401));
		}

		if (!caller) {
			return next(new ErrorHandler('Caller is not exist', 401));
		}

		if (!checkIncident) {
			return next(new ErrorHandler('Incident is not exist', 401));
		}

		const createCallingLetter = await CallingLetter.create({
			type,
			name,
			pic: employe,
			caller: caller,
			invitationDate,
			location,
			reason,
			purposes,
			incident: checkIncident,
			vendorName,
			nrp,
			attachment,
			attachmentName,
		}).then((callingLetter) => callingLetter.populate('pic'));

		res.status(201).json({
			success: true,
			message: 'Calling Letter created successfully',
			callingLetter: createCallingLetter,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getAllCallingLetters = catchAsyncErrors(async (req, res, next) => {
	try {
		const callingLetters = await CallingLetter.find({})
			.populate('pic')
			.populate('caller');

		res.status(200).json({
			success: true,
			count: callingLetters.length,
			callingLetters,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getCallingLetterById = catchAsyncErrors(async (req, res, next) => {
	try {
		const callingLetterId = req.params.callingLetterId;

		const callingLetter = await CallingLetter.findById(callingLetterId)
			.populate('pic')
			.populate('caller');
		if (!callingLetter) {
			return next(new ErrorHandler('Calling Letter not found', 404));
		}

		res.status(200).json({
			success: true,
			callingLetter,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getCallingLetterByIncidentId = catchAsyncErrors(
	async (req, res, next) => {
		try {
			const incidentId = req.params.incidentId;

			const callingLetters = await CallingLetter.find({
				incident: incidentId,
			})
				.populate('pic')
				.populate('caller');

			res.status(200).json({
				success: true,
				count: callingLetters.length,
				callingLetters,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 401));
		}
	}
);

exports.updateCallingLetter = catchAsyncErrors(async (req, res, next) => {
	try {
		const callingLetterId = req.params.callingLetterId;
		const {
			type,
			name,
			picId,
			callerId,
			invitationDate,
			location,
			reason,
			purposes,
			status,
			vendorName,
			nrp,
			attachment,
			attachmentName,
		} = req.body;

		const callingLetter = await CallingLetter.findById(callingLetterId);
		const employe = await Employee.findById(picId);
		const caller = await Employee.findById(callerId);

		if (!callingLetter) {
			return next(new ErrorHandler('Calling Letter not found', 404));
		}

		if (!employe) {
			return next(new ErrorHandler('PIC Area is not exist', 401));
		}

		if (!caller) {
			return next(new ErrorHandler('Caller is not exist', 401));
		}

		callingLetter.type = type;
		callingLetter.name = name;
		callingLetter.pic = employe;
		callingLetter.caller = caller;
		callingLetter.invitationDate = invitationDate;
		callingLetter.location = location;
		callingLetter.reason = reason;
		callingLetter.purposes = purposes;
		callingLetter.status = status;
		callingLetter.vendorName = vendorName;
		callingLetter.nrp = nrp;
		callingLetter.attachment = attachment;
		callingLetter.attachmentName = attachmentName;

		await callingLetter.save();

		res.status(200).json({
			success: true,
			message: 'Calling Letter is updated',
			callingLetter,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.deleteCallingLetterById = catchAsyncErrors(async (req, res, next) => {
	try {
		const callingLetterId = req.params.callingLetterId;

		const callingLetter = await CallingLetter.findById(callingLetterId);

		if (!callingLetter) {
			return next(new ErrorHandler('Calling Letter not found', 404));
		}

		await callingLetter.deleteOne();
		res.status(200).json({
			success: true,
			message: 'Calling Letter deleted successfully',
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});
