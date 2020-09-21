const { validationResult } = require('express-validator');
const User = require('../models/user');
const { DIALOG } = require('../utils/constants');
const { getError } = require('../utils/error');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

module.exports.update = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			//Catches any errors detected through express-validator middleware
			throw getError(422, validationErrors.errors[0].msg, DIALOG);
		}
		const {
			userId,
			email,
			firstName,
			lastName,
			profilePicture,
			settings
		} = req.body;
		const existingUser = await User.findOne({
			_id: new mongoose.Types.ObjectId(userId)
		});
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
		existingUser.profilePicture = profilePicture;
		existingUser.settings = settings;
		await existingUser.save(); //Save updated user into the database
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

module.exports.updatePassword = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			//Catches any errors detected through express-validator middlware
			throw getError(422, validationErrors.errors[0].msg, DIALOG);
		}
		const { userId, currentPassword, password } = req.body;
		const existingUser = await User.findOne({
			_id: new mongoose.Types.ObjectId(userId)
		});
		if (!existingUser) {
			//If not, throw an error, but be ambiguous with the error message
			throw getError(404, 'User not found', DIALOG);
		}
		const passwordMatch = await bcrypt.compare(
			currentPassword,
			existingUser.password
		); //Do a encryption password comparison to the one in the database
		if (!passwordMatch) {
			//If not, throw an error, but be ambiguous with the error message
			throw getError(401, 'Current password is invalid', DIALOG);
		} //Once authenticated with their current password, move on to set new password

		// Generate salt with a random number of rounds between 10-15 and hash plaintext password
		const salt = bcrypt.genSaltSync(
			Math.floor(Math.random() * (15 - 10 + 1) + 10)
		);
		const hash = bcrypt.hashSync(password, salt);
		existingUser.password = hash;
		await existingUser.save(); //Save updated user into the database
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

module.exports.updateSettings = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			//Catches any errors detected through express-validator middlware
			throw getError(422, validationErrors.errors[0].msg, DIALOG);
		}
		const { userId, settings } = req.body;
		const existingUser = await User.findOne({
			_id: new mongoose.Types.ObjectId(userId)
		});
		if (!existingUser) {
			throw getError(404, 'User not found', DIALOG);
		}
		existingUser.settings = settings;
		await existingUser.save(); //Save updated user into the database;
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

module.exports.uploadPicture = async (req, res, next) => {
	try {
		const imagePath = path.join(req.file.destination, `${uuidv4()}_400.jpg`);
		await sharp(req.file.path).jpeg().toFile(imagePath);
		const existingUser = await User.findOne({
			_id: new mongoose.Types.ObjectId(res.locals.userId)
		});
		if (!existingUser) {
			throw getError(404, 'User not found', DIALOG);
		}
		existingUser.profilePicture = imagePath;
		await existingUser.save(); //Save updated user into the database;
		res.status(200).json({ profilePicture: existingUser.profilePicture });
	} catch (error) {
		next(error);
	}
};

module.exports.removePicture = async (req, res, next) => {
	try {
		const existingUser = await User.findOne({
			_id: new mongoose.Types.ObjectId(res.locals.userId)
		});
		if (!existingUser) {
			throw getError(404, 'User not found', DIALOG);
		}
		const destination = path.join(
			'storage',
			'users',
			res.locals.userId,
			'profilePicture'
		);
		fs.rmdirSync(destination, { recursive: true });
		existingUser.profilePicture = '';
		await existingUser.save(); //Save updated user into the database;
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

module.exports.getUsers = async (req, res, next) => {
	try {
		const { filter } = req.body;
		const userDocs = await User.find(filter).sort({ firstName: 'asc' });
		//These users can be pulled without authentication so do not expose email, and app settings
		const users = userDocs.map((user) => {
			return {
				userId: user._id,
				email: null,
				firstName: user.firstName,
				lastName: user.lastName,
				profilePicture: user.profilePicture,
				settings: null
			};
		});
		res.status(200).json({ users });
	} catch (error) {
		next(error);
	}
};
