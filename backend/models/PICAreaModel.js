const mongoose = require('mongoose');

const PICAreaSchema = new mongoose.Schema(
	{
		employee: {
			type: mongoose.Types.ObjectId,
			ref: 'Employe',
			required: [true, 'Employee not found'],
		},
		beginEffectiveDate: { type: Number, default: Date.now },
		endEffectiveDate: { type: Number, default: Date.now },
		createdAt: { type: Number, default: Date.now },
		updatedAt: { type: Number, default: Date.now },
	},
	{ timestamps: true }
);

PICAreaSchema.pre('updateOne', function (next) {
	this.update({}, { $set: { updatedAt: Date.now() } });
	next();
});

module.exports = mongoose.model('PIC_Area', PICAreaSchema);
