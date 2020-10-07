const { validationResult } = require('express-validator');
const { DIALOG } = require('../utils/constants');
const { getError } = require('../utils/error');
const Favour = require('../models/favour');
// const mongoose = require('mongoose');
// const User = require('../models/user');
// const _ = require('lodash');

// Catches any errors detected through express-validator middlware
const catchValidationErrors = req => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		throw getError(422, validationErrors.errors[0].msg, DIALOG);
	}
};

module.exports.getById = async (req, res, next) => {
	try {
		catchValidationErrors(req);

		// TODO: auth/permission handling (user is involved in this favour)

		const { favourId } = req.params;
		const favourDoc = await Favour
			.findById(favourId)
			.populate('fromUser forUser', '_id firstName lastName profilePicture');

		if (!favourDoc) {
			throw getError(404, 'Favour not found', DIALOG);
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
		const favourDocs = await Favour
			.find().or([{ fromUser: userId }, { forUser: userId }])
			.populate('fromUser forUser', '_id firstName lastName profilePicture')
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

		// TODO: upload handling - actImage

		const { fromUser, forUser, act, actImage } = req.body;
		const favour = new Favour({
			fromUser: fromUser,
			forUser: forUser,
			act: act,
			proof: {
				actImage: actImage
			}
		});

		const favourDoc = await favour.save();

		// populate favour with user data and add to response
		await favourDoc
			.populate('fromUser forUser', '_id firstName lastName profilePicture')
			.execPopulate();

		res.status(201).send(favourDoc);
	} catch (error) {
		next(error);
	}
};

module.exports.repay = async (req, res, next) => {
	try {
		catchValidationErrors(req);

		// TODO: upload handling - repaidImage
		
		const { favourId, repaidImage } = req.body;
		const favour = await Favour.findById(favourId);

		favour.proof.repaidImage = repaidImage;
		favour.repaid = true;

		const favourDoc = await favour.save();

		await favourDoc
			.populate('fromUser forUser', '_id firstName lastName profilePicture')
			.execPopulate();

		res.status(200).send(favourDoc);
	} catch (error) {
		next(error);
	}
};

module.exports.delete = async (req, res, next) => {
	try {
		catchValidationErrors(req);

		// TODO: image file deletion handling (if we're doing this)

		const { favourId } = req.body;
		await Favour.findByIdAndDelete(favourId);

		res.status(204).end();
	} catch (error) {
		next(error);
	}
};

module.exports.getLeaderboard = async (req, res, next) => {
	try {
		const results = await Favour
			.aggregate()
			.group({
				_id: '$fromUser',
				count: { $sum: 1 }
			})
			.sort({ count: 'desc' })
			.exec();

		let rankings = await Favour
			.populate(results, {
				path: '_id',
				select: 'firstName lastName profilePicture',
				model: 'User'
			});

		rankings = rankings.map((e) => {
			return {
				userId: e._id._id,
				firstName: e._id.firstName,
				lastName: e._id.lastName,
				profilePicture: e._id.profilePicture,
				favourCount: e.count
			};
		});

		// // find distinct users
		// const userIds = await Favour.distinct("fromId");

		// // populate data with distinct users and their number of favours
		// data = [];

		// for (let i = 0; i < userIds.length; i++) {
		// 	const favoursCount = await Favour.countDocuments({
		// 		fromId: userIds[i]
		// 	});

		// 	const user = await User.findOne({
		// 		_id: new mongoose.Types.ObjectId(userIds[i])
		// 	});

		// 	dataObj = {};
		// 	dataObj.userId = userIds[i];
		// 	dataObj.firstName = user.firstName;
		// 	dataObj.lastName = user.lastName;
		// 	dataObj.profilePicture = user.profilePicture;
		// 	dataObj.favourCount = favoursCount;
		// 	data.push(dataObj);
		// }

		// // order by favour count descending and limit to top 15 for leaderboard output
		// data = _.orderBy(data, ['favourCount'], ['desc']);
		// data = data.slice(0, 15);

		res.status(200).json(rankings);
	} catch (error) {
		next(error);
	}
};
