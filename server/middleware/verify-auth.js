const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const Token = require('../models/token');
const { getError } = require('../utils/error');
const { getTokens, setCookies } = require('../utils/token');

module.exports = async (req, res, next) => {
  let accessTokenExpired = false;
  const accessToken = req.cookies.accessToken;
  console.log(accessToken);
  if (accessToken) {
    try {
      jwt.verify(accessToken, ACCESS_TOKEN_SECRET);//If this line passes without error, user is authenticated
      console.log('made it to the end of access token');
      res.authenticated = true;
      // next();//Authtication passed
      res.status(200).send();
    } catch (error) {//Access token has expired, check the refresh token
      console.log(error);
      if (error.name === 'TokenExpiredError') {
        accessTokenExpired = true;
      }
    }

    if (accessTokenExpired) {
      console.log(accessTokenExpired);
      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken);
      if (refreshToken) {
        const dbTokenExists = await Token.exists({ token: refreshToken });
        console.log(dbTokenExists);
        if (dbTokenExists) {
          try {
            const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
            console.log(payload)
            const newTokens = getTokens({
              userId: payload.userId,
              email: payload.email
            });
            await Token.deleteOne({ token: refreshToken });
            const dbToken = new Token({ token: newTokens.refreshToken });
            await dbToken.save();
            setCookies(res, newTokens.accessToken, newTokens.refreshToken);
            res.authenticated = true;
            console.log('made it to the end of refresh token');
            next();//Authtication passed
          } catch (error) {
            console.log(error);
            res.authenticated = false;
            next();
          }
        }
      }
    }
  }
  res.authenticated = false;
  next();
};

