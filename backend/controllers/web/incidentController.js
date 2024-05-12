const Incident = require('../../models/IncidentModel');
const User = require('../../models/UserModel');
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
		const incident = await Incident.findById(req.params.id)
			.populate('reportVerivications')
			.populate('evidences')
			.populate('investigator');

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

exports.addInvestigator = catchAsyncErrors(async (req, res, next) => {
	try {
		const { userId, incidentId } = req.params;

		const incident = await Incident.findById(incidentId);
		const user = await User.findById(userId);

		if (!incident) {
			return next(new ErrorHandler('Incident not found', 404));
		}

		if (!user) {
			return next(new ErrorHandler('User not found', 404));
		}

		await Incident.findByIdAndUpdate(incidentId, {
			$push: { investigator: userId },
		});

		res.status(200).json({
			success: true,
			message: `${user.name} added as investigator`,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.deleteInvestigator = catchAsyncErrors(async (req, res, next) => {
	try {
		const { userId, incidentId } = req.params;

		const incident = await Incident.findById(incidentId);
		const user = await User.findById(userId);

		if (!incident) {
			return next(new ErrorHandler('Incident not found', 404));
		}

		if (!user) {
			return next(new ErrorHandler('User not found', 404));
		}

		await Incident.findByIdAndUpdate(incidentId, {
			$pull: { investigator: userId },
		});

		res.status(200).json({
			success: true,
			message: `${user.name} removed as investigator`,
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

exports.deleteIncidentPicture = async (req, res, next) => {
	try {
		const { incidentId, pictureId } = req.params;

		// Temukan insiden berdasarkan ID
		const incident = await Incident.findById(incidentId);

		if (!incident) {
			return res
				.status(404)
				.json({ success: false, message: 'Incident not found' });
		}

		let pictureIndex = -1;
		incident.incidentPicture.forEach((picture, index) => {
			var stringId = picture._id.toString();
			if (stringId === pictureId) {
				pictureIndex = index;
			}
		});

		if (pictureIndex === -1) {
			return res
				.status(404)
				.json({ success: false, message: 'Picture not found' });
		}

		// Hapus gambar dari array incidentPicture
		incident.incidentPicture.splice(pictureIndex, 1);

		// Simpan perubahan
		await incident.save();

		return res.status(200).json({
			success: true,
			message: 'Picture deleted successfully',
			incident,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
};

exports.updateIncidentByKaru = catchAsyncErrors(async (req, res, next) => {
	try {
		const incident = await Incident.findById(req.params.id);

		if (!incident) {
			return next(new ErrorHandler('Incident not found', 404));
		}

		const { chronology, reportVerivications, evidences, incidentPicture } =
			req.body;

		if (incidentPicture) {
			incidentPicture.forEach((picture) => {
				incident.incidentPicture.push(picture);
			});
		}

		if (chronology) {
			incident.chronology = chronology;
		}

		if (reportVerivications) {
			if (reportVerivications._id) {
				const verivifation =
					await ReportVerivications.findByIdAndUpdate(
						reportVerivications._id,
						reportVerivications,
						{
							new: true,
							runValidators: true,
							useFindAndModify: false,
						}
					);
				incident.reportVerivications = verivifation;
			} else {
				const verivifation = await ReportVerivications.create(
					reportVerivications
				);
				incident.reportVerivications = verivifation;
			}
		}

		if (evidences) {
			const evidenceList = await Promise.all(
				evidences.map(async (evidence) => {
					const newEvidence = await Evidence.create(evidence);
					return newEvidence;
				})
			);
			incident.evidences.push(...evidenceList);
		}
		await incident.save();
		await incident.populate('evidences');

		res.status(200).json({
			success: true,
			message: 'Incident updated successfully',
			incident,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.deleteEvidence = catchAsyncErrors(async (req, res, next) => {
	try {
		const { incidentId, evidenceId } = req.params;

		// Temukan insiden berdasarkan ID
		const incident = await Incident.findById(incidentId).populate(
			'evidences'
		);

		if (!incident) {
			return res
				.status(404)
				.json({ success: false, message: 'Incident not found' });
		}

		// Temukan bukti berdasarkan ID
		const evidence = await Evidence.findById(evidenceId);

		if (!evidence) {
			return res
				.status(404)
				.json({ success: false, message: 'Evidence not found' });
		}

		// Hapus bukti dari array evidences
		incident.evidences = incident.evidences.filter(
			(evidence) => evidence._id.toString() !== evidenceId
		);

		// Hapus bukti dari database
		await evidence.deleteOne();

		// Simpan perubahan
		await incident.save();

		return res.status(200).json({
			success: true,
			message: 'Evidence deleted successfully',
			incident,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});
