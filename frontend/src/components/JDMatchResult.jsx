import { Target, ClipboardList, CheckCircle2, XCircle } from 'lucide-react';

const scoreClass = (s) => s >= 70 ? 'score-high' : s >= 40 ? 'score-mid' : 'score-low';
const fillColor = (s) => s >= 70 ? 'fill-success' : s >= 40 ? 'fill-warning' : 'fill-error';

export default function JDMatchResult({ data, hasJD }) {
  if (!hasJD) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-icon"><Target size={24} color="var(--primary)" /></div>
          <div><div className="card-title">JD Match Analysis</div></div>
        </div>
        <div className="no-jd">
          <div className="no-jd-icon"><ClipboardList size={48} color="var(--text-muted)" style={{ marginBottom: '10px' }} /></div>
          <p>No Job Description provided.<br />Paste a JD above to get a detailed match score.</p>
        </div>
      </div>
    );
  }

  if (!data || data.score === undefined) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-icon"><Target size={24} color="var(--primary)" /></div>
          <div><div className="card-title">JD Match Analysis</div></div>
        </div>
        <div className="no-jd"><p>JD match data unavailable.</p></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon"><Target size={24} color="var(--primary)" /></div>
        <div>
          <div className="card-title">JD Match Analysis</div>
          <div className="card-subtitle">How well your resume matches the job</div>
        </div>
      </div>

      <div className="score-header" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div className={`score-circle ${scoreClass(data.score)}`}>
          {data.score}<span className="score-label">/100</span>
        </div>
        <div style={{ flex: 1 }}>
          <div className="progress-wrap">
            <div className="progress-label"><span>JD Match Score</span><span>{data.score}%</span></div>
            <div className="progress-track">
              <div className={`progress-fill ${fillColor(data.score)}`} style={{ width: `${data.score}%` }} />
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', marginBottom: 14 }}>{data.explanation}</p>

      {(data.matchingSkills || []).length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div className="input-label" style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} /> Matching Skills</div>
          <div className="chip-group">{(data.matchingSkills || []).map(s => <span key={s} className="chip chip-green">{s}</span>)}</div>
        </div>
      )}
      {(data.missingSkills || []).length > 0 && (
        <div>
          <div className="input-label" style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '6px' }}><XCircle size={16} /> Missing Skills</div>
          <div className="chip-group">{(data.missingSkills || []).map(s => <span key={s} className="chip chip-red">{s}</span>)}</div>
        </div>
      )}
    </div>
  );
}
