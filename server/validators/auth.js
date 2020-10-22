const { body } = require('express-validator');

module.exports.signup = [
	body('email')
		.not()
		.isEmpty()
		.withMessage('Email is invalid')
		.isEmail()
		.withMessage('Email is invalid'),
	body('password')
		.not()
		.isEmpty()
		.withMessage('Password is invalid')
		.isLength({ min: 6, max: 50 })
		.withMessage('Password is invalid'),
	body('passwordConfirm')
		.not()
		.isEmpty()
		.withMessage('Confirmation password is invalid')
		.isLength({ min: 6 })
		.withMessage('Confirmation password must be at least 6 characters')
		.custom(async (value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Confirmation password does not match password');
			}
		}),
	body('firstName').trim().not().isEmpty().withMessage('First name is invalid'),
	body('lastName').trim().not().isEmpty().withMessage('Last name is invalid')
];

module.exports.login = [
	body('email')
		.not()
		.isEmpty()
		.withMessage('Email is invalid')
		.isEmail()
		.withMessage('Email is invalid'),
	body('password')
		.not()
		.isEmpty()
		.withMessage('Password is invalid')
		.isLength({ min: 6 })
		.withMessage('Password is invalid')
];

module.exports.logout = [
	body('userId').not().isEmpty().withMessage('User is invalid')
];
