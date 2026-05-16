import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCandidates } from '../api/api';
import { Users, Briefcase, Brain, ArrowRight, Zap } from 'lucide-react';

export default function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getCandidates().then((res) => setCount(res.data.count)).catch(() => {});
  }, []);

  const features = [
    {
      icon: '👤',
      iconClass: 'indigo',
      title: 'Candidate Management',
      desc: 'Store and manage candidate profiles with skills, experience, and bio.',
      link: '/candidates',
      label: 'Manage Candidates',
    },
    {
      icon: '🎯',
      iconClass: 'green',
      title: 'Smart Matching',
      desc: 'Rank candidates by skill overlap, experience, and preferred skills.',
      link: '/match',
      label: 'Match Now',
    },
    {
      icon: '🤖',
      iconClass: 'purple',
      title: 'AI Shortlisting',
      desc: 'Let Llama 3.3 AI analyze and rank candidates with detailed explanations.',
      link: '/ai',
      label: 'Try AI',
    },
  ];

  return (
    <div className="page-content">
      {/* Hero */}
      <div className="fade-in" style={{ textAlign: 'center', padding: '3rem 0 2.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: '999px', padding: '0.35rem 1rem', marginBottom: '1.5rem',
          fontSize: '0.8rem', color: 'var(--accent-light)', fontWeight: 600
        }}>
          <Zap size={13} /> Powered by OpenRouter AI
        </div>
        <h1 className="page-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
          Find the Perfect Candidate<br />with AI Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '540px', margin: '0 auto 2rem' }}>
          Filter, rank, and shortlist candidates based on skill matching and AI-powered analysis — in seconds.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/candidates" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}>
            <Users size={18} /> Get Started
          </Link>
          <Link to="/ai" className="btn btn-secondary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}>
            <Brain size={18} /> Try AI Shortlist
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid fade-in-delay-1">
        <div className="stat-card">
          <div className="stat-icon indigo"><Users size={22} color="var(--accent)" /></div>
          <div>
            <div className="stat-value">{count}</div>
            <div className="stat-label">Total Candidates</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Briefcase size={22} color="var(--green)" /></div>
          <div>
            <div className="stat-value">4</div>
            <div className="stat-label">API Endpoints</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Brain size={22} color="var(--purple)" /></div>
          <div>
            <div className="stat-value">AI</div>
            <div className="stat-label">Llama 3.3 Powered</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><Zap size={22} color="var(--yellow)" /></div>
          <div>
            <div className="stat-value">Live</div>
            <div className="stat-label">Real-time Results</div>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="fade-in-delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {features.map((f) => (
          <div key={f.title} className="card" style={{ cursor: 'default' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div className={`stat-icon ${f.iconClass}`} style={{ fontSize: '1.4rem' }}>{f.icon}</div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.4rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
            <Link to={f.link} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              {f.label} <ArrowRight size={15} />
            </Link>
          </div>
        ))}
      </div>

      {/* API Reference */}
      <div className="card fade-in-delay-3" style={{ marginTop: '1.5rem' }}>
        <h2 className="card-title">📡 API Endpoints</h2>
        <div style={{ display: 'grid', gap: '0.6rem' }}>
          {[
            { method: 'POST', path: '/api/candidates', desc: 'Add a new candidate' },
            { method: 'GET', path: '/api/candidates', desc: 'Get all candidates (with search/filter)' },
            { method: 'POST', path: '/api/match', desc: 'Basic skill + experience matching' },
            { method: 'POST', path: '/api/ai/shortlist', desc: 'AI-powered candidate ranking' },
          ].map((ep) => (
            <div key={ep.path} style={{
              display: 'flex', gap: '0.75rem', alignItems: 'center',
              background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)',
              padding: '0.6rem 0.875rem', fontSize: '0.85rem'
            }}>
              <span className={`badge ${ep.method === 'GET' ? 'badge-green' : 'badge-accent'}`} style={{ fontFamily: 'monospace', minWidth: '44px', justifyContent: 'center' }}>
                {ep.method}
              </span>
              <code style={{ color: 'var(--accent-light)', flex: 1 }}>{ep.path}</code>
              <span style={{ color: 'var(--text-muted)' }}>{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
