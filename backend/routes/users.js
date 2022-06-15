const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUser, createUser, updateUser, updateUserAvatar, login, getCurrentUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

const createUserSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
});

const loginSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

router.get('/users', auth, getUsers);

router.get('/users/me', auth, getCurrentUser);

router.get('/users/:id', auth, getUser);

router.post('/signup', createUserSchema, createUser);

router.post('/signin', loginSchema, login);

router.patch('/users/me', auth, updateUser);

router.patch('/users/me/avatar', auth, updateUserAvatar);

module.exports = router;
