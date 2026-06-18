const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
    getDashboardStats,
    getAllUsers,
    getAllElections,
    createElection,
    updateElection,
    deleteElection
} = require('../controllers/adminController');

router.use(verifyToken, isAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/elections', getAllElections);
router.post('/elections', createElection);
router.put('/elections/:id', updateElection);
router.delete('/elections/:id', deleteElection);

module.exports = router;