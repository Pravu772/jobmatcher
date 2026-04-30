import { Lightbulb, Rocket, FileEdit } from 'lucide-react';

export default function Suggestions({ data }) {
  if (!data) return null;
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon"><Lightbulb size={24} color="var(--primary)" /></div>
        <div>
          <div className="card-title">Suggestions</div>
          <div className="card-subtitle">Skills to improve and resume tips</div>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <div className="input-label" style={{ color: 'var(--primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: '6px' }}><Rocket size={16} /> Skills to Improve</div>
          {(data.skillsToImprove || []).map((s, i) => (
            <div key={i} className="tip-item">
              <div className="tip-dot" />
              <span style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{s}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="input-label" style={{ color: 'var(--success)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: '6px' }}><FileEdit size={16} /> Resume Tips</div>
          {(data.resumeTips || []).map((tip, i) => (
            <div key={i} className="tip-item">
              <div className="tip-dot" style={{ background: 'var(--success)' }} />
              <span style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
