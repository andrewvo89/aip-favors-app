export default class ErrorMessage {
  constructor(status, statusText, message, feedback) {
    this.status = status;
    this.statusText = statusText;
    this.message = message;
    this.feedback = feedback;
  }
}