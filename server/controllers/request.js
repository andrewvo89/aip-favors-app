const { validationResult, body } = require('express-validator');
const Request = require('../models/request');
const { DIALOG, CREATE, UPDATE, DELETE } = require('../utils/constants');
const { getError } = require('../utils/error');
const mongoose = require('mongoose');
const socket = require('../utils/socket');
const notificationController = require('./notification');
const favourController = require('./favour');
const User = require('../models/user');
const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Catches any errors detected through express-validator middlware
const catchValidationErrors = (req) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		throw getError(422, validationErrors.errors[0].msg, DIALOG);
	}
};

const getRequestForClient = (request) => {
	let completedBy = null;
	//Only get populated data for requests that have been completed
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
		task: request.task,
		rewards: request.rewards.map((reward) => ({
			fromUser: {
				userId: reward.fromUser._id,
				firstName: reward.fromUser.firstName,
				lastName: reward.fromUser.lastName,
				profilePicture: reward.fromUser.profilePicture
			},
			favourType: {
				favourTypeId: reward.favourType._id,
				name: reward.favourType.name
			},
			quantity: reward.quantity
		})),
		completed: request.completed,
		completedBy: completedBy,
		proof: request.proof
	};
};

module.exports.create = async (req, res, next) => {
	try {
		catchValidationErrors(req);
		const { task, favourType, quantity } = req.body;
		const { userId } = res.locals;
		const request = new Request({
			createdBy: new mongoose.Types.ObjectId(userId),
			task: task,
			rewards: [
				{
					fromUser: new mongoose.Types.ObjectId(userId),
					favourType: new mongoose.Types.ObjectId(favourType.favourTypeId),
					quantity: quantity
				}
			],
			complete: false,
			proof: ''
		});
		await request.save();
		await request
			.populate('createdBy', 'firstName lastName profilePicture')
			.populate('rewards.fromUser', 'firstName lastName profilePicture')
			.populate('rewards.favourType')
			.execPopulate();
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
					`${fromUser.fullName} added a new public request to "${request.task}"`
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
		catchValidationErrors(req);
		const { requestId, favourType, quantity } = req.body;
		const { userId } = res.locals;
		const request = await Request.findById(
			new mongoose.Types.ObjectId(requestId)
		)
			.populate('createdBy')
			.populate('rewards.fromUser')
			.populate('rewards.favourType');
		if (!request) {
			//If wrong requestId is sent from the client
			throw getError(404, 'Request does not exist', DIALOG);
		}
		const rewardExistsIndex = request.rewards.findIndex((reward) => {
			const favourTypeExists =
				reward.favourType._id.toString() === favourType.favourTypeId;
			const fromUserExists = reward.fromUser._id.toString() === userId;
			return favourTypeExists && fromUserExists;
		});
		if (rewardExistsIndex === -1) {
			//If the favour type does not already exist for this user
			request.rewards.push({
				fromUser: new mongoose.Types.ObjectId(userId),
				favourType: new mongoose.Types.ObjectId(favourType.favourTypeId),
				quantity: quantity
			});
		} else {
			//Favour type for this user already exists, just increment the quantity
			request.rewards[rewardExistsIndex].quantity += quantity;
		}
		await request.save();
		await request
			.populate('rewards.fromUser')
			.populate('rewards.favourType')
			.execPopulate();
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
					`${fromUser.fullName} added ${quantity}x ${favourType.name} as a reward for the request to "${request.task}"`
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
		catchValidationErrors(req);
		const { requestId, favourTypeId, fromUserId } = req.body;
		const { userId } = res.locals;
		const request = await Request.findById(
			new mongoose.Types.ObjectId(requestId)
		)
			.populate('createdBy', 'firstName lastName profilePicture')
			.populate('rewards.fromUser', 'firstName lastName profilePicture')
			.populate('rewards.favourType');
		if (!request) {
			//If wrong requestId is sent from the client
			throw getError(404, 'Request does not exist', DIALOG);
		}
		if (fromUserId !== res.locals.userId) {
			//If your userId does not match the userId of the reward being deleted (prevent deleting other people's rewards)
			throw getError(403, 'Unauthorized to delete reward', DIALOG);
		}
		const rewardIndex = request.rewards.findIndex((reward) => {
			const favourTypeExists =
				reward.favourType._id.toString() === favourTypeId;
			const fromUserExists = reward.fromUser._id.toString() === fromUserId;
			return favourTypeExists && fromUserExists;
		});
		if (rewardIndex === -1) {
			//If wrong favour type reference is sent from the client
			throw getError(404, 'Reward does not exist', DIALOG);
		}
		const deletedReward = request.rewards.splice(rewardIndex, 1)[0];
		if (request.rewards.length === 0) {
			//If no rewards are left, set completed flag to true to delete request
			await request.deleteOne();
			socket.get().emit('requests', {
				action: DELETE,
				request: request._id
			});
		} else {
			await request.save();
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
			let title = `${fromUser.fullName} removed ${deletedReward.quantity}x ${deletedReward.favourType.name} for the request to "${request.task}"`;
			if (request.rewards.length === 0) {
				title = `${fromUser.fullName} removed the request to "${request.task}"`;
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
		catchValidationErrors(req);
		const { requestId, fromUserId, favourTypeId, quantity } = req.body;
		const { userId } = res.locals;
		const request = await Request.findById(
			new mongoose.Types.ObjectId(requestId)
		)
			.populate('createdBy', 'firstName lastName profilePicture')
			.populate('rewards.fromUser', 'firstName lastName profilePicture')
			.populate('rewards.favourType');
		if (!request) {
			//If wrong requestId is sent from the client
			throw getError(404, 'Request does not exist', DIALOG);
		}
		if (fromUserId !== res.locals.userId) {
			//If your userId does not match the userId of the reward being deleted (prevent deleting other people's rewards)
			throw getError(403, 'Unauthorized to delete reward', DIALOG);
		}
		const rewardIndex = request.rewards.findIndex((reward) => {
			const favourTypeExists =
				reward.favourType._id.toString() === favourTypeId;
			const fromUserExists = reward.fromUser._id.toString() === fromUserId;
			return favourTypeExists && fromUserExists;
		});
		if (rewardIndex === -1) {
			//If wrong favour type reference is sent from the client
			throw getError(404, 'Reward does not exist', DIALOG);
		}
		const reward = request.rewards[rewardIndex];
		const prevQuantity = reward.quantity;
		reward.quantity = quantity;
		await request.save();
		socket.get().emit('requests', {
			action: UPDATE,
			request: getRequestForClient(request)
		});
		//Send a notification to all users about the udpated request
		const rewardUsers = request.rewards.map((reward) => reward.fromUser);
		//If the user that created the request is not offering a reward, add to list of users to notify as well
		const createdByUserExists = rewardUsers.find(
			(user) => user._id.toString() === request.createdBy._id.toString()
		);
		if (!createdByUserExists) {
			rewardUsers.push(request.createdBy);
		}
		const promises = [];
		//Execute all the notifications in parallel to save on time for function to finish
		for (const user of rewardUsers) {
			const action = prevQuantity < quantity ? 'added' : 'removed';
			promises.push(
				notificationController.create(
					userId,
					'/requests/view/all',
					user._id,
					`${reward.fromUser.firstName} ${reward.fromUser.lastName} ${action} a ${reward.favourType.name} for the request to "${request.task}"`
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
			.populate('rewards.favourType')
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
		const { requestId } = req.body;
		const imagePath = path.join(req.file.destination, `${uuidv4()}_400.jpg`);
		await sharp(req.file.path).jpeg().toFile(imagePath);
		const request = await Request.findById(
			new mongoose.Types.ObjectId(requestId)
		)
			.populate('createdBy', 'firstName lastName profilePicture')
			.populate('rewards.fromUser', 'firstName lastName profilePicture')
			.populate('rewards.favourType');
		if (!request) {
			//If wrong requestId is sent from the client
			throw getError(404, 'Request does not exist', DIALOG);
		}
		//Step 1. Close off the request
		//Remove any rewards that the user completing the task is offering (cannot rewards yourself favours)
		request.rewards = request.rewards.filter(
			(reward) => reward.fromUser._id.toString() !== userId
		);
		request.proof = imagePath;
		request.completed = true;
		request.completedBy = new mongoose.Types.ObjectId(userId);
		await request.save();
		await request
			.populate('completedBy', 'firstName lastName profilePicture')
			.execPopulate();
		//Step 2. Send through updated completed request back to the client for live updating
		socket.get().emit('requests', {
			action: UPDATE,
			request: getRequestForClient(request)
		});
		//Step 3. Send a notification to all users about the udpated request
		const rewardUsers = request.rewards.map((reward) => reward.fromUser);
		//If the user that created the request is not offering a reward, add to list of users to notify as well
		const createdByUserExists = rewardUsers.find(
			(user) => user._id.toString() === request.createdBy._id.toString()
		);
		if (!createdByUserExists) {
			rewardUsers.push(request.createdBy);
		}
		let promises = [];
		//Step 4. Execute all the notifications in parallel to save on time for function to finish
		for (const user of rewardUsers) {
			promises.push(
				notificationController.create(
					userId,
					'/requests/view/all',
					user._id,
					`${request.completedBy.firstName} ${request.completedBy.lastName} has completed the request to "${request.task}"`
				)
			);
		}
		//Step 5. Convert the rewards into favours owed to the user that completed the request
		for (const reward of request.rewards) {
			promises.push(
				favourController.createFavour(
					request.completedBy._id,
					reward.fromUser._id,
					request.proof,
					reward.favourType._id,
					reward.quantity,
					request.task
				)
			);
		}
		await Promise.all(promises);
		res.status(201).send();
	} catch (error) {
		next(error);
	}
};
