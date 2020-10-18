const { body } = require('express-validator');

module.exports.getRequests = [
	body('filter').custom(async (value, { _req }) => {
		if (typeof value !== Object) {
			throw new Error('Filter is invalid');
		}
	})
];

module.exports.create = [
	body('task').trim().not().isEmpty().withMessage('Act is invalid'),
	body('favourType.favourTypeId')
		.trim()
		.not()
		.isEmpty()
		.withMessage('Reward favour type is invalid'),
	body('favourType.name')
		.trim()
		.not()
		.isEmpty()
		.isLength({ min: 0, max: 50 })
		.withMessage('Reward favour type is invalid'),
	body('quantity')
		.isInt({ min: 1, max: 100 })
		.withMessage('Quantity favour type is invalid')
];

module.exports.addReward = [
	body('requestId').not().isEmpty().withMessage('Request is invalid'),
	body('favourType.favourTypeId')
		.trim()
		.not()
		.isEmpty()
		.withMessage('Reward favour type is invalid'),
	body('favourType.name')
		.trim()
		.not()
		.isEmpty()
		.isLength({ min: 0, max: 50 })
		.withMessage('Reward favour type is invalid'),
	body('quantity')
		.isInt({ min: 1, max: 10 })
		.withMessage('Quantity favour type is invalid')
];

module.exports.deleteReward = [
	body('requestId').trim().not().isEmpty().withMessage('Request is invalid'),
	body('favourTypeId')
		.trim()
		.not()
		.isEmpty()
		.withMessage('Favour type is invalid'),
	body('fromUserId').trim().not().isEmpty().withMessage('From user is invalid')
];

module.exports.udpateRewardQuantity = [
	body('requestId').not().isEmpty().withMessage('Request is invalid'),
	body('fromUserId').not().isEmpty().withMessage('From user is invalid'),
	body('favourTypeId').not().isEmpty().withMessage('Favour type is invalid'),
	body('quantity')
		.isInt({ min: 1, max: 100 })
		.withMessage('Quantity favour type is invalid')
];

module.exports.complete = [
	body('requestId').not().isEmpty().withMessage('Request is invalid')
];
