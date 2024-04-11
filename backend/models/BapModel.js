const mongoose = require('mongoose');

const BapSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			default: 'Internal AHM',
		},
		name: {
			type: String,
			required: [true, 'Please enter name of summons destination'],
		},
		nrp: {
			type: String,
			default: '',
		},
		nik: {
			type: String,
			required: [true, 'Please enter NRP'],
		},
		placeOfBirth: {
			type: String,
			required: [true, 'Please enter place of birth'],
		},
		dateOfBirth: {
			type: String,
			required: [true, 'Please enter date of birth'],
		},
		religion: {
			type: String,
			required: [true, 'Please enter religion'],
		},
		address: {
			type: String,
			required: [true, 'Please enter address'],
		},
		idVendor: {
			type: String,
			default: '',
		},
		vendorName: {
			type: String,
			default: '',
		},
		pic: {
			type: mongoose.Types.ObjectId,
			ref: 'Employe',
			required: [true, 'Employee not found'],
		},
		checker: {
			type: mongoose.Types.ObjectId,
			ref: 'Employe',
			required: [true, 'Employee not found'],
		},
		interviewDate: {
			type: Number,
			required: [true, 'Please enter invitation date'],
			default: Date.now,
		},
		location: {
			type: String,
			required: [true, 'Please enter location'],
		},
		purposes: {
			type: String,
			required: [true, 'Please enter purpose'],
		},
		incident: {
			type: mongoose.Types.ObjectId,
			ref: 'Incident',
			required: [true, 'Incident not found'],
		},
		status: {
			type: String,
			default: 'Created',
		},
		attachment: {
			type: String,
			default: '',
		},
		attachmentName: {
			type: String,
			default: '',
		},
		createdAt: { type: Number, default: Date.now },
		updatedAt: { type: Number, default: Date.now },
	},
	{ timestamps: true }
);

BapSchema.pre('updateOne', function (next) {
	this.update({}, { $set: { updatedAt: Date.now() } });
	next();
});

module.exports = mongoose.model('BAP', BapSchema);
