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
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner-ring"></div>
        <div className="spinner-ring-inner"></div>
        <div className="spinner-icon">✨</div>
      </div>
      <div className="spinner-text fade-text" key={messageIndex}>
        {loadingMessages[messageIndex]}
      </div>
      <div className="spinner-sub">
        Our AI is carefully reading your resume. This usually takes 15–30 seconds.
      </div>
    </div>
  );
}
