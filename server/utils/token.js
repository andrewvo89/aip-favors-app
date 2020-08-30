const {
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
	ACCESS_TOKEN_EXPIRY,
	REFRESH_TOKEN_EXPIRY
} = process.env;
const jwt = require('jsonwebtoken');

module.exports.getTokens = (userId) => {
	const payload = {
		iss: process.env.APP_NAME,
		sub: userId
	};
	return {
		accessToken: tokenGenerator(
			payload,
			ACCESS_TOKEN_SECRET,
			ACCESS_TOKEN_EXPIRY
		),
		refreshToken: tokenGenerator(
			payload,
			REFRESH_TOKEN_SECRET,
			REFRESH_TOKEN_EXPIRY
		)
	};
};

module.exports.setCookies = (res, accessToken) => {
	res.cookie('token', accessToken, {
		secure: false, //Enabled true when changeing from development (http) to production (https)
		httpOnly: true
	});
};

module.exports.clearCookies = (res) => {
	res.clearCookie('token');
};

const tokenGenerator = (payload, secret, expiry) => {
	return jwt.sign(payload, secret, {
		algorithm: 'HS256',
		expiresIn: expiry
	});
};
