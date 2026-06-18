const express = require('express');
const router = express.Router();
const { getElectionResults, getActiveElections, getAllElectionsResults } = require('../controllers/resultController');

router.get('/election/:id', getElectionResults);
router.get('/active', getActiveElections);
router.get('/all', getAllElectionsResults);

module.exports = router;