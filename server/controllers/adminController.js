const { executeQuery, getOne, insertOne, updateRecord } = require('../config/database');

const getDashboardStats = async (req, res) => {
    try {
        const total_users = await getOne('SELECT COUNT(*) as count FROM users WHERE role = "voter"');
        const total_admins = await getOne('SELECT COUNT(*) as count FROM admins');
        const total_elections = await getOne('SELECT COUNT(*) as count FROM elections');
        const active_elections = await getOne('SELECT COUNT(*) as count FROM elections WHERE status = "active"');
        const total_votes = await getOne('SELECT COUNT(*) as count FROM votes');
        const total_candidates = await getOne('SELECT COUNT(*) as count FROM candidates');
        
        const recent_activities = await executeQuery(
            'SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 10'
        );

        res.json({
            success: true,
            data: {
                total_users: total_users.success ? total_users.data.count : 0,
                total_admins: total_admins.success ? total_admins.data.count : 0,
                total_elections: total_elections.success ? total_elections.data.count : 0,
                active_elections: active_elections.success ? active_elections.data.count : 0,
                total_votes: total_votes.success ? total_votes.data.count : 0,
                total_candidates: total_candidates.success ? total_candidates.data.count : 0,
                recent_activities: recent_activities.success ? recent_activities.data : []
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
};

const getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const users = await executeQuery(
        `SELECT id, fullname, email, department, student_id, email_verified, created_at 
         FROM users WHERE role = 'voter' 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
    );

    const total = await getOne('SELECT COUNT(*) as count FROM users WHERE role = "voter"');

    res.json({
        success: true,
        data: {
            users: users.success ? users.data : [],
            pagination: {
                page,
                limit,
                total: total.success ? total.data.count : 0,
                pages: Math.ceil((total.success ? total.data.count : 0) / limit)
            }
        }
    });
};

const getAllElections = async (req, res) => {
    const elections = await executeQuery(
        `SELECT e.*, 
            COUNT(DISTINCT c.id) as total_candidates,
            COUNT(DISTINCT v.id) as total_votes
         FROM elections e
         LEFT JOIN candidates c ON e.id = c.election_id
         LEFT JOIN votes v ON e.id = v.election_id
         GROUP BY e.id
         ORDER BY e.created_at DESC`
    );

    res.json({
        success: true,
        data: elections.success ? elections.data : []
    });
};

const createElection = async (req, res) => {
    const { title, description, start_date, end_date, status } = req.body;

    console.log('📝 Creating election:', { title, description, start_date, end_date, status });

    if (!title || !start_date || !end_date) {
        return res.status(400).json({
            success: false,
            message: 'Title, start date and end date are required'
        });
    }

    try {
        // Get admin ID from admins table using email from token
        const admin = await getOne('SELECT id FROM admins WHERE email = ?', [req.user.email]);
        
        let createdBy = null;
        if (admin.success && admin.data) {
            createdBy = admin.data.id;
            console.log('✅ Found admin ID:', createdBy);
        } else {
            console.log('⚠️ Admin not found in admins table, using NULL');
        }

        const result = await insertOne(
            'INSERT INTO elections (title, description, start_date, end_date, status, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, start_date, end_date, status || 'upcoming', createdBy]
        );

        if (result.success) {
            console.log('✅ Election created with ID:', result.id);
            res.status(201).json({
                success: true,
                message: 'Election created successfully',
                data: { id: result.id }
            });
        } else {
            console.error('❌ Insert error:', result.error);
            res.status(500).json({
                success: false,
                message: 'Failed to create election: ' + result.error
            });
        }
    } catch (error) {
        console.error('❌ Create election error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create election: ' + error.message
        });
    }
};

const updateElection = async (req, res) => {
    const { id } = req.params;
    const { title, description, start_date, end_date, status } = req.body;

    const result = await updateRecord(
        'UPDATE elections SET title = ?, description = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?',
        [title, description, start_date, end_date, status, id]
    );

    if (result.success) {
        res.json({ success: true, message: 'Election updated successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Failed to update election' });
    }
};

const deleteElection = async (req, res) => {
    const { id } = req.params;

    const votes = await getOne('SELECT COUNT(*) as count FROM votes WHERE election_id = ?', [id]);
    if (votes.success && votes.data.count > 0) {
        return res.status(400).json({
            success: false,
            message: 'Cannot delete election that already has votes'
        });
    }

    const result = await executeQuery('DELETE FROM elections WHERE id = ?', [id]);

    if (result.success) {
        res.json({ success: true, message: 'Election deleted successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Failed to delete election' });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllElections,
    createElection,
    updateElection,
    deleteElection
};