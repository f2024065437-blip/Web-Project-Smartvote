import React, { useState, useEffect } from 'react';
import { getElectionResults, getActiveElections } from '../services/api';
import ResultChart from '../components/ResultChart';

const Results = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      loadResults();
    }
  }, [selectedElection]);

  const loadElections = async () => {
    const result = await getActiveElections();
    if (result.success) {
      setElections(result.data);
      if (result.data.length > 0) {
        setSelectedElection(result.data[0]);
      }
    }
    setLoading(false);
  };

  const loadResults = async () => {
    if (!selectedElection) return;
    setLoading(true);
    const result = await getElectionResults(selectedElection.id);
    if (result.success) {
      setResults(result.data);
    }
    setLoading(false);
  };

  const handleElectionChange = (e) => {
    const electionId = parseInt(e.target.value);
    const election = elections.find(el => el.id === electionId);
    setSelectedElection(election);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <section className="section">
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1>📊 Live Election Results</h1>
            <p style={{ color: 'var(--gray-500)' }}>Real-time vote counts • Transparent • Verifiable</p>
          </div>

          {/* Election Selector */}
          {elections.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ fontWeight: '600' }}>Select Election:</label>
                <select 
                  className="form-input" 
                  value={selectedElection?.id || ''}
                  onChange={handleElectionChange}
                  style={{ flex: 1, minWidth: '200px' }}
                >
                  {elections.map(election => (
                    <option key={election.id} value={election.id}>
                      {election.title} (Ends: {new Date(election.end_date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {!selectedElection ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>No active elections to show results for.</p>
            </div>
          ) : !results ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading results...</p>
            </div>
          ) : (
            <>
              {/* Winner Banner */}
              {results.winner && (
                <div style={{ 
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                  color: 'white', 
                  padding: '2rem', 
                  borderRadius: '12px', 
                  textAlign: 'center', 
                  marginBottom: '2rem' 
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>CURRENT WINNER</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{results.winner.name}</div>
                  <div>{results.winner.party || 'Independent'} • {results.winner.vote_count} votes</div>
                </div>
              )}
              
              {/* Charts */}
              {results.candidates && results.candidates.length > 0 && (
                <ResultChart candidates={results.candidates} />
              )}
              
              {/* Detailed Results */}
              <div className="card" style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Detailed Results</h3>
                {results.candidates && results.candidates.map((candidate, index) => (
                  <div key={candidate.id} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>
                        <strong>
                          {index === 0 && '🥇 '}
                          {index === 1 && '🥈 '}
                          {index === 2 && '🥉 '}
                          {candidate.name}
                        </strong>
                        <span style={{ color: 'var(--gray-500)', marginLeft: '0.5rem' }}>
                          ({candidate.party || 'Independent'})
                        </span>
                      </span>
                      <span>
                        {candidate.vote_count} votes • {candidate.percentage}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${candidate.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
                <hr style={{ margin: '1rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <p><strong>Total Votes Cast:</strong> {results.total_votes}</p>
                  <p><strong>Status:</strong> {results.election?.status === 'active' ? '🟢 Active' : '🔴 Ended'}</p>
                </div>
              </div>

              {/* Auto-refresh indicator */}
              <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                ⏰ Results update automatically every 10 seconds
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Results;