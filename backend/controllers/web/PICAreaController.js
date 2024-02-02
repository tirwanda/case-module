const PICArea = require('../../models/PICAreaModel.js');
const Employee = require('../../models/EmployeeModel.js');
const ErrorHandler = require('../../utils/ErrorHandler.js');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors.js');

exports.createPICArea = catchAsyncErrors(async (req, res, next) => {
	try {
		const { employeeId, beginEffectiveDate, endEffectiveDate } = req.body;

		const checkEmploye = await Employee.findById(employeeId);

		if (!checkEmploye) {
			return next(new ErrorHandler('Employee is not exist', 401));
		}

		const existingPICArea = await PICArea.findOne({ employee: employeeId });

		if (existingPICArea) {
			return next(
				new ErrorHandler('Employee already exist in PIC Area', 401)
			);
		}

		const createPICArea = await PICArea.create({
			employee: checkEmploye,
			beginEffectiveDate,
			endEffectiveDate,
		});

		res.status(201).json({
			success: true,
			message: 'PIC Area created successfully',
			PICArea: createPICArea,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getAllPICArea = catchAsyncErrors(async (req, res, next) => {
	try {
		const PICAreas = await PICArea.find({}).populate('employee');

		res.status(200).json({
			success: true,
			count: PICAreas.length,
			PICAreas,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getPICAreaById = catchAsyncErrors(async (req, res, next) => {
	try {
		const PICAreaId = req.params.id;

		const checkPICArea = await PICArea.findById(PICAreaId).populate(
			'employee'
		);

		if (!checkPICArea) {
			return next(new ErrorHandler('PIC Area not found', 401));
		}

		res.status(200).json({
			success: true,
			PICArea: checkPICArea,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.updatePICArea = catchAsyncErrors(async (req, res, next) => {
	try {
		const checkPICArea = await PICArea.findById(req.params.PICAreaId);

		if (!checkPICArea) {
			return next(new ErrorHandler('PIC Area not found', 401));
		}

		checkPICArea.beginEffectiveDate = req.body.beginEffectiveDate;
		checkPICArea.endEffectiveDate = req.body.endEffectiveDate;

		checkPICArea.save();

		res.status(201).json({
			success: true,
			responseStatus: 201,
			PICArea: checkPICArea,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.deletePICAreaById = catchAsyncErrors(async (req, res, next) => {
	try {
		const checkPICArea = await PICArea.findById(req.params.PICAreaId);

		if (!checkPICArea) {
			return next(new ErrorHandler('PIC Area not found', 401));
		}

		await checkPICArea.deleteOne();

		res.status(200).json({
			success: true,
			message: 'PIC Area deleted successfully',
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});
