const { body } = require('express-validator');

module.exports.getRequests = [
	body('filter').custom(async (value, { _req }) => {
		if (typeof value !== Object) {
			throw new Error('Filter is invalid');
		}
	})
];

module.exports.create = [
	body('act').trim().not().isEmpty().withMessage('Act is invalid'),
	body('favourType')
		.trim()
		.not()
		.isEmpty()
		.withMessage('Reward favour type is invalid'),
	body('quantity')
		.isInt({ min: 1, max: 10 })
		.withMessage('Quantity favour type is invalid')
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

module.exports.deleteReward = [
	body('requestId').not().isEmpty().withMessage('Request is invalid'),
	body('rewardIndex').isInt().withMessage('Reward index is invalid'),
	body('favourTypeIndex').isInt().withMessage('Favour type index is invalid')
];

module.exports.udpateRewardQuantity = [
	body('requestId').not().isEmpty().withMessage('Request is invalid'),
	body('quantity')
		.isInt({ min: 1, max: 100 })
		.withMessage('Quantity favour type is invalid'),
	body('rewardIndex').isInt().withMessage('Reward index is invalid'),
	body('favourTypeIndex').isInt().withMessage('Favour type index is invalid')
];
