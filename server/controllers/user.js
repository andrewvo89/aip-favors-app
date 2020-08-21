const { validationResult } = require('express-validator');
const User = require('../models/user');
const { DIALOG } = require('../utils/constants');
const { getError } = require('../utils/error');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

module.exports.update = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {//Catches any errors detected through express-validator middlware
      throw getError(422, validationErrors.errors[0].msg, DIALOG);
    }
    const { userId, email, firstName, lastName } = req.body;
    const existingUser = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
    if (!existingUser) {
      throw getError(404, 'User not found', DIALOG);
    }
    const emailFound = await User.exists({ email });
    if (existingUser.email !== email && emailFound) {
      throw getError(409, 'Email address is not available', DIALOG);
    }
    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.email = email;
    existingUser.save();//Save updated user into the database
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports.updatePassword = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {//Catches any errors detected through express-validator middlware
      throw getError(422, validationErrors.errors[0].msg, DIALOG);
    }
    const { userId, currentPassword, password } = req.body;
    const existingUser = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
    if (!existingUser) {//If not, throw an error, but be ambiguous with the error message
      throw getError(404, 'User not found', DIALOG);
    }
    const passwordMatch = await bcrypt.compare(currentPassword, existingUser.password);//Do a encryption password comparison to the one in the database
    if (!passwordMatch) {//If not, throw an error, but be ambiguous with the error message
      throw getError(401, 'Current password is invalid', DIALOG);
    }//Once authenticated with their current password, move on to set new password
    const hashedPassword = await bcrypt.hash(password, 12);//Convert user's plain text password to encrypted password
    existingUser.password = hashedPassword;
    existingUser.save();//Save updated user into the database
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

