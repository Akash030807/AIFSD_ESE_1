import { useState } from 'react';
import { aiShortlist } from '../api/api';
import toast from 'react-hot-toast';
import AIRecommendations from '../components/AIRecommendations';
import { Brain, X, Sparkles } from 'lucide-react';

export default function AIShortlist() {
  const [requiredInput, setRequiredInput] = useState('');
  const [preferredInput, setPreferredInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);
  const [minExperience, setMinExperience] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

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
    setResults(null);
    try {
      const res = await aiShortlist({
        requiredSkills,
        minExperience: Number(minExperience) || 0,
        preferredSkills,
        jobTitle,
        jobDescription,
      });
      setResults(res.data);
      toast.success('AI analysis complete! 🤖');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI shortlisting failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">AI Shortlisting</h1>
        <p className="page-subtitle">Let Llama 3.3 AI analyze and intelligently rank your candidates</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* Form */}
        <div className="card fade-in">
          <h2 className="card-title">
            <Brain size={20} color="var(--purple)" />
            AI Job Input
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Job Title</label>
              <input className="form-input" placeholder="e.g. Senior Full Stack Developer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Required Skills *</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  className="form-input"
                  placeholder="React, Node.js..."
                  value={requiredInput}
                  onChange={(e) => setRequiredInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, requiredInput, requiredSkills, setRequiredSkills, setRequiredInput)}
                />
                <button type="button" className="btn btn-secondary" onClick={() => { addToList(requiredInput, requiredSkills, setRequiredSkills); setRequiredInput(''); }}>Add</button>
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
              <label className="form-label">Preferred Skills</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  className="form-input"
                  placeholder="AWS, Docker..."
                  value={preferredInput}
                  onChange={(e) => setPreferredInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, preferredInput, preferredSkills, setPreferredSkills, setPreferredInput)}
                />
                <button type="button" className="btn btn-secondary" onClick={() => { addToList(preferredInput, preferredSkills, setPreferredSkills); setPreferredInput(''); }}>Add</button>
              </div>
              {preferredSkills.length > 0 && (
                <div className="skill-tags">
                  {preferredSkills.map((s) => (
                    <span key={s} className="skill-tag" onClick={() => setPreferredSkills(preferredSkills.filter((x) => x !== s))}>
                      {s} <X size={10} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Min Experience (years)</label>
              <input className="form-input" type="number" placeholder="0" min="0" value={minExperience} onChange={(e) => setMinExperience(e.target.value)} />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Job Description (optional)</label>
              <textarea className="form-textarea" placeholder="Describe the role, responsibilities, team..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-green" disabled={loading} style={{ width: '100%' }}>
              {loading
                ? <><div className="spinner" /> Analyzing with AI...</>
                : <><Sparkles size={16} /> Run AI Analysis</>}
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
              Powered by Llama 3.3 · OpenRouter AI
            </p>
          </form>
        </div>

        {/* Results */}
        <div>
          {loading ? (
            <div className="card">
              <div className="loading-state">
                <div className="spinner" />
                <div>
                  <p style={{ fontWeight: 600 }}>AI is analyzing candidates...</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>This may take a few seconds</p>
                </div>
              </div>
            </div>
          ) : results ? (
            <AIRecommendations results={results} />
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ marginBottom: '0.5rem' }}>AI Ready</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Fill in the job requirements and click "Run AI Analysis" to get intelligent candidate rankings with detailed explanations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
