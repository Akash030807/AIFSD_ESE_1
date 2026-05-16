import { useState, useEffect, useCallback } from 'react';
import { getCandidates, deleteCandidate } from '../api/api';
import toast from 'react-hot-toast';
import { Trash2, Search, Clock, Code2 } from 'lucide-react';

export default function CandidateList({ refreshTrigger }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      const res = await getCandidates(params);
      setCandidates(res.data.data);
    } catch {
      toast.error('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates, refreshTrigger]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await deleteCandidate(id);
      toast.success(`${name} removed`);
      fetchCandidates();
    } catch {
      toast.error('Failed to delete candidate');
    }
  };

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="card fade-in-delay-1">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 className="card-title" style={{ marginBottom: 0 }}>
          <Code2 size={20} color="var(--accent-light)" />
          All Candidates
          <span className="badge badge-accent" style={{ marginLeft: '0.5rem' }}>
            {candidates.length}
          </span>
        </h2>
      </div>

      <div className="search-bar" style={{ marginBottom: '1.25rem' }}>
        <Search className="search-icon" size={16} />
        <input
          className="form-input"
          style={{ paddingLeft: '2.5rem' }}
          placeholder="Search by name, email, bio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <span>Loading candidates...</span>
        </div>
      ) : candidates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No candidates yet</h3>
          <p>Add your first candidate using the form.</p>
        </div>
      ) : (
        <div className="candidates-grid">
          {candidates.map((c, i) => (
            <div
              key={c._id}
              className="candidate-card"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="candidate-card-header">
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div className="candidate-avatar">{getInitials(c.name)}</div>
                  <div>
                    <div className="candidate-name">{c.name}</div>
                    <div className="candidate-email">{c.email}</div>
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(c._id, c.name)}
                  title="Delete candidate"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="candidate-exp">
                <Clock size={12} />
                {c.experience} year{c.experience !== 1 ? 's' : ''} experience
              </div>

              {c.bio && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.5rem 0', lineHeight: 1.5 }}>
                  {c.bio.length > 80 ? c.bio.slice(0, 80) + '…' : c.bio}
                </p>
              )}

              <div className="skill-tags">
                {c.skills.map((skill) => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
