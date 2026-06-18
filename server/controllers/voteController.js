const { executeQuery, getOne, insertOne, updateRecord } = require('../config/database');
// const { sendVoteConfirmation } = require('../services/emailService');

const castVote = async (req, res) => {
    const { candidate_id, election_id } = req.body;
    const voter_id = req.user.id;

    const voter = await getOne('SELECT email, fullname FROM users WHERE id = ?', [voter_id]);
    if (!voter.success || !voter.data) {
        return res.status(404).json({ success: false, message: 'Voter not found' });
    }

    const election = await getOne('SELECT * FROM elections WHERE id = ?', [election_id]);
    if (!election.success || !election.data) {
        return res.status(404).json({ success: false, message: 'Election not found' });
    }

    const now = new Date();
    const startDate = new Date(election.data.start_date);
    const endDate = new Date(election.data.end_date);
    
    if (now < startDate) {
        return res.status(400).json({ success: false, message: 'Election has not started yet' });
    }
    
    if (now > endDate) {
        return res.status(400).json({ success: false, message: 'Election has ended' });
    }

    const existingVote = await getOne('SELECT id FROM votes WHERE voter_id = ? AND election_id = ?', [voter_id, election_id]);
    if (existingVote.success && existingVote.data) {
        return res.status(400).json({ success: false, message: 'You have already voted in this election' });
    }

    const candidate = await getOne('SELECT id, name FROM candidates WHERE id = ? AND election_id = ?', [candidate_id, election_id]);
    if (!candidate.success || !candidate.data) {
        return res.status(404).json({ success: false, message: 'Candidate not found in this election' });
    }

    const voteResult = await insertOne('INSERT INTO votes (voter_id, candidate_id, election_id) VALUES (?, ?, ?)', 
        [voter_id, candidate_id, election_id]);
    
    if (voteResult.success) {
        await updateRecord('UPDATE candidates SET votes_count = votes_count + 1 WHERE id = ?', [candidate_id]);
        
        // Email disabled for testing
        console.log(`📧 [DEV] Vote confirmation for ${voter.data.email}: Voted for ${candidate.data.name} in ${election.data.title}`);
        // await sendVoteConfirmation(voter.data.email, voter.data.fullname, election.data.title, candidate.data.name);
        
        await insertOne(
            'INSERT INTO activity_logs (user_id, user_type, action, details, ip_address) VALUES (?, ?, ?, ?, ?)',
            [voter_id, 'voter', 'vote_cast', `Voted for candidate ${candidate_id} in election ${election_id}`, req.ip || '0.0.0.0']
        );
        
        res.json({ success: true, message: 'Vote cast successfully!' });
    } else {
        res.status(500).json({ success: false, message: 'Failed to cast vote' });
    }
};

const checkVoteStatus = async (req, res) => {
    const { election_id } = req.params;
    const voter_id = req.user.id;
    
    const vote = await getOne('SELECT id FROM votes WHERE voter_id = ? AND election_id = ?', [voter_id, election_id]);
    res.json({ success: true, hasVoted: vote.success && vote.data !== null });
};

const getVotingHistory = async (req, res) => {
    const history = await executeQuery(
        `SELECT v.*, e.title as election_title, c.name as candidate_name, c.party 
         FROM votes v 
         JOIN elections e ON v.election_id = e.id 
         JOIN candidates c ON v.candidate_id = c.id 
         WHERE v.voter_id = ? 
         ORDER BY v.vote_time DESC`,
        [req.user.id]
    );
    res.json({ success: true, data: history.success ? history.data : [] });
};

module.exports = { castVote, checkVoteStatus, getVotingHistory };