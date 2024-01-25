const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},
		image: {
			public_id: {
				type: String,
			},
			url: {
				type: String,
			},
		},
		user: {
			type: Object,
		},
		likesNumber: {
			type: Number,
			default: 0,
		},
		likes: [
			{
				userName: {
					type: String,
				},
				userId: {
					type: String,
				},
				userAvatar: {
					type: String,
				},
			},
		],
		comment: [
			{
				user: {
					type: mongoose.Types.ObjectId,
					ref: 'User',
				},
				content: {
					type: String,
				},
				likes: [
					{
						userName: {
							type: String,
						},
						userId: {
							type: String,
						},
						userAvatar: {
							type: String,
						},
					},
				],
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);
