import { useState, useEffect } from 'react';
import { FileText, Cpu, Target, FileCheck, CheckCircle2, Sparkles } from 'lucide-react';
import './LoadingSpinner.css';

const steps = [
  { id: 'extract', label: 'Extracting Profile', icon: FileText },
  { id: 'parse', label: 'Parsing Skills', icon: Cpu },
  { id: 'simulate', label: 'Simulating ATS', icon: Target },
  { id: 'finalize', label: 'Finalizing Report', icon: FileCheck },
];

export default function LoadingSpinner() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    // 4 steps, let's take ~4s per step to simulate thorough analysis
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ai-visualizer-container">
      {/* Background ambient orbs */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>
      
      <div className="glass-panel">
        <div className="ai-header">
          <div className="ai-pulse-ring">
            <div className="ai-core">
              <Sparkles className="ai-core-icon" />
            </div>
          </div>
          <h2>AI Analysis in Progress</h2>
          <p>Please wait while we evaluate your profile against industry standards...</p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < activeStepIndex;
            const isActive = index === activeStepIndex;
            const isPending = index > activeStepIndex;

            let statusClass = "step-pending";
            if (isCompleted) statusClass = "step-completed";
            if (isActive) statusClass = "step-active";

            return (
              <div key={step.id} className={`step-indicator ${statusClass}`}>
                <div className="step-icon-wrapper">
                  {isCompleted ? <CheckCircle2 className="step-icon check-icon" /> : <Icon className="step-icon" />}
                  {isActive && <div className="active-glow-ring"></div>}
                </div>
                <div className="step-text">
                  <span className="step-label">{step.label}</span>
                  <span className="step-status">
                    {isCompleted && "Complete"}
                    {isActive && "Processing..."}
                    {isPending && "Waiting"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
