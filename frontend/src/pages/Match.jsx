import { useState } from 'react';
import JobMatchForm from '../components/JobMatchForm';
import ShortlistedCandidates from '../components/ShortlistedCandidates';
import MatchScoreChart from '../components/MatchScoreChart';

export default function Match() {
  const [results, setResults] = useState(null);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Smart Matching</h1>
        <p className="page-subtitle">Enter job requirements to find and rank the best candidates</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <JobMatchForm onResults={setResults} />
        </div>
        <div>
          {results ? (
            <>
              <ShortlistedCandidates results={results} />
              <MatchScoreChart data={results.data} />
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Ready to Match</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Fill in the job requirements on the left to start matching candidates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
