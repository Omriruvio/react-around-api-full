const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../utils/validationerror');
const NotFoundError = require('../utils/notfounderror');
const AuthorizationError = require('../utils/authorizationerror');
const ConflictError = require('../utils/conflicterror');

const { JWT_SECRET, NODE_ENV } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('User id not found.');
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new AuthorizationError('Incorrect email or password.'))
    .then((user) => {
      bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          throw new AuthorizationError('Incorrect email or password.');
        }
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res.send({ token });
      });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      throw new NotFoundError('User list is empty.');
    })
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => {
      throw new NotFoundError('User id not found.');
    })
    .then((user) => res.send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  // prettier-ignore
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!password) throw new ValidationError('Missing password field.');
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('User already exists.'));
        } else next(err);
      });
  });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id: id } = req.user;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('User id not found.');
    })
    .then((user) => res.send(user))
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id: id } = req.user;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('User id not found.');
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getCurrentUser,
};
