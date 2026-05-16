import { Clock, CheckCircle, XCircle } from 'lucide-react';

const tierColor = {
  High: 'green',
  Medium: 'yellow',
  Low: 'red',
};

const scoreRingClass = {
  High: 'high',
  Medium: 'medium',
  Low: 'low',
};

const progressColor = {
  High: 'var(--green)',
  Medium: 'var(--yellow)',
  Low: 'var(--red)',
};

export default function ShortlistedCandidates({ results }) {
  if (!results) return null;

  const { data, jobRequirements, totalCandidates } = results;

  return (
    <div className="fade-in-delay-1">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Match Results
          <span className="badge badge-accent" style={{ marginLeft: '0.75rem', verticalAlign: 'middle' }}>
            {totalCandidates} candidates
          </span>
        </h2>
      </div>

      {/* Job summary */}
      <div style={{
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 'var(--radius-md)',
        padding: '0.875rem 1.25rem',
        marginBottom: '1.25rem',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <span><strong style={{ color: 'var(--text-primary)' }}>Required:</strong> {jobRequirements.requiredSkills.join(', ')}</span>
        <span><strong style={{ color: 'var(--text-primary)' }}>Min Exp:</strong> {jobRequirements.minExperience}y</span>
        {jobRequirements.preferredSkills?.length > 0 && (
          <span><strong style={{ color: 'var(--text-primary)' }}>Preferred:</strong> {jobRequirements.preferredSkills.join(', ')}</span>
        )}
      </div>

      {data.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No candidates found</h3>
          <p>Try adjusting the skill requirements or add more candidates.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {data.map((c, i) => (
            <div key={c._id} className="match-card" style={{ animationDelay: `${i * 0.07}s` }}>
              {/* Rank number */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--bg-card-hover)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)',
                flexShrink: 0
              }}>#{i + 1}</div>

              {/* Score ring */}
              <div className={`score-ring ${scoreRingClass[c.tier]}`}>
                {c.matchScore}%
              </div>

              <div className="match-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="match-card-name">{c.name}</div>
                    <div className="match-card-meta">
                      <span>{c.email}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {c.experience}y exp
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {c.meetsExperience
                          ? <CheckCircle size={12} color="var(--green)" />
                          : <XCircle size={12} color="var(--red)" />}
                        {c.meetsExperience ? 'Meets exp.' : 'Below exp.'}
                      </span>
                    </div>
                  </div>
                  <span className={`badge badge-${tierColor[c.tier]}`}>{c.tier} Match</span>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    <span>Skill Match</span>
                    <span>{c.requiredScore}%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{
                      width: `${c.requiredScore}%`,
                      background: progressColor[c.tier]
                    }} />
                  </div>
                </div>

                {/* Skills */}
                <div className="skill-tags">
                  {c.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`skill-tag ${c.matchedRequired.map(s => s.toLowerCase()).includes(skill.toLowerCase()) ? 'matched' : ''}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {c.matchedPreferred?.length > 0 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--yellow)', marginTop: '0.5rem' }}>
                    ⭐ Bonus preferred skills: {c.matchedPreferred.join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
