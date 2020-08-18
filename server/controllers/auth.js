const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Token = require('../models/token');
const { getTokens, setCookies } = require('../utils/token');
const mongoose = require('mongoose');

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { getError } = require('../utils/error');

module.exports.verify = async (req, res, next) => {
  let accessTokenExpired = false;
  const accessToken = req.cookies.accessToken;
  if (accessToken) {
    try {
      const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);//If this line passes without error, user is authenticated
      const user = await User.findOne({ _id: new mongoose.Types.ObjectId(payload.userId) });
      const authUser = {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName
      }
      console.log('made it to the end of access token', authUser);
      return res.status(200).json({ authUser });
    } catch (error) {//Access token has expired, check the refresh token
      if (error.name === 'TokenExpiredError') {
        accessTokenExpired = true;
      }
    }
    if (accessTokenExpired) {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        const dbTokenExists = await Token.exists({ token: refreshToken });
        if (dbTokenExists) {
          try {
            const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
            const newTokens = getTokens({
              userId: payload.userId,
              email: payload.email
            });
            await Token.deleteOne({ token: refreshToken });
            const dbToken = new Token({ token: newTokens.refreshToken });
            await dbToken.save();
            setCookies(res, newTokens.accessToken, newTokens.refreshToken);
            const user = await User.findOne({ _id: new mongoose.Types.ObjectId(payload.userId) });
            const authUser = {
              _id: user._id.toString(),
              firstName: user.firstName,
              lastName: user.lastName
            }
            console.log('made it to the end of refresh token', authUser);
            return res.status(200).json({ authUser });
          } catch {
            //Error validating refresh token, do nothing, go to error handler below
          }
        }
      }
    }
  }

  next(getError(401, 'Not authenticated.'));
}

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
    const payload = {
      email: user.email,
      userId: user._id.toString()
    };
    const { accessToken, refreshToken } = getTokens(payload);
    const dbToken = new Token({ token: refreshToken });
    await dbToken.save();
    setCookies(res, accessToken, refreshToken);
    res.status(200).json({ userId: user._id.toString() });
  }
  catch (error) {
    next(error);
  }
};