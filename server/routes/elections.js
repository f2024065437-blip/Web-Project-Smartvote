const express = require('express');
const router = express.Router();
const { executeQuery, getOne, insertOne, updateRecord } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    const result = await executeQuery('SELECT * FROM elections ORDER BY created_at DESC');
    res.json({ success: true, data: result.success ? result.data : [] });
});

router.get('/public/active', async (req, res) => {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const result = await executeQuery(
        "SELECT * FROM elections WHERE start_date <= $1 AND end_date >= $2 AND status = 'active' ORDER BY end_date ASC",
        [now, now]
    );
    res.json({ success: true, data: result.success ? result.data : [] });
});

router.get('/:id', verifyToken, async (req, res) => {
    const result = await getOne('SELECT * FROM elections WHERE id = $1', [req.params.id]);
    res.json({ success: result.success, data: result.data });
});

router.post('/', verifyToken, isAdmin, async (req, res) => {
    const { title, description, start_date, end_date, status } = req.body;

    const result = await insertOne(
        'INSERT INTO elections (title, description, start_date, end_date, status, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [title, description, start_date, end_date, status || 'upcoming', req.user.id]
    );

    if (result.success) {
        res.status(201).json({ success: true, message: 'Election created', id: result.id });
    } else {
        console.error('❌ Create election error:', result.error);
        res.status(500).json({ success: false, message: 'Failed to create election' });
    }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    const { title, description, start_date, end_date, status } = req.body;

    const result = await updateRecord(
        'UPDATE elections SET title = $1, description = $2, start_date = $3, end_date = $4, status = $5 WHERE id = $6',
        [title, description, start_date, end_date, status, req.params.id]
    );

    res.json({ success: result.success, message: result.success ? 'Election updated' : 'Update failed' });
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    const votes = await getOne('SELECT COUNT(*) as count FROM votes WHERE election_id = $1', [req.params.id]);
    if (votes.success && votes.data.count > 0) {
        return res.status(400).json({ success: false, message: 'Cannot delete election that already has votes' });
    }

    const result = await executeQuery('DELETE FROM elections WHERE id = $1', [req.params.id]);
    res.json({ success: result.success, message: result.success ? 'Election deleted' : 'Delete failed' });
});

module.exports = router;