const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserData,
  updateUserAvatar,
  getAboutMe,
} = require('../conrtollers/users');
const {
  validateUsersMeAvatar,
  validateUsersMe,
  validateUsersId,
} = require('../middlewares/joiValidation');

router.patch('/me/avatar', validateUsersMeAvatar, updateUserAvatar);
router.get('/me', getAboutMe);
router.patch('/me', validateUsersMe, updateUserData);
router.get('/:userId', validateUsersId, getUser);
router.get('/', getUsers);

module.exports = router;
