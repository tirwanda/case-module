const Witness = require('../../models/WitnessModel.js');
const Employee = require('../../models/EmployeeModel.js');
const Incident = require('../../models/IncidentModel.js');
const ErrorHandler = require('../../utils/ErrorHandler.js');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors.js');

exports.createWitness = catchAsyncErrors(async (req, res, next) => {
	try {
		const { type, name, KTP, picId, vendorName, incidentId, witnessNrp } =
			req.body;
		const employe = await Employee.findById(picId);
		const checkIncident = await Incident.findById(incidentId);

		if (!employe) {
			return next(new ErrorHandler('PIC Area is not exist', 401));
		}

		if (!checkIncident) {
			return next(new ErrorHandler('Incident is not exist', 401));
		}

		const createWitness = await Witness.create({
			type,
			name,
			KTP,
			witnessNrp,
			pic: employe,
			vendorName,
			incident: checkIncident,
		}).then((witness) => witness.populate('pic'));

		res.status(201).json({
			success: true,
			message: 'Witness created successfully',
			witness: createWitness,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getAllWitnesses = catchAsyncErrors(async (req, res, next) => {
	try {
		const witnesses = await Witness.find({}).populate('pic');

		res.status(200).json({
			success: true,
			count: witnesses.length,
			witnesses,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getWitnessById = catchAsyncErrors(async (req, res, next) => {
	try {
		const witnessId = req.params.witnessId;

		const witness = await Witness.findById(witnessId).populate('pic');
		if (!witness) {
			return next(new ErrorHandler('Witness not found', 404));
		}

		res.status(200).json({
			success: true,
			witness,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getWitnessByIncidentId = catchAsyncErrors(async (req, res, next) => {
	try {
		const incidentId = req.params.incidentId;

		const witnesses = await Witness.find({ incident: incidentId }).populate(
			'pic'
		);

		res.status(200).json({
			success: true,
			count: witnesses.length,
			witnesses,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.updateWitness = catchAsyncErrors(async (req, res, next) => {
	try {
		const witnessId = req.params.witnessId;
		const { type, name, KTP, picId, vendorName, witnessNrp } = req.body;

		const employe = await Employee.findById(picId);

		if (!employe) {
			return next(new ErrorHandler('PIC Area is not exist', 401));
		}

		const updateWitness = await Witness.findByIdAndUpdate(
			witnessId,
			{
				type,
				witnessNrp,
				name,
				KTP,
				pic: employe,
				vendorName,
			},
			{ new: true }
		).populate('pic');

		res.status(200).json({
			success: true,
			message: 'Witness updated successfully',
			witness: updateWitness,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.deleteWitnessById = catchAsyncErrors(async (req, res, next) => {
	try {
		const witnessId = req.params.witnessId;

		const witness = await Witness.findById(witnessId);

		if (!witness) {
			return next(new ErrorHandler('Witness not found', 404));
		}

		await witness.deleteOne();
		res.status(200).json({
			success: true,
			message: 'Witness deleted successfully',
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});
