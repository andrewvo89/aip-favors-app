const { validationResult } = require('express-validator');
const Request = require('../models/request');
const { DIALOG } = require('../utils/constants');
const { getError } = require('../utils/error');

module.exports.create = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			throw getError(422, validationErrors.errors[0].msg, DIALOG);
		}
		const { rewards, act } = req.body;
		const request = new Request({
			createdBy: res.locals.userId,
			act: act,
			rewards: [
				{
					favourType: rewards[0].favourType,
					quantity: rewards[0].quantity,
					createdBy: res.locals.userId
				}
			],
			complete: false
		});
		await request.save();
		res.status(201).send();
	} catch (error) {
		next(error);
	}
};

module.exports.getRequests = async (req, res, next) => {
	try {
		const { filter } = req.body;
		const requestDocs = await Request.find(filter)
			.populate('createdBy')
			.populate('rewards.createdBy')
			.sort({ createdAt: 'desc' });
		const requests = requestDocs.map((request) => {
			return {
				requestId: request._id,
				createdBy: {
					firstName: request.createdBy.firstName,
					lastName: request.createdBy.lastName,
					profilePicture: request.createdBy.profilePicture
				},
				createdAt: request.createdAt,
				act: request.act,
				rewards: request.rewards.map((reward) => ({
					rewardId: reward._id,
					favourType: reward.favourType,
					quantity: reward.quantity,
					createdBy: {
						firstName: reward.createdBy.firstName,
						lastName: reward.createdBy.lastName,
						profilePicture: reward.createdBy.profilePicture
					}
				})),
				complete: request.complete
			};
		});
		res.status(200).json({ requests: requests });
	} catch (error) {
		next(error);
	}
};
