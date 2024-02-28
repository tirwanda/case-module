const Incident = require('../../models/IncidentModel');
const ReportVerivications = require('../../models/ReportVerivicaationsModel');
const Evidence = require('../../models/EvidenceModel');
const ErrorHandler = require('../../utils/ErrorHandler');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

exports.createIncident = catchAsyncErrors(async (req, res, next) => {
	try {
		const {
			reporterName,
			reporterNRP,
			reporterDivision,
			reporterDepartment,
			organizationUnit,
			incidentPicture,
			descriptions,
			category,
			plant,
			location,
			incidentDate,
			phone,
			reportSource,
		} = req.body;

		const createIncident = await Incident.create({
			reporterName,
			reporterNRP,
			reporterDivision,
			reporterDepartment,
			organizationUnit,
			incidentPicture,
			descriptions,
			category,
			plant,
			location,
			incidentDate,
			phone,
			reportSource,
		});

		res.status(201).json({
			success: true,
			message: 'Incident created successfully',
			incident: createIncident,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getAllIncidents = catchAsyncErrors(async (req, res, next) => {
	try {
		const incidents = await Incident.find();

		res.status(200).json({
			success: true,
			count: incidents.length,
			incidents,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getIncidentById = catchAsyncErrors(async (req, res, next) => {
	try {
		const incident = await Incident.findById(req.params.id);

		if (!incident) {
			return next(new ErrorHandler('Incident not found', 404));
		}

		res.status(200).json({
			success: true,
			incident,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.updateIncident = catchAsyncErrors(async (req, res, next) => {
	try {
		const incident = await Incident.findById(req.params.id);

		if (!incident) {
			return next(new ErrorHandler('Incident not found', 404));
		}

		const {
			reporterName,
			reporterNRP,
			reporterDivision,
			reporterDepartment,
			organizationUnit,
			incidentPicture,
			descriptions,
			category,
			plant,
			location,
			incidentDate,
			phone,
			status,
			reportSource,
		} = req.body;

		const updateIncident = await Incident.findByIdAndUpdate(
			req.params.id,
			{
				reporterName,
				reporterNRP,
				reporterDivision,
				reporterDepartment,
				organizationUnit,
				incidentPicture,
				descriptions,
				category,
				plant,
				location,
				incidentDate,
				phone,
				reportSource,
				status,
			},
			{
				new: true,
				runValidators: true,
				useFindAndModify: false,
			}
		);

		res.status(200).json({
			success: true,
			message: 'Incident updated successfully',
			incident: updateIncident,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.deleteIncident = catchAsyncErrors(async (req, res, next) => {
	try {
		const incident = await Incident.findById(req.params.id);

		if (!incident) {
			return next(new ErrorHandler('Incident not found', 404));
		}

		if (!incident.reportVerivications) {
			incident.reportVerivications = null;
		}

		if (incident.evidences.length >= 1) {
			incident.evidences.forEach(async (evidence) => {
				await evidence.remove();
			});
			incident.evidences = [];
		}

		await incident.deleteOne();

		res.status(200).json({
			success: true,
			message: 'Incident deleted successfully',
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.updateIncidentByKaru = catchAsyncErrors(async (req, res, next) => {
	try {
		const incident = await Incident.findById(req.params.id);

		if (!incident) {
			return next(new ErrorHandler('Incident not found', 404));
		}

		const { chronology, reportVerivications, evidences } = req.body;

		if (chronology) {
			incident.chronology = chronology;
		}

		if (reportVerivications) {
			const verivifation = await ReportVerivications.create(
				reportVerivications
			);
			incident.reportVerivications = verivifation;
		}

		if (evidences) {
			const evidenceList = await Promise.all(
				evidences.map(async (evidence) => {
					const newEvidence = await Evidence.create(evidence);
					return newEvidence;
				})
			);
			incident.evidences = evidenceList;
		}
		incident.save();

		res.status(200).json({
			success: true,
			message: 'Incident updated successfully',
			incident,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});
