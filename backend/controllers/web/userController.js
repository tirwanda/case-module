const User = require('../../models/UserModel.js');
const ErrorHandler = require('../../utils/ErrorHandler.js');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors.js');
const sendToken = require('../../utils/jwtToken.js');

// Register user
exports.createUser = catchAsyncErrors(async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		let user = await User.findOne({ email });
		if (user) {
			return res
				.status(400)
				.json({ success: false, message: 'User already exists' });
		}

		user = await User.create({
			name,
			email,
			password,
			avatar: null,
		});

		sendToken(user, 201, res);
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ErrorHandler('Please enter the email & password', 400));
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(
			new ErrorHandler('User is not find with this email & password', 401)
		);
	}
	const isPasswordMatched = await user.comparePassword(password);

	if (!isPasswordMatched) {
		return next(new ErrorHandler('Email or Password is Incorrect', 401));
	}

	sendToken(user, 201, res);
});

//  Log out user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true,
		sameSite: 'none',
		secure: true,
	});

	res.status(200).json({
		success: true,
		message: 'Log out success',
	});
});

//  Get user Details
exports.userDetails = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		user,
	});
});

exports.getUserById = catchAsyncErrors(async (req, res, next) => {
	try {
		const user = await User.findById(req.params.userId);

		if (!user) {
			return next(new ErrorHandler('User not found', 404));
		}

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
	try {
		const users = await User.find(
			{},
			{ _id: 1, name: 1, email: 1, avatar: 1, title: 1 }
		);

		res.status(200).json({
			success: true,
			users,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.updateUserInfo = catchAsyncErrors(async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);

		user.name = req.body.name;
		user.bio = req.body.bio;
		user.title = req.body.title;
		user.email = req.body.email;

		await user.save();

		res.status(201).json({
			success: true,
			responseStatus: 201,
			user,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.updateUserAvatar = catchAsyncErrors(async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);
		user.avatar = req.body.avatar;

		await user.save();

		res.status(201).json({
			success: true,
			user,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});

exports.changePassword = catchAsyncErrors(async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);

		const isPasswordMatched = await user.comparePassword(
			req.body.oldPassword
		);

		if (!isPasswordMatched) {
			return res.status(400).json({
				success: false,
				message: 'Your Old Password Is Incorrect',
			});
		} else {
			user.password = req.body.newPassword;
			await user.save();
			res.status(201).json({
				success: true,
				user,
				responseStatus: 201,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});
