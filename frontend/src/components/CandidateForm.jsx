import { useState } from 'react';
import { addCandidate } from '../api/api';
import toast from 'react-hot-toast';
import { UserPlus, X } from 'lucide-react';

export default function CandidateForm({ onAdded }) {
  const [form, setForm] = useState({ name: '', email: '', experience: '', bio: '' });
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.experience) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }
    setLoading(true);
    try {
      await addCandidate({ ...form, experience: Number(form.experience), skills });
      toast.success(`${form.name} added successfully! 🎉`);
      setForm({ name: '', email: '', experience: '', bio: '' });
      setSkills([]);
      if (onAdded) onAdded();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in">
      <h2 className="card-title">
        <UserPlus size={20} color="var(--accent-light)" />
        Add Candidate
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid form-grid-2" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              className="form-input"
              name="name"
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="rahul@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Experience (years) *</label>
          <input
            className="form-input"
            type="number"
            name="experience"
            placeholder="2"
            min="0"
            value={form.experience}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Skills *</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className="form-input"
              placeholder="Type a skill and press Enter..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
            />
            <button type="button" className="btn btn-secondary" onClick={addSkill}>
              Add
            </button>
          </div>
          <p className="form-hint">Press Enter or comma to add multiple skills</p>
          {skills.length > 0 && (
            <div className="skill-tags" style={{ marginTop: '0.5rem' }}>
              {skills.map((skill) => (
                <span key={skill} className="skill-tag remove-btn" onClick={() => removeSkill(skill)}>
                  {skill} <X size={10} />
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Bio / Projects</label>
          <textarea
            className="form-textarea"
            name="bio"
            placeholder="Brief description of projects, experience, or background..."
            value={form.bio}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? <><div className="spinner" /> Adding...</> : <><UserPlus size={16} /> Add Candidate</>}
        </button>
      </form>
    </div>
  );
}
