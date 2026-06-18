import React from 'react';

const CandidateCard = ({ candidate, onVote, hasVoted }) => {
  return (
    <div 
      className="candidate-card" 
      style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid var(--gray-200)',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = '#6366f1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        e.currentTarget.style.borderColor = 'var(--gray-200)';
      }}
    >
      <div 
        className="candidate-header" 
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          padding: '1.5rem 1rem',
          textAlign: 'center',
          color: 'white'
        }}
      >
        <div 
          className="candidate-avatar" 
          style={{
            width: '70px',
            height: '70px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 0.75rem',
            fontWeight: 'bold',
            border: '2px solid rgba(255,255,255,0.3)'
          }}
        >
          {candidate?.name?.charAt(0) || '?'}
        </div>
        <div 
          className="candidate-name" 
          style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '0.2rem'
          }}
        >
          {candidate?.name || 'Unknown'}
        </div>
        <div 
          className="candidate-party" 
          style={{
            fontSize: '0.8rem',
            opacity: '0.9'
          }}
        >
          {candidate?.party || 'Independent'}
        </div>
      </div>
      <div 
        className="candidate-body" 
        style={{
          padding: '1rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <p 
          className="candidate-manifesto" 
          style={{
            fontSize: '0.85rem',
            color: 'var(--gray-600)',
            marginBottom: '1rem',
            lineHeight: '1.5',
            flex: 1
          }}
        >
          {candidate?.manifesto || "Vote for positive change!"}
        </p>
        <button 
          className="vote-btn" 
          onClick={() => {
            if (onVote) onVote(candidate?.id);
          }}
          disabled={hasVoted}
          style={{
            width: '100%',
            padding: '0.6rem',
            fontSize: '0.95rem',
            fontWeight: '600',
            borderRadius: '8px',
            border: 'none',
            background: hasVoted ? '#94a3b8' : '#6366f1',
            color: 'white',
            cursor: hasVoted ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!hasVoted) {
              e.target.style.background = '#4f46e5';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!hasVoted) {
              e.target.style.background = '#6366f1';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {hasVoted ? '✓ Already Voted' : '🗳️ Vote Now'}
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;