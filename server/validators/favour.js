const { body, param } = require('express-validator');

module.exports.getById = [
	param('favourId').not().isEmpty().withMessage('favourId is invalid')
];

module.exports.create = [
	body('fromUser').not().isEmpty().withMessage('fromUser is invalid'),
	body('forUser').not().isEmpty().withMessage('forUser is invalid'),
	body('act').trim().not().isEmpty().withMessage('Act is invalid')
];

module.exports.repay = [
	body('favourId').not().isEmpty().withMessage('favourId is invalid')
];

module.exports.delete = [
	body('userId').not().isEmpty().withMessage('User is invalid'),
	body('favourId').not().isEmpty().withMessage('favourId is invalid')
];
