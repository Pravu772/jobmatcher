import { Download } from 'lucide-react';

export default function DownloadReportBtn({ analysisId }) {
  const handleDownload = () => {
    window.open(`/api/generate-report/${analysisId}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <button className="btn-download" onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Download size={18} /> Download PDF Report
      </button>
    </div>
  );
}
