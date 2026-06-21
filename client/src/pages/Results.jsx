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
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 0.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>📊 Live Election Results</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>Real-time vote counts • Transparent • Verifiable</p>
          </div>

          {/* Election Selector */}
          {elections.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem', padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                alignItems: 'center', 
                flexWrap: 'wrap',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row'
              }}>
                <label style={{ fontWeight: '600', width: window.innerWidth < 768 ? '100%' : 'auto' }}>Select Election:</label>
                <select 
                  className="form-input" 
                  value={selectedElection?.id || ''}
                  onChange={handleElectionChange}
                  style={{ 
                    flex: 1, 
                    minWidth: window.innerWidth < 768 ? '100%' : '200px',
                    width: window.innerWidth < 768 ? '100%' : 'auto',
                    padding: '0.6rem 1rem',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}
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
            <div className="card" style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 3rem) 1rem' }}>
              <p>No active elections to show results for.</p>
            </div>
          ) : !results ? (
            <div className="card" style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 3rem) 1rem' }}>
              <p>Loading results...</p>
            </div>
          ) : (
            <>
              {/* Winner Banner */}
              {results.winner && (
                <div style={{ 
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                  color: 'white', 
                  padding: 'clamp(1.5rem, 4vw, 2rem) clamp(1rem, 3vw, 2rem)', 
                  borderRadius: '12px', 
                  textAlign: 'center', 
                  marginBottom: '2rem',
                  margin: '0 0 2rem 0'
                }}>
                  <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '0.5rem' }}>🏆</div>
                  <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', opacity: 0.9 }}>CURRENT WINNER</div>
                  <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold', marginTop: '0.25rem', wordBreak: 'break-word' }}>
                    {results.winner.name}
                  </div>
                  <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                    {results.winner.party || 'Independent'} • {results.winner.vote_count} votes
                  </div>
                </div>
              )}
              
              {/* Charts */}
              {results.candidates && results.candidates.length > 0 && (
                <div style={{ overflowX: 'hidden' }}>
                  <ResultChart candidates={results.candidates} />
                </div>
              )}
              
              {/* Detailed Results */}
              <div className="card" style={{ 
                marginTop: '2rem', 
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                margin: '2rem 0 0 0'
              }}>
                <h3 style={{ 
                  marginBottom: '1rem', 
                  fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' 
                }}>
                  Detailed Results
                </h3>
                {results.candidates && results.candidates.map((candidate, index) => (
                  <div key={candidate.id} style={{ marginBottom: '1rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap',
                      gap: '0.25rem'
                    }}>
                      <span style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', wordBreak: 'break-word' }}>
                        <strong>
                          {index === 0 && '🥇 '}
                          {index === 1 && '🥈 '}
                          {index === 2 && '🥉 '}
                          {candidate.name}
                        </strong>
                        <span style={{ color: 'var(--gray-500)', marginLeft: '0.5rem', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>
                          ({candidate.party || 'Independent'})
                        </span>
                      </span>
                      <span style={{ 
                        fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                        whiteSpace: 'nowrap'
                      }}>
                        {candidate.vote_count} votes • {candidate.percentage}%
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: 'clamp(6px, 1.5vw, 8px)' }}>
                      <div className="progress-fill" style={{ width: `${candidate.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
                <hr style={{ margin: '1rem 0' }} />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem',
                  fontSize: 'clamp(0.85rem, 2vw, 1rem)'
                }}>
                  <p><strong>Total Votes Cast:</strong> {results.total_votes}</p>
                  <p><strong>Status:</strong> {results.election?.status === 'active' ? '🟢 Active' : '🔴 Ended'}</p>
                </div>
              </div>

              {/* Auto-refresh indicator */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: '2rem', 
                fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', 
                color: 'var(--gray-500)',
                padding: '0 0.5rem'
              }}>
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