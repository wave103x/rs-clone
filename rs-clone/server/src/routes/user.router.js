const router = require('express').Router();
const { getUser, signUpUser } = require('../controllers/userController');

router.post('/signUp', signUpUser);
router.get('/:id', getUser);

module.exports = router;
