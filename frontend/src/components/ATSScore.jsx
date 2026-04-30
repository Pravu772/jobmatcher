import { useState } from 'react';
import { BarChart, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';

const scoreClass = (s) => s >= 70 ? 'score-high' : s >= 40 ? 'score-mid' : 'score-low';
const pillClass = (s) => s >= 70 ? 'ats-score-high' : s >= 40 ? 'ats-score-mid' : 'ats-score-low';

function ATSCategory({ category, isExpanded, onToggle }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div className="ats-category" onClick={onToggle}>
        <div className="ats-category-title">{category.name}</div>
        <div className="ats-category-right">
          <span className={`ats-score-pill ${pillClass(category.score)}`}>{category.score}%</span>
          <span className="ats-icon" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <ChevronDown size={16} />
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="ats-item-list">
          {category.items.map((item, idx) => (
            <div key={idx} className="ats-check-item">
              <span className={`ats-check-icon ${item.passed ? 'ats-check-pass' : 'ats-check-fail'}`}>
                {item.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              </span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ATSScore({ data }) {
  if (!data || !data.categories) return null;

  const [expandedIndex, setExpandedIndex] = useState(0);

  const toggleCategory = (idx) => {
    setExpandedIndex(expandedIndex === idx ? -1 : idx);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon"><BarChart size={24} color="var(--primary)" /></div>
        <div>
          <div className="card-title">ATS Score</div>
          <div className="card-subtitle">Applicant Tracking System simulation</div>
        </div>
      </div>

      <div className="score-header" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
        <div className={`score-circle ${scoreClass(data.overallScore || 0)}`}>
          {data.overallScore || 0}
          <span className="score-label">/100</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>Overall Match</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Based on format, content, and ATS readability.</div>
        </div>
      </div>

      <div className="ats-categories-container">
        {data.categories.map((category, idx) => (
          <ATSCategory
            key={idx}
            category={category}
            isExpanded={expandedIndex === idx}
            onToggle={() => toggleCategory(idx)}
          />
        ))}
      </div>
    </div>
  );
}
