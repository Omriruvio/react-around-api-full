const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const urlValidator = require('../utils/url-validator');

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    default: 'Jacques Cousteau',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Explorer',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    validate: {
      validator: urlValidator,
      message: 'Incorrect URL requested in user avatar.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: isEmail, message: 'Email is not valid.' },
  },
});

module.exports = mongoose.model('user', userSchema);
