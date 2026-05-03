import { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FileText, UploadCloud, CheckCircle2 } from 'lucide-react';

export default function ResumeUploader({ resumeText, setResumeText }) {
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFile = async (file) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!file) return;
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
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed.');
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
          <div className="card-subtitle">Upload your PDF resume</div>
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
        <h3>Drag & drop your PDF here</h3>
        <p>or click to browse your files</p>
        <button className="btn-outline" type="button" onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}>
          {uploading ? 'Uploading…' : 'Choose File'}
        </button>
        <input ref={fileRef} type="file" accept=".pdf,.txt" onChange={(e) => handleFile(e.target.files[0])} />
      </div>

      {fileName && (
        <div className="file-selected" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {fileName}
        </div>
      )}
    </div>
  );
}
