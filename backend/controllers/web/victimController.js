const Victim = require('../../models/VictimModel.js');
const PICArea = require('../../models/PICAreaModel.js');
const Employee = require('../../models/EmployeeModel.js');
const Incident = require('../../models/IncidentModel.js');
const ErrorHandler = require('../../utils/ErrorHandler.js');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors.js');

exports.createVictim = catchAsyncErrors(async (req, res, next) => {
	try {
		const { type, name, KTP, picId, victimNrp, incidentId, vendorName } =
			req.body;

		const employe = await Employee.findById(picId);
		const checkIncident = await Incident.findById(incidentId);

		if (!employe) {
			return next(new ErrorHandler('PIC Area is not exist', 401));
		}

		if (!checkIncident) {
			return next(new ErrorHandler('Incident is not exist', 401));
		}

		const createVictim = await Victim.create({
			type,
			name,
			KTP,
			victimNrp,
			pic: employe,
			incident: checkIncident,
			vendorName,
		}).then((victim) => victim.populate('pic'));

		res.status(201).json({
			success: true,
			message: 'Victim created successfully',
			victim: createVictim,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getAllVictims = catchAsyncErrors(async (req, res, next) => {
	try {
		const victims = await Victim.find({}).populate('pic');

		res.status(200).json({
			success: true,
			count: victims.length,
			victims,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getVictimById = catchAsyncErrors(async (req, res, next) => {
	try {
		const victimId = req.params.id;

		const checkVictim = await Victim.findById(victimId).populate('pic');

		if (!checkVictim) {
			return next(new ErrorHandler('Victim is not exist', 401));
		}

		res.status(200).json({
			success: true,
			victim: checkVictim,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getVictimByIncidentId = catchAsyncErrors(async (req, res, next) => {
	try {
		const incidentId = req.params.incidentId;

		const checkVictim = await Victim.find({
			incident: incidentId,
		}).populate('pic');

		if (!checkVictim) {
			res.status(200).json({
				success: true,
				victims: checkVictim,
			});
		}

		res.status(200).json({
			success: true,
			victims: checkVictim,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.deleteVictimById = catchAsyncErrors(async (req, res, next) => {
	try {
		const victimId = req.params.victimId;

		const checkVictim = await Victim.findById(victimId);

		if (!checkVictim) {
			return next(new ErrorHandler('Victim is not exist', 401));
		}

		await checkVictim.deleteOne();

		res.status(200).json({
			success: true,
			message: 'Victim deleted successfully',
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});
