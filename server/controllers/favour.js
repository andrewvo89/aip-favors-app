const { validationResult } = require('express-validator');
const { DIALOG } = require('../utils/constants');
const { getError } = require('../utils/error');
const Favour = require('../models/favour');
const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const socket = require('../utils/socket');
const User = require('../models/user');
const _ = require('lodash');
const partyDetection = require('../utils/party-detection');

// Catches any errors detected through express-validator middlware
const catchValidationErrors = (req) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		throw getError(422, validationErrors.errors[0].msg, DIALOG);
	}
};

module.exports.createFavour = async (
	fromUser,
	forUser,
	proof,
	favourType,
	quantity,
	requestTask
) => {
	const favour = new Favour({
		fromUser: fromUser,
		forUser: forUser,
		proof: proof,
		favourType: favourType,
		quantity: quantity,
		requestTask: requestTask
	});
	const favourDoc = await favour.save();
	//Populate favour with user data and add to response
	await favourDoc
		.populate('fromUser forUser', '_id firstName lastName profilePicture')
		.populate('favourType')
		.execPopulate();
	return favourDoc;
};

module.exports.getById = async (req, res, next) => {
	try {
		catchValidationErrors(req);

		const { favourId } = req.params;
		const favourDoc = await Favour.findById(favourId)
			.populate('fromUser forUser', '_id firstName lastName profilePicture')
			.populate('favourType');
		if (!favourDoc) {
			throw getError(404, 'Favour not found', DIALOG);
		}

		// ensure requesting user is involved in the favour
		const userId = res.locals.userId;
		const fromId = favourDoc.fromUser._id.toString();
		const forId = favourDoc.forUser._id.toString();
		if (userId !== fromId && userId !== forId) {
			throw getError(
				403,
				'You are not authorised to view this favour.',
				DIALOG
			);
		}

		res.status(200).send(favourDoc);
	} catch (error) {
		next(error);
	}
};

module.exports.getAll = async (req, res, next) => {
	try {
		catchValidationErrors(req);
		const userId = res.locals.userId;
		const favourDocs = await Favour.find()
			.or([{ fromUser: { $eq: userId } }, { forUser: { $eq: userId } }])
			.populate('fromUser forUser', '_id firstName lastName profilePicture')
			.populate('favourType')
			.sort({ repaid: 1, createdAt: 'desc' })
			.exec();
		res.status(200).send(favourDocs);
	} catch (error) {
		next(error);
	}
};

module.exports.create = async (req, res, next) => {
	try {
		catchValidationErrors(req);
		const { fromUser, forUser, proof, favourType, quantity } = req.body;
		const favourDoc = await this.createFavour(
			fromUser,
			forUser,
			proof,
			favourType,
			quantity
		);

		socket.get().emit('favour created', { userId: fromUser });

		res.status(201).send(favourDoc);

		// Detect favour cycles.
		await partyDetection(favourDoc.fromUser.id);
	} catch (error) {
		next(error);
	}
};

module.exports.repay = async (req, res, next) => {
	try {
		catchValidationErrors(req);
		const { favourId, repaidProof } = req.body;
		const favour = await Favour.findById(favourId);

		favour.repaidProof = repaidProof;
		favour.repaid = true;

		const favourDoc = await favour.save();

		await favourDoc
			.populate('fromUser forUser', '_id firstName lastName profilePicture')
			.populate('favourType')
			.execPopulate();

		res.status(200).send(favourDoc);
	} catch (error) {
		next(error);
	}
};

module.exports.delete = async (req, res, next) => {
	try {
		catchValidationErrors(req);

		const { favourId } = req.body;
		await Favour.findByIdAndDelete(favourId);

		res.status(204).end();
	} catch (error) {
		next(error);
	}
};

module.exports.getLeaderboard = async (req, res, next) => {
	try {
		// find distinct users
		const userIds = await Favour.distinct('fromUser');

		// populate data with distinct users and their number of favours
		let data = [];

		for (let i = 0; i < userIds.length; i++) {
			const favoursCount = await Favour.countDocuments({
				fromUser: userIds[i]
			});

			const user = await User.findOne({
				_id: new mongoose.Types.ObjectId(userIds[i])
			});

			let dataObj = {};
			dataObj.userId = userIds[i];
			dataObj.firstName = user.firstName;
			dataObj.lastName = user.lastName;
			dataObj.profilePicture = user.profilePicture;
			dataObj.favourCount = favoursCount;
			data.push(dataObj);
		}

		// order by favour count descending and limit to top 15 for leaderboard output
		data = _.orderBy(data, ['favourCount'], ['desc']);
		data = data.slice(0, 15);

		res.status(200).json(data);

		// const results = await Favour
		// 	.aggregate()
		// 	.group({
		// 		_id: '$fromUser',
		// 		count: { $sum: 1 }
		// 	})
		// 	.sort({ count: 'desc' })
		// 	.exec();

		// let rankings = await Favour
		// 	.populate(results, {
		// 		path: '_id',
		// 		select: 'firstName lastName profilePicture',
		// 		model: 'User'
		// 	});

		// rankings = rankings.map((e) => {
		// 	return {
		// 		userId: e._id._id,
		// 		firstName: e._id.firstName,
		// 		lastName: e._id.lastName,
		// 		profilePicture: e._id.profilePicture,
		// 		favourCount: e.count
		// 	};
		// });

		// res.status(200).json(rankings);
	} catch (error) {
		next(error);
	}
};

module.exports.uploadImage = async (req, res, next) => {
	try {
		const imagePath = path.join(req.file.destination, `${uuidv4()}_400.jpg`);

		// save image to jpeg file
		await sharp(req.file.path).jpeg().toFile(imagePath);

		// return image url
		res.status(200).json(imagePath);
	} catch (error) {
		next(error);
	}
};
