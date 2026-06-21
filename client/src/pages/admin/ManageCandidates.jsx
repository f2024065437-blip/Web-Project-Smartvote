import React, { useState, useEffect } from 'react';
import { getCandidates, getAllElections, createCandidate, updateCandidate, deleteCandidate } from '../../services/api';

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    party: '',
    department: '',
    manifesto: '',
    election_id: ''
  });

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      loadCandidates();
    }
  }, [selectedElection]);

  const loadElections = async () => {
    const result = await getAllElections();
    if (result.success) {
      setElections(result.data);
      if (result.data.length > 0) {
        setSelectedElection(result.data[0].id);
      }
    }
    setLoading(false);
  };

  const loadCandidates = async () => {
    setLoading(true);
    const result = await getCandidates(selectedElection);
    if (result.success) {
      setCandidates(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = editing
        ? await updateCandidate(editing.id, formData)
        : await createCandidate(formData);

      if (result.success) {
        alert(result.message);
        loadCandidates();
        setShowForm(false);
        setEditing(null);
        setFormData({ name: '', party: '', department: '', manifesto: '', election_id: selectedElection });
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;

    try {
      const result = await deleteCandidate(id);

      if (result.success) {
        alert(result.message);
        loadCandidates();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = (candidate) => {
    setEditing(candidate);
    setFormData({
      name: candidate.name,
      party: candidate.party || '',
      department: candidate.department || '',
      manifesto: candidate.manifesto || '',
      election_id: candidate.election_id
    });
    setShowForm(true);
  };

  const getElectionTitle = (electionId) => {
    const election = elections.find(e => e.id === electionId);
    return election ? election.title : 'Unknown';
  };

  if (loading && elections.length === 0) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1>Manage Candidates</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select 
              className="form-input" 
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
              style={{ 
                width: '200px',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--gray-300)',
                background: 'white',
                fontSize: '0.9rem'
              }}
            >
              {elections.map(election => (
                <option key={election.id} value={election.id}>
                  {election.title}
                </option>
              ))}
            </select>
            <button 
              className="btn-primary" 
              onClick={() => { setShowForm(!showForm); setEditing(null); setFormData({ name: '', party: '', department: '', manifesto: '', election_id: selectedElection }); }}
              style={{
                padding: '0.6rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                background: showForm ? '#ef4444' : '#6366f1',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!showForm) {
                  e.target.style.background = '#4f46e5';
                  e.target.style.boxShadow = '0 4px 10px rgba(99, 102, 241, 0.4)';
                  e.target.style.transform = 'translateY(-2px)';
                } else {
                  e.target.style.background = '#dc2626';
                }
              }}
              onMouseLeave={(e) => {
                if (!showForm) {
                  e.target.style.background = '#6366f1';
                  e.target.style.boxShadow = '0 2px 6px rgba(99, 102, 241, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                } else {
                  e.target.style.background = '#ef4444';
                }
              }}
            >
              {showForm ? '✕ Cancel' : '+ Add Candidate'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3>{editing ? 'Edit Candidate' : 'Add New Candidate'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Candidate Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                  placeholder="Enter candidate name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Party</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.party}
                  onChange={(e) => setFormData({...formData, party: e.target.value})}
                  placeholder="Political party name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Department</label>
                <select 
                  className="form-input" 
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option value="">Select Department</option>
                  <option>Computer Science</option>
                  <option>Software Engineering</option>
                  <option>Information Technology</option>
                  <option>Business Administration</option>
                  <option>Electrical Engineering</option>
                  <option>Mechanical Engineering</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Manifesto / Bio</label>
                <textarea 
                  className="form-input" 
                  rows="4"
                  value={formData.manifesto}
                  onChange={(e) => setFormData({...formData, manifesto: e.target.value})}
                  placeholder="Describe candidate's goals and promises..."
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Election</label>
                <select 
                  className="form-input" 
                  value={formData.election_id}
                  onChange={(e) => setFormData({...formData, election_id: e.target.value})}
                  required
                >
                  <option value="">Select Election</option>
                  {elections.map(election => (
                    <option key={election.id} value={election.id}>
                      {election.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{
                    padding: '0.6rem 1.8rem',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#10b981',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#059669';
                    e.target.style.boxShadow = '0 4px 10px rgba(16, 185, 129, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#10b981';
                    e.target.style.boxShadow = '0 2px 6px rgba(16, 185, 129, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {editing ? '✅ Update Candidate' : '✅ Add Candidate'}
                </button>
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={() => { setShowForm(false); setEditing(null); }}
                  style={{
                    padding: '0.6rem 1.8rem',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: '2px solid #ef4444',
                    color: '#ef4444',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#ef4444';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 10px rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#ef4444';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Candidate Name</th>
                <th>Party</th>
                <th>Department</th>
                <th>Election</th>
                <th>Votes</th>
                <th>Manifesto</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => (
                <tr key={candidate.id}>
                  <td>{index + 1}</td>
                  <td><strong>{candidate.name}</strong></td>
                  <td>{candidate.party || '-'}</td>
                  <td>{candidate.department || '-'}</td>
                  <td>{getElectionTitle(candidate.election_id)}</td>
                  <td>
                    <span style={{ 
                      background: '#6366f1', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {candidate.votes_count || 0} votes
                    </span>
                  </td>
                  <td style={{ maxWidth: '200px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                      {candidate.manifesto ? candidate.manifesto.substring(0, 50) + (candidate.manifesto.length > 50 ? '...' : '') : '-'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn-outline" 
                        style={{ 
                          padding: '0.3rem 0.8rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          borderRadius: '6px',
                          border: '2px solid #6366f1',
                          color: '#6366f1',
                          background: 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => handleEdit(candidate)}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#6366f1';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#6366f1';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn-outline" 
                        style={{ 
                          padding: '0.3rem 0.8rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          borderRadius: '6px',
                          border: '2px solid #ef4444',
                          color: '#ef4444',
                          background: 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => handleDelete(candidate.id)}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#ef4444';
                          e.target.style.color = 'white';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#ef4444';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {candidates.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--gray-500)' }}>No candidates found for this election.</p>
            <button 
              className="btn-primary" 
              style={{ 
                marginTop: '1rem',
                padding: '0.7rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                background: '#6366f1',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
              }}
              onClick={() => setShowForm(true)}
              onMouseEnter={(e) => {
                e.target.style.background = '#4f46e5';
                e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#6366f1';
                e.target.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              + Add First Candidate
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageCandidates;