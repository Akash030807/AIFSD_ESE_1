import { useState } from 'react';
import { matchCandidates } from '../api/api';
import toast from 'react-hot-toast';
import { Briefcase, X, Search } from 'lucide-react';

export default function JobMatchForm({ onResults }) {
  const [requiredInput, setRequiredInput] = useState('');
  const [preferredInput, setPreferredInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);
  const [minExperience, setMinExperience] = useState('');
  const [loading, setLoading] = useState(false);

  const addToList = (value, list, setList) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) setList([...list, trimmed]);
  };

  const handleKeyDown = (e, input, list, setList, setInput) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addToList(input, list, setList);
      setInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requiredSkills.length === 0) {
      toast.error('Add at least one required skill');
      return;
    }
    setLoading(true);
    try {
      const res = await matchCandidates({
        requiredSkills,
        minExperience: Number(minExperience) || 0,
        preferredSkills,
      });
      onResults(res.data);
      toast.success(`Found ${res.data.totalCandidates} candidate(s)!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Matching failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in">
      <h2 className="card-title">
        <Briefcase size={20} color="var(--accent-light)" />
        Job Requirements
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Required Skills *</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className="form-input"
              placeholder="e.g. React, Node.js..."
              value={requiredInput}
              onChange={(e) => setRequiredInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, requiredInput, requiredSkills, setRequiredSkills, setRequiredInput)}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { addToList(requiredInput, requiredSkills, setRequiredSkills); setRequiredInput(''); }}
            >
              Add
            </button>
          </div>
          {requiredSkills.length > 0 && (
            <div className="skill-tags">
              {requiredSkills.map((s) => (
                <span key={s} className="skill-tag remove-btn" onClick={() => setRequiredSkills(requiredSkills.filter((x) => x !== s))}>
                  {s} <X size={10} />
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Preferred Skills (bonus)</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className="form-input"
              placeholder="e.g. AWS, Docker..."
              value={preferredInput}
              onChange={(e) => setPreferredInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, preferredInput, preferredSkills, setPreferredSkills, setPreferredInput)}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { addToList(preferredInput, preferredSkills, setPreferredSkills); setPreferredInput(''); }}
            >
              Add
            </button>
          </div>
          {preferredSkills.length > 0 && (
            <div className="skill-tags">
              {preferredSkills.map((s) => (
                <span key={s} className="skill-tag" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--yellow)', borderColor: 'rgba(245,158,11,0.25)' }} onClick={() => setPreferredSkills(preferredSkills.filter((x) => x !== s))}>
                  {s} <X size={10} />
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Minimum Experience (years)</label>
          <input
            className="form-input"
            type="number"
            placeholder="0"
            min="0"
            value={minExperience}
            onChange={(e) => setMinExperience(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? <><div className="spinner" /> Matching...</> : <><Search size={16} /> Find Best Candidates</>}
        </button>
      </form>
    </div>
  );
}
