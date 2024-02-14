const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema(
	{
		evidenceName: {
			type: String,
			default: '',
		},
		attachment: {
			type: String,
			default: '',
		},
		createdAt: { type: Number, default: Date.now },
		updatedAt: { type: Number, default: Date.now },
	},
	{ timestamps: true }
);

// Update Data
evidenceSchema.pre('updateOne', function (next) {
	this.update({}, { $set: { updatedAt: Date.now() } });
	next();
});

module.exports = mongoose.model('Evidence', evidenceSchema);
