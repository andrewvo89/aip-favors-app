const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = process.env;
const jwt = require('jsonwebtoken');

module.exports.getTokens = payload => {
  return {
    accessToken: tokenGenerator(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY),
    refreshToken: tokenGenerator(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY)
  };
}

module.exports.setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    secure: false, //Enabled true when changeing from development (http) to production (https)
    httpOnly: true
  });
  res.cookie("refreshToken", refreshToken, {
    secure: false, //Enabled true when changeing from development (http) to production (https)
    httpOnly: true
  });
}

module.exports.clearCookies = res => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
}

const tokenGenerator = (payload, secret, expiry) => {
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: expiry
  });
}