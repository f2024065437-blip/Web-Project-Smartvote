import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }
    
    // In a real app, you would send this to an API
    setSubmitted(true);
    setError('');
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Contact Us</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>Have questions? We're here to help!</p>
        
        <div className="card">
          {submitted && (
            <div style={{ background: '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              ✓ Message sent successfully! We'll get back to you soon.
            </div>
          )}
          
          {error && (
            <div style={{ background: '#fee', color: '#c00', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
                placeholder="Your full name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input 
                type="email" 
                className="form-input" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
                placeholder="you@example.com"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="What is this regarding?"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea 
                className="form-input" 
                rows="5" 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required 
                placeholder="Your message here..."
              />
            </div>
            
          <button 
  type="submit" 
  className="btn-primary" 
  style={{
    width: '100%',
    padding: '0.75rem',
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
  onMouseEnter={(e) => {
    e.target.style.background = '#4f46e5';
    e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
    e.target.style.transform = 'translateY(-1px)';
  }}
  onMouseLeave={(e) => {
    e.target.style.background = '#6366f1';
    e.target.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.3)';
    e.target.style.transform = 'translateY(0)';
  }}
>
  Send Message
</button>
          </form>
          
          <hr style={{ margin: '2rem 0' }} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <h4>📍 Address</h4>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                123 Voting Street<br/>Karachi, Pakistan
              </p>
            </div>
            <div>
              <h4>📧 Email</h4>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                support@smartvote.com
              </p>
            </div>
            <div>
              <h4>📞 Phone</h4>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                +92 300 1234567
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;