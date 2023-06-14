const router = require('express').Router();
const { createUser } = require('../conrtollers/users');
const { validateSignup } = require('../middlewares/joiValidation');

router.post('/', validateSignup, createUser);

module.exports = router;
