const express = require('express');
const router = express.Router();
const { verifyToken, isVoter } = require('../middleware/auth');
const { castVote, checkVoteStatus, getVotingHistory } = require('../controllers/voteController');
const { voteLimiter } = require('../middleware/rateLimiter');

router.post('/cast', verifyToken, isVoter, castVote);
router.get('/check/:election_id', verifyToken, checkVoteStatus);
router.get('/history', verifyToken, getVotingHistory);

module.exports = router;