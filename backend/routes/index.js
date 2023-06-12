const router = require('express').Router();
const { errors } = require('celebrate');
const users = require('./users');
const cards = require('./cards');
const signin = require('./signin');
const signup = require('./signup');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const auth = require('../middlewares/auth');
const errorsGlobal = require('../middlewares/errors');
const cors = require('../middlewares/cors');
const { requestLogger, errorLogger } = require('../middlewares/logger');

router.use(requestLogger);

router.use(cors);
router.use('/signin', signin);
router.use('/signup', signup);
router.use(auth);
router.use('/users', users);
router.use('/cards', cards);
router.use('/*', () => {
  throw new DocumentNotFoundError('Ошибка 404. Запрашиваемый ресурс не найден');
});

router.use(errorLogger);

router.use(errors());
router.use(errorsGlobal);

module.exports = router;
