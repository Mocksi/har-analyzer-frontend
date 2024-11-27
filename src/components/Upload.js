// src/Upload.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Upload.css';

function Upload() {
  const [file, setFile] = useState(null);
  const [persona, setPersona] = useState('developer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('harFile', file);
    formData.append('persona', persona);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/analyze`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      navigate(`/results/${response.data.jobId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>HAR File Analyzer</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Select Your Role:</label>
          <select 
            value={persona} 
            onChange={(e) => setPersona(e.target.value)}
            className="persona-select"
          >
            <option value="developer">Developer</option>
            <option value="performance">Performance Engineer</option>
            <option value="security">Security Analyst</option>
          </select>
        </div>

        <div className="form-group">
          <label>Upload HAR File:</label>
          <input
            type="file"
            accept=".har"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          disabled={loading || !file}
          className="submit-button"
        >
          {loading ? 'Processing...' : 'Analyze HAR File'}
        </button>
      </form>
    </div>
  );
}

export default Upload;
