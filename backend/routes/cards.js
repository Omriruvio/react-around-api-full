const router = require('express').Router();
const auth = require('../middlewares/auth');
const { getCards, createCard, deleteCard, likeCard, removeLike } = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', auth, createCard);

router.delete('/cards/:cardId', auth, deleteCard);

router.put('/cards/:cardId/likes', auth, likeCard);

router.delete('/cards/:cardId/likes', auth, removeLike);

module.exports = router;
