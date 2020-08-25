export default class User {
  constructor({ userId, email, firstName, lastName, profilePicture, settings }) {
    this.userId = userId;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.profilePicture = profilePicture;
    this.settings = settings;
  }
}