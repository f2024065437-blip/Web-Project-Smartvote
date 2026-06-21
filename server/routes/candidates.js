const express = require('express');
const router = express.Router();
const { executeQuery, getOne, insertOne, updateRecord } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/election/:election_id', async (req, res) => {
    const result = await executeQuery(
        'SELECT * FROM candidates WHERE election_id = $1 ORDER BY name',
        [req.params.election_id]
    );
    res.json({ success: true, data: result.success ? result.data : [] });
});

router.get('/:id', verifyToken, async (req, res) => {
    const result = await getOne('SELECT * FROM candidates WHERE id = $1', [req.params.id]);
    res.json({ success: result.success, data: result.data });
});

router.post('/', verifyToken, isAdmin, async (req, res) => {
    console.log('📝 Adding candidate by:', req.user?.email);
    const { election_id, name, party, department, manifesto } = req.body;

    const result = await insertOne(
        'INSERT INTO candidates (election_id, name, party, department, manifesto) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [election_id, name, party, department, manifesto]
    );

    if (result.success) {
        res.status(201).json({ success: true, message: 'Candidate added', id: result.id });
    } else {
        console.error('❌ Add candidate error:', result.error);
        res.status(500).json({ success: false, message: 'Failed to add candidate' });
    }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    const { name, party, department, manifesto } = req.body;

    const result = await updateRecord(
        'UPDATE candidates SET name = $1, party = $2, department = $3, manifesto = $4 WHERE id = $5',
        [name, party, department, manifesto, req.params.id]
    );

    res.json({ success: result.success, message: result.success ? 'Candidate updated' : 'Update failed' });
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    const result = await executeQuery('DELETE FROM candidates WHERE id = $1', [req.params.id]);
    res.json({ success: result.success, message: result.success ? 'Candidate deleted' : 'Delete failed' });
});

module.exports = router;