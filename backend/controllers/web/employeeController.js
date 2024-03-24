const Employee = require('../../models/EmployeeModel.js');
const PICArea = require('../../models/PICAreaModel.js');
const ErrorHandler = require('../../utils/ErrorHandler.js');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors.js');

exports.createEmployee = catchAsyncErrors(async (req, res, next) => {
	try {
		const {
			plant,
			name,
			nrp,
			jabatan,
			phone,
			email,
			company,
			department,
			division,
			effectiveDate,
			endEffectiveDate,
		} = req.body;

		let checkEmployee = await Employee.findOne({ nrp });
		if (checkEmployee) {
			return res
				.status(400)
				.json({ success: false, message: 'Employee already exists' });
		}

		const createEmployee = await Employee.create({
			plant,
			name,
			nrp,
			jabatan,
			phone,
			email,
			company,
			department,
			division,
			effectiveDate,
			endEffectiveDate,
		});

		res.status(201).json({
			success: true,
			message: 'Employee created successfully',
			employee: createEmployee,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

exports.getAllEmployes = catchAsyncErrors(async (req, res, next) => {
	try {
		const employes = await Employee.find(
			{},
			{
				plant: 1,
				name: 1,
				nrp: 1,
				jabatan: 1,
				phone: 1,
				email: 1,
				status: 1,
				company: 1,
				department: 1,
				division: 1,
				effectiveDate: 1,
				endEffectiveDate: 1,
			}
		);

		res.status(200).json({
			success: true,
			employes: employes,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getEmployeeById = catchAsyncErrors(async (req, res, next) => {
	try {
		const employee = await Employee.findById(req.params.employeeId);

		if (!employee) {
			return next(new ErrorHandler('Employee not found', 404));
		}

		res.status(200).json({
			success: true,
			employee: employee,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.updateEmployee = catchAsyncErrors(async (req, res, next) => {
	try {
		const checkEmployee = await Employee.findById(req.params.employeeId);

		if (!checkEmployee) {
			return next(new ErrorHandler('Employee not found', 404));
		}

		checkEmployee.plant = req.body.plant;
		checkEmployee.name = req.body.name;
		checkEmployee.nrp = req.body.nrp;
		checkEmployee.jabatan = req.body.jabatan;
		checkEmployee.phone = req.body.phone;
		checkEmployee.email = req.body.email;
		checkEmployee.status = req.body.status;
		checkEmployee.department = req.body.department;
		checkEmployee.division = req.body.division;
		checkEmployee.company = req.body.company;
		checkEmployee.effectiveDate = req.body.effectiveDate;
		checkEmployee.endEffectiveDate = req.body.endEffectiveDate;

		await checkEmployee.save();

		res.status(201).json({
			success: true,
			responseStatus: 201,
			employee: checkEmployee,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.deleteEmployeeById = catchAsyncErrors(async (req, res, next) => {
	try {
		const checkEmployee = await Employee.findById(req.params.employeeId);
		const checkPICArea = await PICArea.findOne({
			employee: req.params.employeeId,
		});

		if (!checkEmployee) {
			return next(new ErrorHandler('Employee not found', 404));
		}

		if (checkPICArea) {
			await checkPICArea.deleteOne();
		}

		await checkEmployee.deleteOne();

		res.status(200).json({
			success: true,
			message: 'Employee deleted successfully',
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});
