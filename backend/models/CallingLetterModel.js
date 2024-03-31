const mongoose = require('mongoose');

const callingLetterSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			default: 'Internal AHM',
		},
		name: {
			type: String,
			required: [true, 'Please enter victim Name'],
		},
		nrp: {
			type: String,
			required: [true, 'Please enter NRP'],
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
		caller: {
			type: mongoose.Types.ObjectId,
			ref: 'Employe',
			required: [true, 'Employee not found'],
		},
		invitationDate: {
			type: Number,
			required: [true, 'Please enter invitation date'],
			default: Date.now,
		},
		location: {
			type: String,
			required: [true, 'Please enter location'],
		},
		reason: {
			type: String,
			required: [true, 'Please enter reason'],
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
		createdAt: { type: Number, default: Date.now },
		updatedAt: { type: Number, default: Date.now },
	},
	{ timestamps: true }
);

callingLetterSchema.pre('updateOne', function (next) {
	this.update({}, { $set: { updatedAt: Date.now() } });
	next();
});

module.exports = mongoose.model('Calling_Letter', callingLetterSchema);
