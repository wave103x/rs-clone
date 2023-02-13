/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const { check } = require('express-validator');
const {
  postWinner, getWinners, patchWinner,
} = require('../controllers/userController');

router.post('/:id', postWinner);
router.get('/', getWinners);
router.patch('/:id', patchWinner);

module.exports = router;
