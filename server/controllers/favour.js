const { validationResult } = require('express-validator');
const { DIALOG } = require('../utils/constants');
const { getError } = require('../utils/error');
const mongoose = require('mongoose');
const Favour = require('../models/favour');
const FavourTypes = require('../models/favourstypes');

const catchValidationErrors = req => {
	// Catches any errors detected through express-validator middlware
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

		const favourDoc = await Favour.findById(favourId);

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

		// TODO: auth/permission handling (user is involved in these favours)

		const { userId } = req.body;

		const favourDocs = await Favour
			.find({ fromId: userId })
			.or([{ forId: userId }])
			.sort({ createdAt: 'asc' });

		res.status(200).send(favourDocs);
	} catch (error) {
		next(error);
	}
};

module.exports.create = async (req, res, next) => {
	try {
		catchValidationErrors(req);

		// TODO: upload handling - actImage

		const { fromId, fromName, forId, forName, act } = req.body;

		const favour = new Favour({
			fromId: new mongoose.Types.ObjectId(fromId),
			fromName,
			forId: new mongoose.Types.ObjectId(forId),
			forName,
			act
		});

		// Save new favour to db and add doc to response
		const favourDoc = await favour.save();
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

		const favourDoc = await Favour.findById(favourId);
		favourDoc.proof.repaidImage = repaidImage;
		favourDoc.repaid = true;

		// Save updated favour to db
		await favourDoc.save();
		res.status(204).end();
	} catch (error) {
		next(error);
	}
};

module.exports.delete = async (req, res, next) => {
	try {
		catchValidationErrors(req);

		// TODO: image file deletion handling (if we're doing this)

		const { favourId } = req.body;

		// Find and delete favour
		await Favour.findByIdAndDelete(favourId);

		res.status(204).end();
	} catch (error) {
		next(error);
	}
};

module.exports.getfavourtype = async (req, res, next)=>{
	try {
		const result = await FavourTypes.find();
		const favortypesname = result.map((item)=>{
			return item.favorname;
		});
		res.status(201).send({favortypesname});
	} catch (error) {
		next(error);
	}
};