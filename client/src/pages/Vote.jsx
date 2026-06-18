import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCandidates, castVote, checkVoteStatus, getActiveElections } from '../services/api';
import CandidateCard from '../components/CandidateCard';
import CountdownTimer from '../components/CountdownTimer';

const Vote = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadActiveElections();
  }, [isAuthenticated]);

  const loadActiveElections = async () => {
    setLoading(true);
    const result = await getActiveElections();
    console.log('Active elections:', result);
    if (result.success) {
      setElections(result.data);
      if (result.data.length > 0) {
        setSelectedElection(result.data[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedElection) {
      loadCandidates();
      checkIfVoted();
    }
  }, [selectedElection]);

  const loadCandidates = async () => {
    if (!selectedElection) return;
    const result = await getCandidates(selectedElection.id);
    if (result.success) {
      setCandidates(result.data);
    }
  };

  const checkIfVoted = async () => {
    if (!selectedElection) return;
    const result = await checkVoteStatus(selectedElection.id);
    if (result.success) {
      setHasVoted(result.hasVoted);
    }
  };

  const handleVote = async (candidateId) => {
    if (hasVoted) {
      alert('You have already voted in this election');
      return;
    }
    
    if (!selectedElection) {
      alert('No election selected');
      return;
    }
    
    if (!window.confirm('Are you sure you want to vote for this candidate? This action cannot be undone.')) {
      return;
    }
    
    const result = await castVote({ 
      candidate_id: candidateId, 
      election_id: selectedElection.id 
    });
    
    if (result.success) {
      setHasVoted(true);
      alert(result.message);
      navigate('/results');
    } else {
      alert(result.message);
    }
  };

  const handleElectionChange = (e) => {
    const electionId = parseInt(e.target.value);
    const election = elections.find(el => el.id === electionId);
    setSelectedElection(election);
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (candidate.party && candidate.party.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1>🗳️ Cast Your Vote</h1>
          <p style={{ color: 'var(--gray-500)' }}>Select an election and vote for your preferred candidate</p>
          {user && <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>👤 Logged in as: {user.fullname || user.email}</p>}
        </div>

        {/* Election Selector */}
        {elections.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.2rem' }}>📭 No Active Elections</p>
            <p style={{ color: 'var(--gray-500)' }}>There are no active elections available right now. Please check back later.</p>
          </div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ fontWeight: '600' }}>Select Election:</label>
                <select 
                  className="form-input" 
                  value={selectedElection?.id || ''}
                  onChange={handleElectionChange}
                  style={{ flex: 1, minWidth: '200px', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                >
                  {elections.map(election => (
                    <option key={election.id} value={election.id}>
                      {election.title} (Ends: {new Date(election.end_date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedElection && (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <h2>{selectedElection.title}</h2>
                  <p style={{ color: 'var(--gray-600)' }}>{selectedElection.description}</p>
                </div>

                <CountdownTimer endDate={selectedElection.end_date} />
                
                {/* Styled Search Bar */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginBottom: '2rem' 
                }}>
                  <div style={{ 
                    position: 'relative', 
                    width: '100%', 
                    maxWidth: '450px' 
                  }}>
                    <span style={{ 
                      position: 'absolute', 
                      left: '14px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      fontSize: '1rem',
                      color: 'var(--gray-400)'
                    }}>
                      🔍
                    </span>
                    <input 
                      type="text" 
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem 0.7rem 2.8rem',
                        fontSize: '0.95rem',
                        borderRadius: '10px',
                        border: '2px solid var(--gray-200)',
                        background: 'var(--gray-50)',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        color: 'var(--gray-800)'
                      }}
                      placeholder="Search candidates by name or party..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6366f1';
                        e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                        e.target.style.background = 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--gray-200)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'var(--gray-50)';
                      }}
                    />
                  </div>
                </div>
                
                {hasVoted && (
                  <div style={{ 
                    background: '#10b981', 
                    color: 'white', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    textAlign: 'center', 
                    marginBottom: '2rem' 
                  }}>
                    ✓ You have already voted in this election. Thank you for participating!
                    <br />
                    <Link 
                      to="/results" 
                      style={{
                        display: 'inline-block',
                        marginTop: '0.5rem',
                        padding: '0.5rem 1.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        borderRadius: '8px',
                        background: 'white',
                        color: '#10b981',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#f0fdf4';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      📊 View Live Results →
                    </Link>
                  </div>
                )}
                
                {filteredCandidates.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>No candidates found for this election.</p>
                    <Link 
                      to="/results" 
                      style={{
                        display: 'inline-block',
                        marginTop: '1rem',
                        padding: '0.6rem 1.8rem',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        borderRadius: '8px',
                        border: '2px solid #6366f1',
                        color: '#6366f1',
                        background: 'transparent',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#6366f1';
                        e.target.style.color = 'white';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#6366f1';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      📊 View Live Results
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Balanced Candidate Cards Grid */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                      gap: '1.5rem',
                      justifyContent: 'center'
                    }}>
                      {filteredCandidates.map(candidate => (
                        <CandidateCard 
                          key={candidate.id}
                          candidate={candidate}
                          onVote={handleVote}
                          hasVoted={hasVoted}
                        />
                      ))}
                    </div>
                    
                    {/* Results Link for everyone */}
                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                      <Link 
                        to="/results" 
                        style={{
                          padding: '0.6rem 1.8rem',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          borderRadius: '8px',
                          border: '2px solid #6366f1',
                          color: '#6366f1',
                          background: 'transparent',
                          textDecoration: 'none',
                          display: 'inline-block',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#6366f1';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#6366f1';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        📊 View Live Results
                      </Link>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Vote;