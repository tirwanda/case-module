const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
	{
		plant: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			required: [true, 'Please enter your Name'],
		},
		nrp: {
			type: String,
			required: [true, 'Please enter your NRP'],
			unique: true,
		},
		jabatan: {
			type: String,
			default: 'Staff',
		},
		phone: {
			type: String,
			default: '',
		},
		email: {
			type: String,
			default: '',
		},
		status: {
			type: String,
			default: 'Active',
		},
		effectiveDate: { type: Number, default: Date.now },
		endEffectiveDate: { type: Number, default: Date.now },
		avatar: {
			type: String,
			default: '',
		},
		createdAt: { type: Number, default: Date.now },
		updatedAt: { type: Number, default: Date.now },
	},
	{ timestamps: true }
);

// Update Data
employeeSchema.pre('updateOne', function (next) {
	this.update({}, { $set: { updatedAt: Date.now() } });
	next();
});

module.exports = mongoose.model('Employe', employeeSchema);
