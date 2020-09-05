const { body } = require('express-validator');

// TODO: image path validation?

module.exports.create = [
	body('fromId').not().isEmpty().withMessage('fromId is invalid'),
	body('fromName').trim().not().isEmpty().withMessage('fromName is invalid'),
	body('forId').not().isEmpty().withMessage('forId is invalid'),
	body('forName').trim().not().isEmpty().withMessage('forName is invalid'),
	body('act').trim().not().isEmpty().withMessage('Act is invalid')
];

module.exports.repay = [
	body('favourId').not().isEmpty().withMessage('favourId is invalid')
];

module.exports.delete = [
	body('favourId').not().isEmpty().withMessage('favourId is invalid')
];
