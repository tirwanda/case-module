const Perpetrator = require('../../models/PerpetratorModel.js');
const Employee = require('../../models/EmployeeModel.js');
const Incident = require('../../models/IncidentModel.js');
const ErrorHandler = require('../../utils/ErrorHandler.js');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors.js');

exports.createPerpetrator = catchAsyncErrors(async (req, res, next) => {
	try {
		const {
			type,
			name,
			KTP,
			ktpAddress,
			domicile,
			picId,
			perpetratorNrp,
			vendorName,
			incidentId,
		} = req.body;
		const employe = await Employee.findById(picId);
		const checkIncident = await Incident.findById(incidentId);

		if (!employe) {
			return next(new ErrorHandler('PIC Area is not exist', 401));
		}

		if (!checkIncident) {
			return next(new ErrorHandler('Incident is not exist', 401));
		}

		const createPerpetrator = await Perpetrator.create({
			type,
			name,
			KTP,
			ktpAddress,
			domicile,
			perpetratorNrp,
			pic: employe,
			vendorName,
			incident: checkIncident,
		}).then((perpetrator) => perpetrator.populate('pic'));

		res.status(201).json({
			success: true,
			message: 'Perpetrator created successfully',
			perpetrator: createPerpetrator,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getAllPerpetrators = catchAsyncErrors(async (req, res, next) => {
	try {
		const perpetrators = await Perpetrator.find({}).populate('pic');

		res.status(200).json({
			success: true,
			count: perpetrators.length,
			perpetrators,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getPerpetratorById = catchAsyncErrors(async (req, res, next) => {
	try {
		const perpetratorId = req.params.perpetratorId;

		const perpetrator = await Perpetrator.findById(perpetratorId).populate(
			'pic'
		);
		if (!perpetrator) {
			return next(new ErrorHandler('Perpetrator not found', 404));
		}

		res.status(200).json({
			success: true,
			perpetrator,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getPerpetratorsByIncidentId = catchAsyncErrors(
	async (req, res, next) => {
		try {
			const incidentId = req.params.incidentId;

			const perpetrators = await Perpetrator.find({
				incident: incidentId,
			}).populate('pic');

			res.status(200).json({
				success: true,
				count: perpetrators.length,
				perpetrators,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 401));
		}
	}
);

exports.updatePerpetratorById = catchAsyncErrors(async (req, res, next) => {
	try {
		const perpetratorId = req.params.perpetratorId;
		const {
			type,
			name,
			KTP,
			ktpAddress,
			domicile,
			incidentId,
			picId,
			perpetratorNrp,
			vendorName,
		} = req.body;

		const perpetrator = await Perpetrator.findById(perpetratorId);
		const employe = await Employee.findById(picId);
		const checkIncident = await Incident.findById(incidentId);

		if (!perpetrator) {
			return next(new ErrorHandler('Perpetrator not found', 404));
		}
		if (!employe) {
			return next(new ErrorHandler('PIC Area is not exist', 401));
		}
		if (!checkIncident) {
			return next(new ErrorHandler('Incident is not exist', 401));
		}

		perpetrator.type = type;
		perpetrator.name = name;
		perpetrator.KTP = KTP;
		perpetrator.ktpAddress = ktpAddress;
		perpetrator.domicile = domicile;
		perpetrator.pic = employe;
		perpetrator.perpetratorNrp = perpetratorNrp;
		perpetrator.vendorName = vendorName;

		await perpetrator.save();

		res.status(200).json({
			success: true,
			message: 'Perpetrator updated successfully',
			perpetrator,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.deletePerpetratorById = catchAsyncErrors(async (req, res, next) => {
	try {
		const perpetratorId = req.params.perpetratorId;

		const perpetrator = await Perpetrator.findById(perpetratorId);

		if (!perpetrator) {
			return next(new ErrorHandler('Perpetrator not found', 404));
		}

		await perpetrator.deleteOne();

		res.status(200).json({
			success: true,
			message: 'Perpetrator deleted successfully',
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});
