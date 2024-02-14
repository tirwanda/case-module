const mongoose = require('mongoose');

const reportVerivicationsSchema = new mongoose.Schema(
	{
		responsiblePIC: {
			type: String,
			default: '',
		},
		path: [
			{
				type: String,
				default: '',
			},
		],
		securityDevice: [{ type: String, default: '' }],
		guard: [
			{
				type: String,
				default: '',
			},
		],
		workActivities: [
			{
				type: String,
				default: '',
			},
		],
		isPatrolRoute: {
			type: Boolean,
			default: false,
		},
		lastPatrolDate: {
			type: Number,
			default: 0,
		},
		lastPerson: [
			{
				type: String,
				default: '',
			},
		],
		sameIncident: [
			{
				type: String,
				default: '',
			},
		],
		damageAssets: [
			{
				type: String,
				default: '',
			},
		],
		totalLoss: {
			type: Number,
			default: 0,
		},
		detailCondition: {
			type: String,
			default: '',
		},
		tkpPicture: {
			type: String,
			default: '',
		},
		suspectVehicle: {
			type: String,
			default: '',
		},
		etc: [
			{
				type: String,
				default: '',
			},
		],
		createdAt: { type: Number, default: Date.now },
		updatedAt: { type: Number, default: Date.now },
	},
	{ timestamps: true }
);

// Update Data
reportVerivicationsSchema.pre('updateOne', function (next) {
	this.update({}, { $set: { updatedAt: Date.now() } });
	next();
});

module.exports = mongoose.model(
	'Report_Verivication',
	reportVerivicationsSchema
);
