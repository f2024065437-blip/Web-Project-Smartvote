const express = require('express');
const app = express();
const Election = require('./models/Election');

// ========== PUBLIC ROUTE (No Auth Required) ==========
// Get active elections - PUBLIC
app.get('/api/elections/active', async (req, res) => {
  try {
    const now = new Date();
    const elections = await Election.find({
      status: 'active',
      start_date: { $lte: now },
      end_date: { $gte: now }
    }).sort({ created_at: -1 });
    
    res.json({
      success: true,
      data: elections
    });
  } catch (error) {
    console.error('Error fetching active elections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active elections'
    });
  }
});

// ========== PROTECTED ROUTES (Auth Required) ==========
// Get all elections - requires authentication
app.get('/api/elections', authenticateToken, async (req, res) => {
  try {
    const elections = await Election.find().sort({ created_at: -1 });
    res.json({
      success: true,
      data: elections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch elections'
    });
  }
});

// Create election - requires admin
app.post('/api/admin/elections', authenticateToken, isAdmin, async (req, res) => {
  try {
    const election = new Election(req.body);
    await election.save();
    res.json({
      success: true,
      data: election,
      message: 'Election created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create election'
    });
  }
});