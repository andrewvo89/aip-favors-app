const { body } = require('express-validator');

// TODO: image path validation?
// TODO: auth check: ensure user has permission

module.exports.getById = [
	body('userId').not().isEmpty().withMessage('User is invalid'),
	body('favourId').not().isEmpty().withMessage('favourId is invalid')
];

module.exports.getAll = [
	body('userId').not().isEmpty().withMessage('User is invalid')
];

module.exports.create = [
	body('fromId').not().isEmpty().withMessage('fromId is invalid'),
	body('fromName').trim().not().isEmpty().withMessage('fromName is invalid'),
	body('forId').not().isEmpty().withMessage('forId is invalid'),
	body('forName').trim().not().isEmpty().withMessage('forName is invalid'),
	body('act').trim().not().isEmpty().withMessage('Act is invalid')
];

module.exports.repay = [
	body('userId').not().isEmpty().withMessage('User is invalid'),
	body('favourId').not().isEmpty().withMessage('favourId is invalid')
];

module.exports.delete = [
	body('userId').not().isEmpty().withMessage('User is invalid'),
	body('favourId').not().isEmpty().withMessage('favourId is invalid')
];
