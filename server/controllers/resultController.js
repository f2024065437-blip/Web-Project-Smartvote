const { executeQuery, getOne } = require('../config/database');

const getElectionResults = async (req, res) => {
    const { id } = req.params;
    
    const election = await getOne('SELECT * FROM elections WHERE id = ?', [id]);
    if (!election.success || !election.data) {
        return res.status(404).json({ success: false, message: 'Election not found' });
    }
    
    const candidates = await executeQuery(
        `SELECT c.*, COUNT(v.id) as vote_count 
         FROM candidates c 
         LEFT JOIN votes v ON c.id = v.candidate_id 
         WHERE c.election_id = ? 
         GROUP BY c.id 
         ORDER BY vote_count DESC`,
        [id]
    );
    
    const totalVotes = await getOne('SELECT COUNT(*) as total FROM votes WHERE election_id = ?', [id]);
    const total = totalVotes.success ? totalVotes.data.total : 0;
    
    const candidatesWithPercentage = candidates.success ? candidates.data.map(c => ({
        ...c,
        percentage: total > 0 ? ((c.vote_count / total) * 100).toFixed(1) : 0
    })) : [];
    
    res.json({
        success: true,
        data: {
            election: election.data,
            total_votes: total,
            winner: candidatesWithPercentage[0] || null,
            candidates: candidatesWithPercentage
        }
    });
};

const getActiveElections = async (req, res) => {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const elections = await executeQuery(
        `SELECT * FROM elections WHERE start_date <= ? AND end_date >= ? AND status = 'active' ORDER BY end_date ASC`,
        [now, now]
    );
    res.json({ success: true, data: elections.success ? elections.data : [] });
};

const getAllElectionsResults = async (req, res) => {
    const elections = await executeQuery(
        `SELECT e.*, 
            COUNT(DISTINCT v.id) as total_votes,
            (SELECT name FROM candidates c WHERE c.election_id = e.id ORDER BY c.votes_count DESC LIMIT 1) as leading_candidate
         FROM elections e
         LEFT JOIN votes v ON e.id = v.election_id
         GROUP BY e.id
         ORDER BY e.created_at DESC`
    );
    res.json({ success: true, data: elections.success ? elections.data : [] });
};

module.exports = { getElectionResults, getActiveElections, getAllElectionsResults };