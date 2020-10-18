const { body } = require('express-validator');
const { BOOLEAN } = require('../utils/constants');

module.exports.update = [
	body('userId').not().isEmpty().withMessage('User is invalid'),
	body('email')
		.not()
		.isEmpty()
		.withMessage('Email is invalid')
		.isEmail()
		.withMessage('Email is invalid'),
	body('firstName').trim().not().isEmpty().withMessage('First name is invalid'),
	body('lastName').trim().not().isEmpty().withMessage('Last name is invalid'),
	body('settings').custom(async (value, { _req }) => {
		if (
			typeof value.darkMode !== BOOLEAN ||
			typeof value.expandFavoursGroup !== BOOLEAN ||
			typeof value.expandRequestsGroup !== BOOLEAN
		) {
			throw new Error('Settings are invalid');
		}
	})
];

module.exports.updatePassword = [
	body('userId').not().isEmpty().withMessage('User is invalid'),
	body('currentPassword')
		.not()
		.isEmpty()
		.withMessage('Current password is invalid')
		.isLength({ min: 6 })
		.withMessage('Current password is invalid'),
	body('password')
		.not()
		.isEmpty()
		.withMessage('New password is invalid')
		.isLength({ min: 6 })
		.withMessage('New password must be at least 6 characters'),
	body('passwordConfirm')
		.not()
		.isEmpty()
		.withMessage('New password is invalid')
		.isLength({ min: 6 })
		.withMessage('New password must be at least 6 characters')
		.custom(async (value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Confirmation password does not match password');
			}
		})
];

module.exports.updateSettings = [
	body('userId').not().isEmpty().withMessage('User is invalid'),
	body('settings').custom(async (value, { _req }) => {
		if (
			typeof value.darkMode !== BOOLEAN ||
			typeof value.notifications !== BOOLEAN ||
			typeof value.expandFavoursGroup !== BOOLEAN ||
			typeof value.expandRequestsGroup !== BOOLEAN
		) {
			throw new Error('Settings are invalid');
		}
	})
];
