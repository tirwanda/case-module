const express = require('express');
const {
	createUser,
	loginUser,
	logoutUser,
	userDetails,
	updateUserInfo,
	updateUserAvatar,
	changePassword,
	getUserById,
	getAllUsers,
} = require('../../controllers/web/user');
const { isAuthenticatedUser } = require('../../middleware/auth');
const router = express.Router();

router.route('/registration').post(createUser);

router.route('/signin').post(loginUser);

router.route('/logout').get(logoutUser);

router.route('/me').get(isAuthenticatedUser, userDetails);

router.route('/user/:userId').get(isAuthenticatedUser, getUserById);

router.route('/users').get(isAuthenticatedUser, getAllUsers);

router.route('/update-profile').put(isAuthenticatedUser, updateUserInfo);

router.route('/change-password').put(isAuthenticatedUser, changePassword);

router.route('/update-avatar').put(isAuthenticatedUser, updateUserAvatar);

module.exports = router;
