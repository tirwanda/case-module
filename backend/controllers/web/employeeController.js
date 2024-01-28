const Employee = require('../../models/EmployeeModel.js');
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
			effectiveDate,
			endEffectiveDate,
		} = req.body;

		let checkEmployee = await Employee.findOne({ nrp });
		if (checkEmployee) {
			return res
				.status(400)
				.json({ success: false, message: 'Employee already exists' });
		}

		createEmployee = await Employee.create({
			plant,
			name,
			nrp,
			jabatan,
			phone,
			email,
			effectiveDate,
			endEffectiveDate,
		});

		res.status(201).json({
			success: true,
			message: 'Employee created successfully',
			data: createEmployee,
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
				effectiveDate: 1,
				endEffectiveDate: 1,
			}
		);

		res.status(200).json({
			success: true,
			data: employes,
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
			data: employee,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.updateEmployee = catchAsyncErrors(async (req, res, next) => {
	try {
		const employee = await Employee.findById(req.params.employeeId);

		if (!employee) {
			return next(new ErrorHandler('Employee not found', 404));
		}

		employee.plant = req.body.plant;
		employee.name = req.body.name;
		employee.nrp = req.body.nrp;
		employee.jabatan = req.body.jabatan;
		employee.phone = req.body.phone;
		employee.email = req.body.email;
		employee.status = req.body.status;
		employee.effectiveDate = req.body.effectiveDate;
		employee.endEffectiveDate = req.body.endEffectiveDate;

		await employee.save();

		res.status(201).json({
			success: true,
			responseStatus: 201,
			data: employee,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.deleteEmployeeById = catchAsyncErrors(async (req, res, next) => {
	try {
		const employee = await Employee.findById(req.params.employeeId);

		if (!employee) {
			return next(new ErrorHandler('Employee not found', 404));
		}

		await employee.deleteOne();

		res.status(200).json({
			success: true,
			message: 'Employee deleted successfully',
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});
