const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, JSON_WEB_TOKEN_ERROR, TOKEN_EXPIRED_ERROR } = process.env;
const { SILENT } = require('../utils/constants');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Token = require('../models/token');
const User = require('../models/user');
const { getError } = require('../utils/error');
const { getTokens, setCookies } = require('../utils/token');

module.exports = async (req, res, next) => {
  try {
    let accessTokenError;
    let refreshTokenError;
    let payload;
    const accessToken = req.cookies.accessToken;//Extract Access Token from the request body
    if (!accessToken) {//If it is empty, user has no Access Token
      throw getError(401, 'Access token not found', SILENT);
    }
    try {//Verify the Access Token against the Secret synchronously
      payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch (error) {//If verification fails, store the error in accessTokenError
      accessTokenError = error;
    }
    if (accessTokenError) {
      if (accessTokenError.name === JSON_WEB_TOKEN_ERROR) {//If jwt verification failed
        throw getError(401, 'Access token not valid', SILENT);
      } else if (accessTokenError.name === TOKEN_EXPIRED_ERROR) {//If verification was OK, however token is expired
        const refreshToken = req.cookies.refreshToken;//Start process of analysing Refresh Token
        const dbTokenExists = await Token.exists({ token: refreshToken });//Check against database to see is Refresh Token exists (could be blacklisted)
        if (!dbTokenExists) {//If not available in database, it has been blacklisted or it is a fake refresh token
          throw getError(401, 'Refresh token not valid', SILENT);
        }
        try {//Verify the Refresh Token against the Secret synchronously
          payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        } catch (error) {//If verification fails, store the error in refreshTokenError
          refreshTokenError = error;
        }
        if (refreshTokenError) {//If jwt verification failed
          throw getError(401, 'Refresh token not valid', SILENT);
        }
        const newTokens = getTokens({//All verifications passed, user is OK to get a new Access Token and Refresh Token
          userId: payload.userId,
          email: payload.email
        });
        await Token.deleteOne({ token: refreshToken });//Remove the old-non expired Refresh Token from the database
        const dbToken = new Token({
          token: newTokens.refreshToken,
          userId: payload.userId
        });
        await dbToken.save();//Save the new Refresh Token into the database to cross check in future checks
        setCookies(res, newTokens.accessToken, newTokens.refreshToken);//Set the response cookies, so the client can get the new Tokens
      }
    }
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(payload.userId) });//Retrieve the User from the database to send back
    const authUser = {
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
    res.status(200).json({ authUser });
  } catch (error) {
    res.status(error.status || 500).json({//error.response.status / statusText
      message: error.message,//error.response.data.message
      feedback: error.feedback || SILENT//error.response.data.feedback
    });
  }
};

