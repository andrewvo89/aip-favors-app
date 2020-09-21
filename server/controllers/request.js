const { validationResult } = require('express-validator');
const Request = require('../models/request');
const { DIALOG, CREATE, UPDATE } = require('../utils/constants');
const { getError } = require('../utils/error');
const mongoose = require('mongoose');
const socket = require('../utils/socket');

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
		await request.execPopulate('createdBy');
		await request.execPopulate('rewards.createdBy');
		await request.save();
		socket.get().emit('requests', {
			action: CREATE,
			request: getRequestForClient(request)
		});
		res.status(201).send();
	} catch (error) {
		next(error);
	}
};

module.exports.addReward = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			throw getError(422, validationErrors.errors[0].msg, DIALOG);
		}
		const { requestId, favourType, quantity } = req.body;
		const reward = {
			favourType: favourType,
			quantity: quantity,
			createdBy: res.locals.userId
		};
		const request = await Request.findByIdAndUpdate(
			new mongoose.Types.ObjectId(requestId),
			{
				$push: { rewards: reward }
			},
			{ new: true }
		);
		await request.execPopulate('createdBy');
		await request.execPopulate('rewards.createdBy');
		socket.get().emit('requests', {
			action: UPDATE,
			request: getRequestForClient(request)
		});
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
			return getRequestForClient(request);
		});
		res.status(200).json({ requests: requests });
	} catch (error) {
		next(error);
	}
};

const getRequestForClient = (request) => {
	return {
		requestId: request._id,
		createdBy: {
			userId: request.createdBy._id,
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
				userId: reward.createdBy._id,
				firstName: reward.createdBy.firstName,
				lastName: reward.createdBy.lastName,
				profilePicture: reward.createdBy.profilePicture
			}
		})),
		complete: request.complete
	};
};
