import { useState, useEffect } from 'react';

const loadingMessages = [
  "Extracting candidate profile...",
  "Parsing technical and soft skills...",
  "Simulating ATS algorithms...",
  "Searching for top job matches...",
  "Analyzing skill gaps...",
  "Generating personalized learning paths...",
  "Drafting interview questions...",
  "Rewriting resume bullet points...",
  "Finalizing your career report..."
];

export default function LoadingSpinner() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="skeleton-loading-container">
      {/* Central Cycling Loading Messages Card */}
      <div className="loading-card">
        <div className="spinner-ring-wrap">
          <div className="spinner-ring"></div>
          <div className="spinner-icon">⚡</div>
        </div>
        <h3 className="fade-text" key={messageIndex}>
          {loadingMessages[messageIndex]}
        </h3>
        <p>Our AI is analyzing your resume. This usually takes 15–30 seconds.</p>
      </div>

      {/* Pulsing Dashboard Skeleton Background */}
      <div className="skeleton-grid">
        <div className="skeleton-bar-row">
          <div className="skeleton-circle-widget pulse"></div>
          <div className="skeleton-circle-widget pulse"></div>
          <div className="skeleton-circle-widget pulse"></div>
        </div>
        <div className="skeleton-dashboard-cards">
          <div className="skeleton-card pulse" style={{ height: '320px' }}></div>
          <div className="skeleton-card pulse" style={{ height: '320px' }}></div>
        </div>
        <div className="skeleton-card pulse" style={{ height: '240px' }}></div>
      </div>
    </div>
  );
}
