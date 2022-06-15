const Card = require('../models/card');
const ValidationError = require('../utils/validationerror');
const NotFoundError = require('../utils/notfounderror');
const { NOT_FOUND, BAD_REQUEST, FORBIDDEN } = require('../utils/httpstatuscodes');
const sendDefaultError = require('../utils/senddefaulterror');
const AuthorizationError = require('../utils/authorizationerror');

const getCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      throw new NotFoundError('Card list is empty.');
    })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else sendDefaultError(res, err);
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Invalid card data received.');
        res.status(BAD_REQUEST).send({ message: error.message });
      } else sendDefaultError(res, err);
    });
};

const deleteCard = (req, res) => {
  Card.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) throw new NotFoundError('Card not found.');
      if (card.owner != req.user._id) throw new AuthorizationError('Unaothorized card deletion request', 403);
      return Card.findByIdAndRemove(req.params.cardId).then((deletedCard) => {
        res.send(deletedCard);
      });
    })
    .catch((err) => {
      if (err instanceof AuthorizationError) {
        res.status(FORBIDDEN).send({ message: err.message });
      } else if (err.name === 'CastError') {
        const error = new ValidationError('Invalid card data received.');
        res.status(BAD_REQUEST).send({ message: error.message });
      } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else sendDefaultError(res, err);
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Card id not found.');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError('Invalid card id received.');
        res.status(BAD_REQUEST).send({ message: error.message });
      } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else sendDefaultError(res, err);
    });
};

const removeLike = (req, res) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Card id not found.');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError('Invalid card id received.');
        res.status(BAD_REQUEST).send({ message: error.message });
      } else if (err instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else sendDefaultError(res, err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLike,
};
