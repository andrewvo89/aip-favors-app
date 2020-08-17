const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.signup = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    // console.log(validationErrors);
    if (!validationErrors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.code = 422;
      error.data = validationErrors.array();
      console.log(error);
      throw error;
    }
    const { email, firstName, lastName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });
    const result = await user.save();
    res.status(201).json({//201 because a resource was created
      message: 'user created',
      userId: result._id
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.code = 401;
      throw error;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      const error = new Error('Wrong password!');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign({
      email: user.email,
      userId: user._id.toString()
    }, process.env.JWT_SECRET, {
      expiresIn: '5m'
    });
    res.status(200).json({
      token,
      userId: user._id.toString()
    });
  }
  catch (error) {
    next(error);
  }
};
