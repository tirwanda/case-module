const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
	{
		reporterNRP: {
			type: String,
			required: [true, 'Please enter reporter NRP'],
		},
		reporterName: {
			type: String,
			required: [true, 'Please enter reporter name'],
		},
		reporterDivision: {
			type: String,
			default: '',
		},
		reporterDepartment: {
			type: String,
			default: '',
		},
		organizationUnit: {
			type: String,
			default: '',
		},
		incidentPicture: [
			{
				name: {
					type: String,
					default: '',
				},
				url: {
					type: String,
					default: '',
				},
			},
		],
		descriptions: {
			type: String,
			required: [true, 'Please enter incident description'],
		},
		category: {
			type: String,
			required: [true, 'Please enter incident category'],
		},
		plant: {
			type: String,
			required: [true, 'Please enter plant'],
		},
		location: {
			type: String,
			required: [true, 'Please enter location'],
		},
		incidentDate: {
			type: Number,
			required: [true, 'Please enter incident date'],
		},
		phone: {
			type: String,
			default: '',
		},
		reportSource: {
			type: String,
			default: 'Laporan User',
		},
		chronology: {
			type: String,
			default: '',
		},
		investigator: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
				default: null,
			},
		],
		reportVerivications: {
			type: mongoose.Types.ObjectId,
			ref: 'Report_Verivication',
			default: null,
		},
		status: {
			type: String,
			default: 'Created',
		},
		evidences: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Evidence',
				default: null,
			},
		],
		createdAt: { type: Number, default: Date.now },
		updatedAt: { type: Number, default: Date.now },
	},
	{ timestamps: true }
);

incidentSchema.pre('updateOne', function (next) {
	this.update({}, { $set: { updatedAt: Date.now() } });
	next();
});

module.exports = mongoose.model('Incident', incidentSchema);
