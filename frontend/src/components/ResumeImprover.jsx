import { PenTool, XCircle, CheckCircle2 } from 'lucide-react';

export default function ResumeImprover({ data }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon"><PenTool size={24} color="var(--primary)" /></div>
        <div>
          <div className="card-title">Resume Improver</div>
          <div className="card-subtitle">AI-rewritten bullet points with impact</div>
        </div>
      </div>

      {data.map((item, i) => (
        <div key={i} className="improve-item">
          <div className="improve-before">
            <div className="improve-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={14} /> Original</div>
            {item.original}
          </div>
          <div className="improve-after">
            <div className="improve-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Improved</div>
            {item.improved}
          </div>
        </div>
      ))}
    </div>
  );
}
