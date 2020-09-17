const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');
const { getTokens, setCookies, clearCookies } = require('../utils/token');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const {
	DIALOG,
	SILENT,
	JSON_WEB_TOKEN_ERROR,
	TOKEN_EXPIRED_ERROR
} = require('../utils/constants');
const { getError } = require('../utils/error');

module.exports.verify = async (req, res, next) => {
	try {
		let accessTokenError;
		let refreshTokenError;
		let payload;
		const accessToken = req.cookies.token; //Extract Access Token from the request body
		if (!accessToken) {
			//If it is empty, user has no Access Token
			throw getError(401, 'Access token not found', SILENT);
		}
		try {
			//Verify the Access Token against the Secret synchronously
			payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
		} catch (error) {
			//If verification fails, store the error in accessTokenError
			accessTokenError = error;
		}
		if (accessTokenError) {
			if (accessTokenError.name === JSON_WEB_TOKEN_ERROR) {
				//If jwt verification failed
				clearCookies();
				throw getError(401, 'Access token not valid', SILENT);
			} else if (accessTokenError.name === TOKEN_EXPIRED_ERROR) {
				//If verification was OK, however token is expired
				const dbToken = await Token.findOne({ accessToken }); //Check against database to see is Refresh Token exists (could be blacklisted)\
				if (!dbToken) {
					//If not available in database, it has been blacklisted or it is a fake refresh token
					throw getError(401, 'Refresh token not valid', SILENT);
				}
				const refreshToken = dbToken.refreshToken;
				try {
					//Verify the Refresh Token against the Secret synchronously
					payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
				} catch (error) {
					//If verification fails, store the error in refreshTokenError
					refreshTokenError = error;
				}
				if (refreshTokenError) {
					throw getError(401, 'Refresh token not valid', SILENT); //If jwt verification failed
				} //All verifications passed, user is OK to get a new Access Token and Refresh Token
				const newTokens = getTokens(payload.sub);
				await Token.deleteOne({ refreshToken }); //Remove the old-non expired Refresh Token from the database
				const newDbToken = new Token({
					userId: new mongoose.Types.ObjectId(payload.sub),
					accessToken: newTokens.accessToken,
					refreshToken: newTokens.refreshToken
				});
				await newDbToken.save(); //Save the new Refresh Token into the database to cross check in future checks
				setCookies(res, newTokens.accessToken); //Set the response cookies, so the client can get the new Tokens
			}
		}
		const user = await User.findOne({
			_id: new mongoose.Types.ObjectId(payload.sub)
		}); //Retrieve the User from the database to send back
		const authUser = {
			userId: user._id.toString(),
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			profilePicture: user.profilePicture,
			settings: user.settings
		};
		res.status(200).json({ authUser });
	} catch (error) {
		next(error);
	}
};
module.exports.signup = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			//Catches any errors detected through express-validator middlware
			throw getError(422, validationErrors.errors[0].msg, DIALOG);
		}
		const { email, firstName, lastName, password } = req.body;
		const userDoc = await User.exists({ email });
		if (userDoc) {
			throw getError(409, 'Email address already exists', DIALOG);
		}

		// Generate salt with a random number of rounds between 10 - 15 and then hash plaintext password
		const salt = bcrypt.genSaltSync(
			Math.floor(Math.random() * (15 - 10 + 1) + 10)
		);
		const hash = bcrypt.hashSync(password, salt);

		const user = new User({
			email,
			password: hash,
			firstName,
			lastName
		});

		await user.save(); //Save new user into the database
		res.status(201).send();
	} catch (error) {
		next(error);
	}
};

module.exports.login = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			//Catches any errors detected through express-validator middlware
			throw getError(422, validationErrors.errors[0].msg, DIALOG);
		}
		const { email, password } = req.body;
		const user = await User.findOne({ email }); //Check if email is in the database
		if (!user) {
			//If not, throw an error, but be ambiguous with the error message
			throw getError(401, 'Email or password is invalid', DIALOG);
		}
		const passwordMatch = await bcrypt.compare(password, user.password); //Do a encryption password comparison to the one in the database
		if (!passwordMatch) {
			//If not, throw an error, but be ambiguous with the error message
			throw getError(401, 'Email or password is invalid', DIALOG);
		}
		const userId = user._id.toString();
		const { accessToken, refreshToken } = getTokens(userId);
		const dbToken = new Token({ userId, accessToken, refreshToken }); //Create Token model object to enter into the database
		await dbToken.save();
		setCookies(res, accessToken); //Set the response cookies to send back to the client
		const authUser = {
			userId,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			profilePicture: user.profilePicture,
			settings: user.settings
		};
		res.status(200).json({ authUser });
	} catch (error) {
		next(error);
	}
};

exports.logout = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			//Catches any errors detected through express-validator middlware
			throw getError(422, validationErrors.errors[0].msg, SILENT);
		}
		const dbToken = await Token.findOne({
			accessToken: req.cookies.token,
			userId: req.body.userId
		});
		if (dbToken) {
			//Remove the refresh token from the database
			dbToken.deleteOne();
		}
		clearCookies(res); //Remove cookies from the client
		res.status(205).send();
	} catch (error) {
		next(error);
	}
};
