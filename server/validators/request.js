const { body } = require('express-validator');

module.exports.create = [
	body('rewards').isArray({ min: 1, max: 1 }),
	body('rewards.*.favourType')
		.trim()
		.not()
		.isEmpty()
		.withMessage('Reward favour type is invalid'),
	body('rewards.*.quantity')
		.isInt({ min: 1, max: 10 })
		.withMessage('Quantity favour type is invalid'),
	body('act').trim().not().isEmpty().withMessage('Act is invalid')
];

module.exports.addReward = [
	body('requestId').not().isEmpty().withMessage('Request is invalid'),
	body('favourType')
		.trim()
		.not()
		.isEmpty()
		.withMessage('Reward favour type is invalid'),
	body('quantity')
		.isInt({ min: 1, max: 10 })
		.withMessage('Quantity favour type is invalid')
];
