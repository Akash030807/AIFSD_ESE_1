import { Brain, Trophy, Star, AlertTriangle, HelpCircle } from 'lucide-react';

const tierColor = { High: 'green', Medium: 'yellow', Low: 'red' };

export default function AIRecommendations({ results }) {
  if (!results) return null;

  const { data, summary, topPick, topPickReason, jobRequirements } = results;

  return (
    <div className="fade-in-delay-1">
      {/* Summary box */}
      {summary && (
        <div className="summary-box" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Brain size={18} color="var(--purple)" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>AI Analysis Summary</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{summary}</p>
        </div>
      )}

      {/* Top pick banner */}
      {topPick && (
        <div className="top-pick-banner">
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--green), #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Trophy size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              🏆 AI Top Pick
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--green)' }}>{topPick}</div>
            {topPickReason && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{topPickReason}</div>
            )}
          </div>
        </div>
      )}

      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Star size={18} color="var(--purple)" /> AI-Ranked Candidates
        <span className="badge badge-purple" style={{ marginLeft: '0.25rem' }}>{data.length}</span>
      </h2>

      {data.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤖</div>
          <h3>No AI results</h3>
          <p>Make sure candidates exist in the database and try again.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.map((item, i) => (
            <div key={i} className="ai-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="ai-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div className="rank-badge">#{item.rank}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{item.name}</div>
                    {item.candidateData && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {item.candidateData.email} · {item.candidateData.experience}y exp
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.25rem', color: item.tier === 'High' ? 'var(--green)' : item.tier === 'Medium' ? 'var(--yellow)' : 'var(--red)' }}>
                    {item.score}%
                  </span>
                  <span className={`badge badge-${tierColor[item.tier] || 'accent'}`}>{item.tier}</span>
                </div>
              </div>

              {/* AI Reason */}
              {item.reason && (
                <div className="ai-reason">
                  <Brain size={13} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
                  {item.reason}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {/* Strengths */}
                {item.strengths?.length > 0 && (
                  <div>
                    <div className="ai-section-title" style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Star size={11} /> Strengths
                    </div>
                    {item.strengths.map((s, j) => (
                      <div key={j} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: 'var(--green)' }}>✓</span> {s}
                      </div>
                    ))}
                  </div>
                )}
                {/* Gaps */}
                {item.gaps?.length > 0 && (
                  <div>
                    <div className="ai-section-title" style={{ color: 'var(--yellow)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertTriangle size={11} /> Gaps
                    </div>
                    {item.gaps.map((g, j) => (
                      <div key={j} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: 'var(--yellow)' }}>△</span> {g}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interview Questions */}
              {item.interviewQuestions?.length > 0 && (
                <div>
                  <div className="ai-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <HelpCircle size={11} /> AI-Generated Interview Questions
                  </div>
                  {item.interviewQuestions.map((q, j) => (
                    <div key={j} className="interview-question">Q{j + 1}. {q}</div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {item.candidateData?.skills?.length > 0 && (
                <div className="skill-tags" style={{ marginTop: '0.75rem' }}>
                  {item.candidateData.skills.map((skill) => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
