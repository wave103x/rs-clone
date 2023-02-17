/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const { check } = require('express-validator');
const {
  getUser, signUpUser, signInUser, getAllUsers, logOut,
} = require('../controllers/userController');
const authMiddleware = require('../middleWares/authMiddleware');

router.post('/signUp', [
  check('login', 'Имя не может быть пустым!').notEmpty(),
  check('nickName', 'Никнейм не может быть пустым!').notEmpty(),
  check('password', 'Пароль не может быть пустым!').notEmpty(),
  check('password', 'Пароль от 6 символов').isLength({ min: 4 }),
], signUpUser);
router.post('/signIn', signInUser);
router.post('/logout', logOut);
router.get('/users', authMiddleware, getAllUsers);
router.get('/', getUser);

module.exports = router;
