const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ""
  },
  settings: {
    darkMode: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    appNotifications: {
      type: Boolean,
      default: true
    },
    expandSideDrawerItems: {
      favoriteGroups: {
        type: Boolean,
        default: true
      },
      publicGroups: {
        type: Boolean,
        default: true
      },
      privateGroups: {
        type: Boolean,
        default: true
      },
      directMessages: {
        type: Boolean,
        default: true
      },
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);