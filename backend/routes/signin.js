const router = require('express').Router();
const { login } = require('../conrtollers/users');
const { validateSignin } = require('../middlewares/joiValidation');

router.post('/', validateSignin, login);

module.exports = router;
