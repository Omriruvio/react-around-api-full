const router = require('express').Router();
// prettier-ignore
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getCurrentUser,
} = require('../controllers/users');
// prettier-ignore
const {
  getUserSchema,
  createUserSchema,
  loginSchema,
  updateUserSchema,
  updateAvatarSchema,
} = require('./validation/schemas');
const auth = require('../middlewares/auth');

router.get('/users', auth, getUsers);

router.get('/users/me', auth, getCurrentUser);

router.get('/users/:id', auth, getUserSchema, getUser);

router.post('/signup', createUserSchema, createUser);

router.post('/signin', loginSchema, login);

router.patch('/users/me', auth, updateUserSchema, updateUser);

router.patch('/users/me/avatar', auth, updateAvatarSchema, updateUserAvatar);

module.exports = router;
