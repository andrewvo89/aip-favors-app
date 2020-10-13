const { validationResult } = require('express-validator');
const Request = require('../models/request');
const { DIALOG, CREATE, UPDATE, DELETE } = require('../utils/constants');
const { getError } = require('../utils/error');
const mongoose = require('mongoose');
const socket = require('../utils/socket');
const notificationController = require('./notification');
const User = require('../models/user');
const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports.create = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			throw getError(422, validationErrors.errors[0].msg, DIALOG);
		}
		const { act, favourType, quantity } = req.body;
		const { userId } = res.locals;
		const request = new Request({
			createdBy: new mongoose.Types.ObjectId(userId),
			act: act,
			rewards: [
				{
					fromUser: new mongoose.Types.ObjectId(userId),
					favourTypes: [
						{
							favourType: favourType,
							quantity: quantity
						}
					]
				}
			],
			complete: false,
			proof: ''
		});
		await request.execPopulate(
			'createdBy',
			'firstName lastName profilePicture'
		);
		await request.execPopulate(
			'rewards.fromUser',
			'firstName lastName profilePicture'
		);
		await request.save();
		socket.get().emit('requests', {
			action: CREATE,
			request: getRequestForClient(request)
		});
		//Send a notification to all users about the new request
		const fromUser = await User.findById(new mongoose.Types.ObjectId(userId));
		const users = await User.find();
		const promises = [];
		//Execute all the notifications in parallel to save on time for function to finish
		for (const user of users) {
			promises.push(
				notificationController.create(
					userId,
					'/requests/view/all',
					user._id,
					`${fromUser.fullName} added a new public request to "${request.act}"`
				)
			);
		}
		await Promise.all(promises);
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
		const { userId } = res.locals;
		const request = await Request.findById(
			new mongoose.Types.ObjectId(requestId)
		);
		const indexOfFromId = request.rewards.findIndex(
			(reward) => reward.fromUser.toString() === userId
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
				fromUser: userId,
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
		//Send a notification to all users about the new reward
		const fromUser = await User.findById(new mongoose.Types.ObjectId(userId));
		const users = request.rewards.map((reward) => reward.fromUser);
		const createdByUserExists = users.find(
			(user) => user._id.toString() === request.createdBy._id.toString()
		);
		if (!createdByUserExists) {
			users.push(request.createdBy);
		}
		const promises = [];
		//Execute all the notifications in parallel to save on time for function to finish
		for (const user of users) {
			promises.push(
				notificationController.create(
					userId,
					'/requests/view/all',
					user._id,
					`${fromUser.fullName} added ${quantity}x ${favourType} as a reward for the request to "${request.act}"`
				)
			);
		}
		await Promise.all(promises);
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
		const { userId } = res.locals;
		const request = await Request.findById(
			new mongoose.Types.ObjectId(requestId)
		);
		const fromUserId = request.rewards[rewardIndex].fromUser.toString();
		if (fromUserId !== res.locals.userId) {
			//If your userId does not match the userId of the reward being deleted (prevent deleting other people's rewards)
			throw getError(403, 'Unauthorized to delete reward', DIALOG);
		}
		const deletedReward = request.rewards[rewardIndex].favourTypes.splice(
			favourTypeIndex,
			1
		)[0];
		if (request.rewards[rewardIndex].favourTypes.length === 0) {
			//If user has no more rewards, remove the user from rewards array
			request.rewards.splice(rewardIndex, 1);
		}
		if (request.rewards.length === 0) {
			//If no rewards are left, set completed flag to true to delete request
			await request.deleteOne();
			socket.get().emit('requests', {
				action: DELETE,
				request: request._id
			});
		} else {
			await request.save();
			await request.execPopulate(
				'completedBy',
				'firstName lastName profilePicture'
			);
			await request.execPopulate(
				'createdBy',
				'firstName lastName profilePicture'
			);
			await request.execPopulate(
				'rewards.fromUser',
				'firstName lastName profilePicture'
			);
			socket.get().emit('requests', {
				action: UPDATE,
				request: getRequestForClient(request)
			});
		}
		//Send a notification to all users about the new request
		const fromUser = await User.findById(new mongoose.Types.ObjectId(userId));
		const users = request.rewards.map((reward) => reward.fromUser);
		const createdByUserExists = users.find(
			(user) => user._id.toString() === request.createdBy._id.toString()
		);
		if (!createdByUserExists) {
			users.push(request.createdBy);
		}
		const promises = [];
		//Execute all the notifications in parallel to save on time for function to finish
		for (const user of users) {
			let title = `${fromUser.fullName} removed ${deletedReward.quantity}x ${deletedReward.favourType} for the request to "${request.act}"`;
			if (request.rewards.length === 0) {
				title = `${fromUser.fullName} removed the request to "${request.act}"`;
			}
			promises.push(
				notificationController.create(
					userId,
					'/requests/view/all',
					user._id,
					title
				)
			);
		}
		await Promise.all(promises);
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
		const { userId } = res.locals;
		const request = await Request.findById(
			new mongoose.Types.ObjectId(requestId)
		);
		const fromUserId = request.rewards[rewardIndex].fromUser.toString();
		if (fromUserId !== userId) {
			//If your userId does not match the userId of the reward being udpated (prevent deleting other people's rewards)
			throw getError(403, 'Unauthorized to update reward quantity', DIALOG);
		}
		const favourType =
			request.rewards[rewardIndex].favourTypes[favourTypeIndex];
		const prevQuantity = favourType.quantity;
		request.rewards[rewardIndex].favourTypes[
			favourTypeIndex
		].quantity = quantity;
		await request.save();
		await request.execPopulate(
			'createdBy',
			'firstName lastName profilePicture'
		);
		await request.execPopulate(
			'rewards.fromUser',
			'firstName lastName profilePicture'
		);
		socket.get().emit('requests', {
			action: UPDATE,
			request: getRequestForClient(request)
		});
		//Send a notification to all users about the udpated request
		const fromUser = await User.findById(new mongoose.Types.ObjectId(userId));
		const users = request.rewards.map((reward) => reward.fromUser);
		const createdByUserExists = users.find(
			(user) => user._id.toString() === request.createdBy._id.toString()
		);
		if (!createdByUserExists) {
			users.push(request.createdBy);
		}
		const promises = [];
		//Execute all the notifications in parallel to save on time for function to finish
		for (const user of users) {
			const action = prevQuantity < quantity ? 'added' : 'removed';
			promises.push(
				notificationController.create(
					userId,
					'/requests/view/all',
					user._id,
					`${fromUser.fullName} ${action} a ${favourType.favourType} for the request to "${request.act}"`
				)
			);
		}
		await Promise.all(promises);
		res.status(201).send();
	} catch (error) {
		next(error);
	}
};

module.exports.getRequests = async (req, res, next) => {
	try {
		const { filter } = req.body;
		const requestDocs = await Request.find(filter)
			.populate('completedBy', 'firstName lastName profilePicture')
			.populate('createdBy', 'firstName lastName profilePicture')
			.populate('rewards.fromUser', 'firstName lastName profilePicture')
			.sort({ createdAt: 'desc' });
		const requests = requestDocs.map((request) => {
			return getRequestForClient(request);
		});
		res.status(200).json({ requests: requests });
	} catch (error) {
		next(error);
	}
};

module.exports.complete = async (req, res, next) => {
	try {
		const { userId } = res.locals;
		const imagePath = path.join(req.file.destination, `${uuidv4()}_400.jpg`);
		await sharp(req.file.path).jpeg().toFile(imagePath);
		const request = await Request.findOne({
			_id: new mongoose.Types.ObjectId(req.body.requestId)
		});
		request.proof = imagePath;
		request.completed = true;
		request.completedBy = userId;
		await request.save();
		await request.execPopulate(
			'completedBy',
			'firstName lastName profilePicture'
		);
		await request.execPopulate(
			'createdBy',
			'firstName lastName profilePicture'
		);
		await request.execPopulate(
			'rewards.fromUser',
			'firstName lastName profilePicture'
		);
		socket.get().emit('requests', {
			action: UPDATE,
			request: getRequestForClient(request)
		});
		//Send a notification to all users about the request being completed
		const fromUser = await User.findById(new mongoose.Types.ObjectId(userId));
		const users = request.rewards.map((reward) => reward.fromUser);
		const createdByUserExists = users.find(
			(user) => user._id.toString() === request.createdBy._id.toString()
		);
		if (!createdByUserExists) {
			users.push(request.createdBy);
		}
		const promises = [];
		//Execute all the notifications in parallel to save on time for function to finish
		for (const user of users) {
			promises.push(
				notificationController.create(
					userId,
					'/requests/view/all',
					user._id,
					`${fromUser.fullName} has completed the request to "${request.act}"`
				)
			);
		}
		res.status(201).send();
	} catch (error) {
		next(error);
	}
};

const getRequestForClient = (request) => {
	let completedBy = null;
	//Only get populated data for requests that have been requested
	if (request.completedBy) {
		completedBy = {
			userId: request.completedBy._id,
			firstName: request.completedBy.firstName,
			lastName: request.completedBy.lastName,
			profilePicture: request.completedBy.profilePicture
		};
	}
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
		completed: request.completed,
		completedBy: completedBy,
		proof: request.proof
	};
};
