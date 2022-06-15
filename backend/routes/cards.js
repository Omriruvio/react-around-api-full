const router = require('express').Router();
const auth = require('../middlewares/auth');
// prettier-ignore
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLike,
} = require('../controllers/cards');
const { createCardSchema, cardIdSchema } = require('./validation/schemas');

router.get('/cards', getCards);

router.post('/cards', auth, createCardSchema, createCard);

router.delete('/cards/:cardId', auth, cardIdSchema, deleteCard);

router.put('/cards/:cardId/likes', auth, cardIdSchema, likeCard);

router.delete('/cards/:cardId/likes', auth, cardIdSchema, removeLike);

module.exports = router;
