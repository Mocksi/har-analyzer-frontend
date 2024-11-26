// src/Upload.js

import React, { useState } from 'react';
import axios from 'axios';
import './Upload.css';

function Upload() {
  const [file, setFile] = useState(null);
  const [persona, setPersona] = useState('Developer');
  const [jobId, setJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a HAR file');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('harfile', file);
    formData.append('persona', persona);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload`,
        formData
      );
      setJobId(response.data.jobId);
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading file');
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const personas = [
    { value: 'Developer', description: 'Focus on performance optimization and debugging' },
    { value: 'QA Professional', description: 'Emphasis on testing and quality assurance' },
    { value: 'Sales Engineer', description: 'Business-focused insights and demonstrations' }
  ];

  if (jobId) {
    window.location.href = `/results/${jobId}`;
  }

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
            {personas.map(p => (
              <option key={p.value} value={p.value}>{p.value}</option>
            ))}
          </select>
          <p className="persona-description">
            {personas.find(p => p.value === persona)?.description}
          </p>
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
