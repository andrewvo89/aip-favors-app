const { validationResult } = require('express-validator');
const FavourType = require('../models/favour-type');
const { DIALOG } = require('../utils/constants');
const { getError } = require('../utils/error');

const catchValidationErrors = (req) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		throw getError(422, validationErrors.errors[0].msg, DIALOG);
	}
};

module.exports.getAll = async (req, res, next) => {
	try {
		catchValidationErrors(req);
		const favourTypeDocs = await FavourType.find();
		const favourTypes = favourTypeDocs.map((favourType) => ({
			favourTypeId: favourType._id,
			name: favourType.name
		}));
		res.status(200).send({ favourTypes: favourTypes });
	} catch (error) {
		next(error);
	}
};
