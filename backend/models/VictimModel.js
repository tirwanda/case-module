const mongoose = require('mongoose');

const victimSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			default: 'Karyawan AHM',
		},
		name: {
			type: String,
			required: [true, 'Please enter victim Name'],
		},
		KTP: {
			type: String,
			default: '',
		},
		victimNrp: {
			type: String,
			default: '',
		},
		pic: {
			type: mongoose.Types.ObjectId,
			ref: 'Employe',
			required: [true, 'Employee not found'],
		},
		idVendor: {
			type: String,
			default: '',
		},
		vendorName: {
			type: String,
			default: '',
		},
		incident: {
			type: mongoose.Types.ObjectId,
			ref: 'Incident',
			required: [true, 'Incident not found'],
		},
		createdAt: { type: Number, default: Date.now },
		updatedAt: { type: Number, default: Date.now },
	},
	{ timestamps: true }
);

victimSchema.pre('updateOne', function (next) {
	this.update({}, { $set: { updatedAt: Date.now() } });
	next();
});

module.exports = mongoose.model('Victim', victimSchema);
