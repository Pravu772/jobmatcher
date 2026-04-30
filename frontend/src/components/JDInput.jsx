import { ClipboardList, CheckCircle2 } from 'lucide-react';

export default function JDInput({ jobDescription, setJobDescription }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon"><ClipboardList size={24} color="var(--primary)" /></div>
        <div>
          <div className="card-title">Job Description <span className="optional-tag">Optional</span></div>
          <div className="card-subtitle">Paste the JD to get a match score</div>
        </div>
      </div>
      <div className="input-label">Job Description</div>
      <textarea
        className="jd-input"
        placeholder="Paste the job description here to get a detailed JD match score, missing skills, and tailored recommendations..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      {jobDescription && (
        <div style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={16} /> JD provided — match analysis will be included
        </div>
      )}
    </div>
  );
}
