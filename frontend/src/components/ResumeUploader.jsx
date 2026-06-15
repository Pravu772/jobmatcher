import { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FileText, UploadCloud, CheckCircle2, AlertTriangle } from 'lucide-react';

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ['application/pdf', 'text/plain'];
const ALLOWED_EXTENSIONS = ['.pdf', '.txt'];

export default function ResumeUploader({ resumeText, setResumeText }) {
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  // Fix #4 — inline error instead of alert()
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef();

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFile = async (file) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!file) return;

    // Fix #5 — client-side file validation
    setUploadError('');
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      setUploadError('Invalid file type. Please upload a PDF or TXT file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadError(`File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      setResumeText(res.data.resumeText);
      setFileName(file.name);
      setUploadError('');
    } catch (err) {
      // Fix #4 — show inline error banner instead of alert()
      setUploadError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon"><FileText size={24} color="var(--primary)" /></div>
        <div>
          <div className="card-title">Upload Resume</div>
          <div className="card-subtitle">PDF or TXT · Max {MAX_FILE_SIZE_MB}MB</div>
        </div>
      </div>

      <div
        className={`upload-zone${dragOver ? ' drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current.click()}
      >
        <div className="upload-icon" style={{ display: 'flex', justifyContent: 'center', color: 'var(--primary)', opacity: 0.8 }}><UploadCloud size={48} /></div>
        <h3>Drag &amp; drop your PDF here</h3>
        <p>or click to browse your files</p>
        <button className="btn-outline" type="button" onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}>
          {uploading ? 'Uploading…' : 'Choose File'}
        </button>
        <input ref={fileRef} type="file" accept=".pdf,.txt" onChange={(e) => handleFile(e.target.files[0])} />
      </div>

      {/* Fix #4 — inline error banner */}
      {uploadError && (
        <div className="upload-error-banner">
          <AlertTriangle size={16} />
          <span>{uploadError}</span>
        </div>
      )}

      {fileName && !uploadError && (
        <div className="file-selected" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {fileName}
        </div>
      )}
    </div>
  );
}
