import { useState } from 'react';
import { Mic, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

export default function InterviewPrep({ data }) {
  const [openIdx, setOpenIdx] = useState(null);
  if (!data || data.length === 0) return null;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon"><Mic size={24} color="var(--primary)" /></div>
        <div>
          <div className="card-title">Interview Preparation</div>
          <div className="card-subtitle">AI-generated questions & model answers</div>
        </div>
      </div>

      {data.map((qa, i) => (
        <div key={i} className="qa-item">
          <div className="qa-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
            <span>Q{i + 1}: {qa.question}</span>
            <span>{openIdx === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
          </div>
          {openIdx === i && (
            <div className="qa-answer" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Lightbulb size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{qa.answer}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
