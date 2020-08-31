const { validationResult } = require('express-validator');
const { DIALOG } = require('../utils/constants');
const { getError } = require('../utils/error');
const mongoose = require('mongoose');
const Favour = require('../models/favour');


const catchValidationErrors = req => {
	// Catches any errors detected through express-validator middlware
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		throw getError(422, validationErrors.errors[0].msg, DIALOG);
	}
};

module.exports.create = async (req, res, next) => {
	try {
		catchValidationErrors(req);

		const { fromId, fromName, forId, forName, act } = req.body;

		const favour = new Favour({
			fromId: new mongoose.Types.ObjectId(fromId),
			fromName,
			forId: new mongoose.Types.ObjectId(forId),
			forName,
			act
		});

		// Save favour into the database
		const favourDoc = await favour.save();
		res.status(201).send(favourDoc);
	} catch (error) {
		next(error);
	}
};

module.exports.repay = async (req, res, next) => {
	try {
		catchValidationErrors(req);

		const { favourId } = req.body;

		// Find favour, set repaid to true and save
		const favourDoc = await Favour.findById(favourId);
		favourDoc.repaid = true;
		await favourDoc.save();

		res.status(204).end();
	} catch (error) {
		next(error);
	}
};

module.exports.delete = async (req, res, next) => {
	try {
		catchValidationErrors(req);

		const { favourId } = req.body;

		// Find and delete favour
		await Favour.findByIdAndDelete(favourId);

		res.status(204).end();
	} catch (error) {
		next(error);
	}
};
