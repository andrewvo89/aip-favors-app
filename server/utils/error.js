module.exports.getError = (status, message, feedback) => {
  const error = new Error(message);
  error.status = status;
  error.feedback = feedback;
  return error;
};