const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: [true, 'Please enter Lost Item type'],
		},
		descriptions: {
			type: String,
			required: [true, 'Please enter Lost Item description'],
		},
		category: {
			type: String,
			required: [true, 'Please enter Lost Item category'],
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
		itemName: {
			type: String,
			required: [true, 'Please enter item name'],
		},
		attachment: {
			type: String,
			default: '',
		},
		status: {
			type: String,
			default: 'Created',
		},
		lostItem: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Lost-Item',
			default: null,
		},

		createdAt: { type: Number, default: Date.now },
		updatedAt: { type: Number, default: Date.now },
	},
	{ timestamps: true }
);

foundItemSchema.pre('updateOne', function (next) {
	this.update({}, { $set: { updatedAt: Date.now() } });
	next();
});

module.exports = mongoose.model('Found-Item', foundItemSchema);
