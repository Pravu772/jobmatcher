import { BookOpen, Clock, Book } from 'lucide-react';

const levelColor = { Beginner: 'chip-green', Intermediate: 'chip-yellow', Advanced: 'chip-red' };

export default function LearningPath({ data }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon"><BookOpen size={24} color="var(--primary)" /></div>
        <div>
          <div className="card-title">Learning Path</div>
          <div className="card-subtitle">Beginner → Intermediate → Advanced roadmap</div>
        </div>
      </div>

      <div style={{ paddingLeft: 8 }}>
        {data.map((step, i) => (
          <div key={i} className="step-item">
            <div className="step-num">{step.step}</div>
            <div className="step-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className="step-topic">{step.topic}</span>
                <span className={`chip ${levelColor[step.level] || 'chip-blue'}`}>{step.level}</span>
              </div>
              <div className="step-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {step.estimatedTime}</div>
              {(step.resources || []).length > 0 && (
                <div className="step-resources">
                  {(step.resources || []).map((r, j) => (
                    <span key={j} className="chip chip-gray" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Book size={12} /> {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
