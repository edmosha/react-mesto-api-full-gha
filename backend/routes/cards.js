const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../conrtollers/cards');
const { validateCardId, validateCards } = require('../middlewares/joiValidation');

router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.post('/', validateCards, createCard);
router.get('/', getCards);

module.exports = router;
