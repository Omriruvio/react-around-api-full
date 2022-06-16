const Card = require('../models/card');
const NotFoundError = require('../utils/notfounderror');
const AuthorizationError = require('../utils/authorizationerror');

const getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      throw new NotFoundError('Card list is empty.');
    })
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) throw new NotFoundError('Card not found.');
      if (String(card.owner) !== req.user._id) throw new AuthorizationError('Unaothorized card deletion request', 403);
      return Card.findByIdAndRemove(req.params.cardId).then((deletedCard) => {
        res.send(deletedCard);
      });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Card id not found.');
    })
    .then((card) => res.send(card))
    .catch(next);
};

const removeLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Card id not found.');
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLike,
};
