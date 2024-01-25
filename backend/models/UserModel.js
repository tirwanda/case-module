const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter your Name'],
		},
		email: {
			type: String,
			required: [true, 'Please enter your email'],
		},
		password: {
			type: String,
			required: [true, 'Please enter your password'],
		},
		avatar: {
			type: String,
			default: '',
		},
		role: { type: String, default: 'ROLE_USER' },
		title: { type: String, default: '' },
		bio: { type: String, default: '' },
		saveArticles: [{ type: mongoose.Types.ObjectId, ref: 'Article' }],
		createdAt: { type: Number, default: Date.now },
		updatedAt: { type: Number, default: Date.now },
	},
	{ timestamps: true }
);

// Hash password
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
});

userSchema.pre('updateOne', function (next) {
	this.update({}, { $set: { updatedAt: Date.now() } });
	next();
});

// jwt token
userSchema.methods.getJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES,
	});
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
