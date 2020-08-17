const { body } = require('express-validator');
const User = require('../models/user');

module.exports.signup = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(async (value, { req }) => {
      const userDoc = await User.exists({ email: value });
      if (userDoc) {//If email already exists in the database
        return Promise.reject('Email address already exists');
      }
    }),
  body('password')
    .trim()
    .not().isEmpty(),
  body('firstName')
    .trim()
    .not().isEmpty(),
  body('lastName')
    .trim()
    .not().isEmpty()
];

module.exports.login = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .trim()
    .not().isEmpty()
];