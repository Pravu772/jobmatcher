import { Search, CheckCircle2 } from 'lucide-react';

const fillColor = (s) => s >= 70 ? 'fill-success' : s >= 40 ? 'fill-warning' : 'fill-error';
const priorityChip = (p) => p === 'High' ? 'chip-red' : p === 'Medium' ? 'chip-yellow' : 'chip-gray';

export default function SkillGap({ data }) {
  if (!data) return null;
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon"><Search size={24} color="var(--primary)" /></div>
        <div>
          <div className="card-title">Skill Gap Analysis</div>
          <div className="card-subtitle">Missing skills by priority</div>
        </div>
      </div>

      <div className="progress-wrap" style={{ marginBottom: 20 }}>
        <div className="progress-label">
          <span>Skill Coverage</span><span>{data.coveragePercent || 0}%</span>
        </div>
        <div className="progress-track">
          <div className={`progress-fill ${fillColor(data.coveragePercent || 0)}`} style={{ width: `${data.coveragePercent || 0}%` }} />
        </div>
      </div>

      {(data.missingSkills || []).length > 0 ? (
        <div>
          <div className="input-label">Missing Skills</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {(data.missingSkills || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--card-bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{item.skill}</span>
                <span className={`chip ${priorityChip(item.priority)}`}>{item.priority}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--success)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={18} /> Great skill coverage! No major gaps found.
        </p>
      )}
    </div>
  );
}
