import { useState } from 'react';
import CandidateForm from '../components/CandidateForm';
import CandidateList from '../components/CandidateList';

export default function Candidates() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Candidate Management</h1>
        <p className="page-subtitle">Add and view all candidates in your talent pool</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <CandidateForm onAdded={() => setRefresh((r) => r + 1)} />
        </div>
        <div>
          <CandidateList refreshTrigger={refresh} />
        </div>
      </div>
    </div>
  );
}
