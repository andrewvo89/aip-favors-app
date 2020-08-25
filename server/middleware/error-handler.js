const { SILENT } = require('../utils/constants');

module.exports = async (error, req, res, next) => {
  console.log(new Date(), error.status, error.message);
  res.status(error.status || 500).json({//error.response.status / statusText
    message: error.message,//error.response.data.message
    feedback: error.feedback || SILENT//error.response.data.feedback
  });
}