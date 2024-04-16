const Incident = require('../../models/IncidentModel');
const ErrorHandler = require('../../utils/ErrorHandler');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

exports.getAnalyticsDataByPlant = catchAsyncErrors(async (req, res, next) => {
	try {
		const { plant } = req.body;

		const category = await Incident.aggregate([
			{
				$match: { plant: plant },
			},
			{
				$group: {
					_id: {
						plant: '$plant',
						category: '$category',
					},
					totalIncidents: { $sum: 1 },
				},
			},
			{
				$group: {
					_id: '$_id.plant',
					totalByPlant: { $sum: '$totalIncidents' },
					details: {
						$push: {
							category: '$_id.category',
							count: '$totalIncidents',
						},
					},
				},
			},
			{
				$unwind: '$details',
			},
			{
				$project: {
					_id: 0,
					plant: '$_id',
					name: '$details.category',
					count: '$details.count',
					percentage: {
						$multiply: [
							{ $divide: ['$details.count', '$totalByPlant'] },
							100,
						],
					},
				},
			},
			{
				$sort: {
					plant: 1,
					category: 1,
				},
			},
		]);

		const status = await Incident.aggregate([
			{
				$match: { plant: plant },
			},
			{
				$group: {
					_id: {
						plant: '$plant',
						status: '$status',
					},
					totalIncidents: { $sum: 1 },
				},
			},
			{
				$group: {
					_id: '$_id.plant',
					totalByPlant: { $sum: '$totalIncidents' },
					details: {
						$push: {
							status: '$_id.status',
							count: '$totalIncidents',
						},
					},
				},
			},
			{
				$unwind: '$details',
			},
			{
				$project: {
					_id: 0,
					plant: '$_id',
					name: '$details.status',
					count: '$details.count',
					percentage: {
						$multiply: [
							{ $divide: ['$details.count', '$totalByPlant'] },
							100,
						],
					},
				},
			},
			{
				$sort: {
					plant: 1,
					status: 1,
				},
			},
		]);

		const reportSource = await Incident.aggregate([
			{
				$match: { plant: plant },
			},
			{
				$group: {
					_id: {
						plant: '$plant',
						reportSource: '$reportSource',
					},
					totalIncidents: { $sum: 1 },
				},
			},
			{
				$group: {
					_id: '$_id.plant',
					totalByPlant: { $sum: '$totalIncidents' },
					details: {
						$push: {
							reportSource: '$_id.reportSource',
							count: '$totalIncidents',
						},
					},
				},
			},
			{
				$unwind: '$details',
			},
			{
				$project: {
					_id: 0,
					plant: '$_id',
					name: '$details.reportSource',
					count: '$details.count',
					percentage: {
						$multiply: [
							{ $divide: ['$details.count', '$totalByPlant'] },
							100,
						],
					},
				},
			},
			{
				$sort: {
					plant: 1,
					reportSource: 1,
				},
			},
		]);

		let totalIncident = 0;
		category.forEach((element) => {
			totalIncident += element.count;
		});

		res.status(200).json({
			success: true,
			count: totalIncident,
			status,
			category,
			reportSource,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 401));
	}
});
