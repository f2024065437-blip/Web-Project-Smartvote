import React, { useState, useEffect } from 'react';
import { getAllElections, getElectionResults, getAllUsers } from '../../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [results, setResults] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('election');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      loadResults();
    }
  }, [selectedElection]);

  const loadData = async () => {
    const [electionsRes, usersRes] = await Promise.all([
      getAllElections(),
      getAllUsers()
    ]);
    
    if (electionsRes.success) {
      setElections(electionsRes.data);
      if (electionsRes.data.length > 0) {
        setSelectedElection(electionsRes.data[0].id);
      }
    }
    
    if (usersRes.success) {
      setUsers(usersRes.data.users || []);
    }
    
    setLoading(false);
  };

  const loadResults = async () => {
    const result = await getElectionResults(selectedElection);
    if (result.success) {
      setResults(result.data);
    }
  };

  // Chart data for election results
  const getVoteChartData = () => {
    if (!results || !results.candidates) return null;
    
    return {
      labels: results.candidates.map(c => c.name),
      datasets: [
        {
          label: 'Votes Received',
          data: results.candidates.map(c => c.vote_count),
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Vote Distribution by Candidate',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Votes',
        },
      },
    },
  };

  // Calculate statistics
  const getStatistics = () => {
    const totalVoters = users.length;
    const totalVotes = results?.total_votes || 0;
    const turnoutRate = totalVoters > 0 ? ((totalVotes / totalVoters) * 100).toFixed(1) : 0;
    const winningMargin = results?.candidates?.length >= 2 
      ? (results.candidates[0]?.vote_count - results.candidates[1]?.vote_count) 
      : 0;
    
    return { totalVoters, totalVotes, turnoutRate, winningMargin };
  };

  const stats = getStatistics();

  // Export to CSV
  const exportToCSV = () => {
    if (!results || !results.candidates) return;
    
    const headers = ['Candidate Name', 'Party', 'Votes', 'Percentage'];
    const rows = results.candidates.map(c => [
      c.name,
      c.party || 'Independent',
      c.vote_count,
      `${c.percentage}%`
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `election_results_${selectedElection}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Print report
  const printReport = () => {
    window.print();
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1>Reports & Analytics</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              className="form-input" 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="election">Election Report</option>
              <option value="voter">Voter Report</option>
              <option value="turnout">Turnout Report</option>
            </select>
            <select 
              className="form-input" 
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
              style={{ width: '250px' }}
            >
              {elections.map(election => (
                <option key={election.id} value={election.id}>
                  {election.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Report Type Selection */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '1rem' }}>
          <button 
            className={reportType === 'election' ? 'btn-primary' : 'btn-outline'}
            onClick={() => setReportType('election')}
          >
            📊 Election Results
          </button>
          <button 
            className={reportType === 'voter' ? 'btn-primary' : 'btn-outline'}
            onClick={() => setReportType('voter')}
          >
            👥 Voter Analysis
          </button>
          <button 
            className={reportType === 'turnout' ? 'btn-primary' : 'btn-outline'}
            onClick={() => setReportType('turnout')}
          >
            📈 Turnout Statistics
          </button>
        </div>

        {/* Election Results Report */}
        {reportType === 'election' && results && (
          <>
            {/* Summary Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{results.total_votes}</div>
                <div className="stat-label">Total Votes Cast</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{results.candidates?.length || 0}</div>
                <div className="stat-label">Total Candidates</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.turnoutRate}%</div>
                <div className="stat-label">Voter Turnout</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.winningMargin}</div>
                <div className="stat-label">Winning Margin</div>
              </div>
            </div>

            {/* Winner Banner */}
            {results.winner && (
              <div className="card" style={{ 
                background: 'linear-gradient(135deg, #10b981, #059669)', 
                color: 'white',
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>🏆 CURRENT WINNER</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{results.winner.name}</div>
                <div>{results.winner.party} • {results.winner.vote_count} votes</div>
              </div>
            )}

            {/* Chart */}
            {getVoteChartData() && (
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Vote Distribution Chart</h3>
                <div style={{ maxHeight: '400px' }}>
                  <Bar data={getVoteChartData()} options={chartOptions} />
                </div>
              </div>
            )}

            {/* Detailed Results Table */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <h3>Detailed Results</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-outline" onClick={exportToCSV} style={{ padding: '0.5rem 1rem' }}>
                    📥 Export CSV
                  </button>
                  <button className="btn-outline" onClick={printReport} style={{ padding: '0.5rem 1rem' }}>
                    🖨️ Print Report
                  </button>
                </div>
              </div>
              
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Candidate Name</th>
                      <th>Party</th>
                      <th>Department</th>
                      <th>Votes Received</th>
                      <th>Percentage</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.candidates?.map((candidate, index) => (
                      <tr key={candidate.id} style={index === 0 ? { background: 'rgba(16, 185, 129, 0.1)' } : {}}>
                        <td>
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `${index + 1}`}
                        </td>
                        <td><strong>{candidate.name}</strong></td>
                        <td>{candidate.party || 'Independent'}</td>
                        <td>{candidate.department || '-'}</td>
                        <td>{candidate.vote_count}</td>
                        <td>{candidate.percentage}%</td>
                        <td>
                          {index === 0 && <span className="badge badge-success">Winner</span>}
                          {index === 1 && <span className="badge badge-info">Runner Up</span>}
                          {index > 1 && <span className="badge">Participant</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Voter Analysis Report */}
        {reportType === 'voter' && (
          <div className="card">
            <h3>Voter Analysis Report</h3>
            
            <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
              <div className="stat-card">
                <div className="stat-value">{users.length}</div>
                <div className="stat-label">Total Registered Voters</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{users.filter(u => u.email_verified).length}</div>
                <div className="stat-label">Verified Voters</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{users.filter(u => !u.email_verified).length}</div>
                <div className="stat-label">Unverified Voters</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{results?.total_votes || 0}</div>
                <div className="stat-label">Votes Cast</div>
              </div>
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Department-wise Voter Distribution</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Students</th>
                    <th>Verified</th>
                    <th>Unverified</th>
                    <th>Participation Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {['Computer Science', 'Software Engineering', 'Information Technology', 'Business Administration', 'Electrical Engineering'].map(dept => {
                    const deptUsers = users.filter(u => u.department === dept);
                    const deptVotes = results?.candidates?.filter(c => c.department === dept).reduce((sum, c) => sum + (c.vote_count || 0), 0) || 0;
                    const participationRate = deptUsers.length > 0 ? ((deptVotes / deptUsers.length) * 100).toFixed(1) : 0;
                    
                    return (
                      <tr key={dept}>
                        <td><strong>{dept}</strong></td>
                        <td>{deptUsers.length}</td>
                        <td>{deptUsers.filter(u => u.email_verified).length}</td>
                        <td>{deptUsers.filter(u => !u.email_verified).length}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>{participationRate}%</span>
                            <div className="progress-bar" style={{ flex: 1 }}>
                              <div className="progress-fill" style={{ width: `${participationRate}%` }}></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Turnout Statistics Report */}
        {reportType === 'turnout' && results && (
          <div className="card">
            <h3>Voter Turnout Analysis</h3>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.totalVoters}</div>
                <div className="stat-label">Eligible Voters</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.totalVotes}</div>
                <div className="stat-label">Votes Cast</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.totalVoters - stats.totalVotes}</div>
                <div className="stat-label">Did Not Vote</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.turnoutRate}%</div>
                <div className="stat-label">Turnout Rate</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h4>Turnout Progress</h4>
              <div className="progress-bar" style={{ height: '30px', borderRadius: '8px' }}>
                <div className="progress-fill" style={{ 
                  width: `${stats.turnoutRate}%`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {stats.turnoutRate}%
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h4>Turnout Analysis</h4>
              <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--gray-100)', borderRadius: '8px' }}>
                  <strong>📊 Overall Turnout:</strong> {stats.turnoutRate}% of eligible voters participated
                </li>
                <li style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--gray-100)', borderRadius: '8px' }}>
                  <strong>🏆 Winning Margin:</strong> {stats.winningMargin} votes difference between winner and runner-up
                </li>
                <li style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--gray-100)', borderRadius: '8px' }}>
                  <strong>📈 Voter Engagement:</strong> {stats.totalVotes} out of {stats.totalVoters} voters cast their ballots
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reports;