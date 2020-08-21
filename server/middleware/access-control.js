const { CLIENT_DOMAIN } = process.env;

module.exports = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CLIENT_DOMAIN);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Headers');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
};