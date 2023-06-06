/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const {
  postWinner, getWinners,
} = require('../controllers/winnerController');

router.post('/:id', postWinner);
router.get('/:mode', getWinners);
// router.patch('/:id', patchWinner);

module.exports = router;
