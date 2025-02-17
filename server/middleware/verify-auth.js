const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const {
	JSON_WEB_TOKEN_ERROR,
	TOKEN_EXPIRED_ERROR
} = require('../utils/constants');
const { DIALOG } = require('../utils/constants');
const jwt = require('jsonwebtoken');
const Token = require('../models/token');
const { getError } = require('../utils/error');
const { getTokens, setCookies } = require('../utils/token');
const mongoose = require('mongoose');
//Export this method as default export to verify if user is logged in or not
module.exports = async (req, res, next) => {
	try {
		let accessTokenError;
		let refreshTokenError;
		let payload;
		const accessToken = req.cookies.token; //Extract Access Token from the request body
		if (!accessToken) {
			//If it is empty, user has no Access Token
			throw getError(
				401,
				'Access denied, login credentials are invalid',
				DIALOG
			);
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
				throw getError(401, 'Access token not valid', DIALOG);
			} else if (accessTokenError.name === TOKEN_EXPIRED_ERROR) {
				//If verification was OK, however token is expired
				const dbToken = await Token.findOne({ accessToken }); //Check against database to see is Refresh Token exists (could be blacklisted)
				if (!dbToken) {
					//If not available in database, it has been blacklisted or it is a fake refresh token
					throw getError(401, 'Refresh token not valid', DIALOG);
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
					//If jwt verification failed
					throw getError(401, 'Refresh token not valid', DIALOG);
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
		res.locals.userId = payload.sub;
		next(); //Will pass to next middleware once authentication has been verified
	} catch (error) {
		res.status(error.status || 500).json({
			message: error.message, //error.response.data.message
			feedback: error.feedback || DIALOG //error.response.data.feedback
		});
	}
};
