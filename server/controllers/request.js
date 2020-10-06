const { validationResult } = require('express-validator');
const Request = require('../models/request');
const { DIALOG, CREATE, UPDATE } = require('../utils/constants');
const { getError } = require('../utils/error');
const mongoose = require('mongoose');
const socket = require('../utils/socket');
const notificationController = require('./notification');

module.exports.create = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			throw getError(422, validationErrors.errors[0].msg, DIALOG);
		}
		const { act, favourType, quantity } = req.body;
		const request = new Request({
			createdBy: res.locals.userId,
			act: act,
			rewards: [
				{
					fromUser: res.locals.userId,
					favourTypes: [
						{
							favourType: favourType,
							quantity: quantity
						}
					]
				}
			],
			closed: false,
			proof: ''
		});
		await request.execPopulate('createdBy');
		await request.execPopulate('rewards.fromUser');
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
		const request = await Request.findById(
			new mongoose.Types.ObjectId(requestId)
		);
		const indexOfFromId = request.rewards.findIndex(
			(reward) => reward.fromUser.toString() === res.locals.userId
		);
		if (indexOfFromId !== -1) {
			//If a user record exist in .rewards, find if favour exists in user record
			const indexOfFavourType = request.rewards[
				indexOfFromId
			].favourTypes.findIndex((reward) => reward.favourType === favourType);
			if (indexOfFavourType !== -1) {
				//If a favour exists, add the quantity to existing quantity
				request.rewards[indexOfFromId].favourTypes[
					indexOfFavourType
				].quantity += quantity;
			} else {
				//If a favour does not exists, create a new favour record inside the user record
				request.rewards[indexOfFromId].favourTypes.push({
					favourType: favourType,
					quantity: quantity
				});
			}
		} else {
			//If a user record does not exist in .rewards, push new user record in
			request.rewards.push({
				fromUser: res.locals.userId,
				favourTypes: [
					{
						favourType: favourType,
						quantity: quantity
					}
				]
			});
		}
		await request.save();
		await request.execPopulate('createdBy');
		await request.execPopulate('rewards.fromUser');
		socket.get().emit('requests', {
			action: UPDATE,
			request: getRequestForClient(request)
		});
		//TEST START
		await notificationController.create(
			res.locals.userId,
			'/requests/view/all',
			res.locals.userId,
			'New Rewards Notification'
		);
		//TEST END
		res.status(201).send();
	} catch (error) {
		next(error);
	}
};

module.exports.deleteReward = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			throw getError(422, validationErrors.errors[0].msg, DIALOG);
		}
		const { requestId, rewardIndex, favourTypeIndex } = req.body;
		const request = await Request.findById(
			new mongoose.Types.ObjectId(requestId)
		);
		const fromUserId = request.rewards[rewardIndex].fromUser.toString();
		if (fromUserId !== res.locals.userId) {
			//If your userId does not match the userId of the reward being deleted (prevent deleting other people's rewards)
			throw getError(403, 'Unauthorized to delete reward', DIALOG);
		}
		request.rewards[rewardIndex].favourTypes.splice(favourTypeIndex, 1);
		if (request.rewards[rewardIndex].favourTypes.length === 0) {
			//If user has no more rewards, remove the user from rewards array
			request.rewards.splice(rewardIndex, 1);
		}
		if (request.rewards.length === 0) {
			//If no rewards are left, set closed flag to true to remove request from client list
			request.closed = true;
		}
		await request.save();
		await request.execPopulate('createdBy');
		await request.execPopulate('rewards.fromUser');
		socket.get().emit('requests', {
			action: UPDATE,
			request: getRequestForClient(request)
		});
		res.status(201).send();
	} catch (error) {
		next(error);
	}
};

module.exports.udpateRewardQuantity = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			throw getError(422, validationErrors.errors[0].msg, DIALOG);
		}
		const { requestId, quantity, rewardIndex, favourTypeIndex } = req.body;
		const request = await Request.findById(
			new mongoose.Types.ObjectId(requestId)
		);
		const fromUserId = request.rewards[rewardIndex].fromUser.toString();
		if (fromUserId !== res.locals.userId) {
			//If your userId does not match the userId of the reward being udpated (prevent deleting other people's rewards)
			throw getError(403, 'Unauthorized to update reward quantity', DIALOG);
		}
		request.rewards[rewardIndex].favourTypes[
			favourTypeIndex
		].quantity = quantity;
		await request.save();
		await request.execPopulate('createdBy');
		await request.execPopulate('rewards.fromUser');
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
			.populate('rewards.fromUser')
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
			fromUser: {
				userId: reward.fromUser._id,
				firstName: reward.fromUser.firstName,
				lastName: reward.fromUser.lastName,
				profilePicture: reward.fromUser.profilePicture
			},
			favourTypes: reward.favourTypes
		})),
		closed: request.closed,
		proof: request.proof
	};
};
