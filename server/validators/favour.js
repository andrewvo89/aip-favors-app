const { body, param } = require('express-validator');

module.exports.getById = [
	param('favourId').not().isEmpty().withMessage('favourId is invalid')
];

module.exports.create = [
	body('fromUser').not().isEmpty().withMessage('fromUser is invalid'),
	body('forUser').not().isEmpty().withMessage('forUser is invalid'),
	body('favourType')
		.trim()
		.not()
		.isEmpty()
		.withMessage('favourType is invalid'),
	body('quantity')
		.isInt({ min: 1, max: 100 })
		.withMessage('Quantity favour type is invalid')
];

module.exports.repay = [
	body('favourId').not().isEmpty().withMessage('favourId is invalid')
];

module.exports.delete = [
	body('userId').not().isEmpty().withMessage('User is invalid'),
	body('favourId').not().isEmpty().withMessage('favourId is invalid')
];
