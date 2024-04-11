const Bap = require('../../models/BapModel');
const Employee = require('../../models/EmployeeModel');
const Incident = require('../../models/IncidentModel');
const ErrorHandler = require('../../utils/ErrorHandler');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

exports.createBap = catchAsyncErrors(async (req, res, next) => {
	try {
		const {
			type,
			name,
			nrp,
			nik,
			placeOfBirth,
			dateOfBirth,
			religion,
			address,
			vendorName,
			picId,
			checkerId,
			interviewDate,
			location,
			purposes,
			incidentId,
			attachment,
			attachmentName,
		} = req.body;

		const pic = await Employee.findById(picId);
		const checker = await Employee.findById(checkerId);
		const incident = await Incident.findById(incidentId);

		if (!pic) {
			return next(new ErrorHandler('PIC Area is not exist', 401));
		}
		if (!checker) {
			return next(new ErrorHandler('Checker is not exist', 401));
		}

		if (!incident) {
			return next(new ErrorHandler('Incident is not exist', 401));
		}

		const createBap = await Bap.create({
			type,
			name,
			nrp,
			nik,
			placeOfBirth,
			dateOfBirth,
			religion,
			address,
			pic,
			checker,
			interviewDate,
			location,
			purposes,
			incident,
			vendorName,
			attachment,
			attachmentName,
		}).then((bap) => bap.populate('pic'));

		res.status(201).json({
			success: true,
			message: 'BAP created successfully',
			bap: createBap,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getAllBap = catchAsyncErrors(async (req, res, next) => {
	try {
		const bap = await Bap.find().populate('pic').populate('checker');
		res.status(200).json({
			success: true,
			bap,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getBapById = catchAsyncErrors(async (req, res, next) => {
	try {
		const bap = await Bap.findById(req.params.BapId)
			.populate('pic')
			.populate('checker');
		if (!bap) {
			return next(new ErrorHandler('BAP not found', 404));
		}
		res.status(200).json({
			success: true,
			bap,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getBapByIncidentId = catchAsyncErrors(async (req, res, next) => {
	try {
		const bap = await Bap.find({ incident: req.params.incidentId })
			.populate('pic')
			.populate('checker');
		if (!bap) {
			return next(new ErrorHandler('BAP not found', 404));
		}
		res.status(200).json({
			success: true,
			bap,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.updateBap = catchAsyncErrors(async (req, res, next) => {
	try {
		const {
			type,
			name,
			nrp,
			nik,
			placeOfBirth,
			dateOfBirth,
			religion,
			address,
			vendorName,
			picId,
			checkerId,
			interviewDate,
			location,
			purposes,
			incidentId,
			attachment,
			attachmentName,
		} = req.body;

		const bap = await Bap.findById(req.params.bapId);
		const pic = await Employee.findById(picId);
		const checker = await Employee.findById(checkerId);
		const incident = await Incident.findById(incidentId);

		if (!bap) {
			return next(new ErrorHandler('BAP not found', 404));
		}
		if (!pic) {
			return next(new ErrorHandler('PIC Area is not exist', 401));
		}
		if (!checker) {
			return next(new ErrorHandler('Checker is not exist', 401));
		}
		if (!incident) {
			return next(new ErrorHandler('Incident is not exist', 401));
		}

		bap.type = type;
		bap.name = name;
		bap.nrp = nrp;
		bap.nik = nik;
		bap.placeOfBirth = placeOfBirth;
		bap.dateOfBirth = dateOfBirth;
		bap.religion = religion;
		bap.address = address;
		bap.pic = pic;
		bap.checker = checker;
		bap.interviewDate = interviewDate;
		bap.location = location;
		bap.purposes = purposes;
		bap.incident = incident;
		bap.vendorName = vendorName;
		bap.attachment = attachment;
		bap.attachmentName = attachmentName;

		await bap.save();

		res.status(200).json({
			success: true,
			message: 'BAP is updated',
			bap,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.deleteBapById = catchAsyncErrors(async (req, res, next) => {
	try {
		const bap = await Bap.findById(req.params.bapId);
		if (!bap) {
			return next(new ErrorHandler('BAP not found', 404));
		}
		await bap.deleteOne();
		res.status(200).json({
			success: true,
			message: 'BAP is deleted',
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});
