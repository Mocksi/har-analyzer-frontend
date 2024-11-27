// src/Upload.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Upload.css';

export function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('harFile', file);
    formData.append('persona', 'developer');

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
      setUploading(false);
    }
  };

  return (
    <div className="landing-container">
      <div className="instructions-panel">
        <h1>HAR File Analyzer</h1>
        <h2>How to Generate a HAR File</h2>
        
        <div className="instruction-step">
          <h3>1. Open Developer Tools</h3>
          <p>
            <kbd>Chrome</kbd>: Press <kbd>F12</kbd> or <kbd>Ctrl+Shift+I</kbd> (Windows) / 
            <kbd>Cmd+Option+I</kbd> (Mac)
          </p>
        </div>

        <div className="instruction-step">
          <h3>2. Prepare for Recording</h3>
          <ul>
            <li>Go to the <strong>Network</strong> tab</li>
            <li>Ensure <strong>Preserve log</strong> is checked</li>
            <li>Clear any existing entries (🗑️ icon)</li>
          </ul>
        </div>

        <div className="instruction-step">
          <h3>3. Record Your Session</h3>
          <ul>
            <li>Navigate to your application</li>
            <li>Perform the user journey you want to analyze</li>
            <li>Include multiple page loads and interactions</li>
            <li>The more actions, the better the analysis</li>
          </ul>
        </div>

        <div className="instruction-step">
          <h3>4. Export the HAR File</h3>
          <ul>
            <li>Right-click anywhere in the Network panel</li>
            <li>Select <strong>"Save all as HAR with content"</strong></li>
            <li>Choose a location to save the file</li>
          </ul>
        </div>

        <div className="pro-tips">
          <h3>💡 Pro Tips</h3>
          <ul>
            <li>Record complete user flows for best results</li>
            <li>Include error scenarios if possible</li>
            <li>Test different network conditions</li>
            <li>Capture both successful and failed requests</li>
          </ul>
        </div>
      </div>

      <div className="upload-panel">
        <div className="upload-content">
          <h2>Upload HAR File</h2>
          <p>Analyze your application's performance with AI-powered insights</p>
          
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="file-drop-zone">
              <input
                type="file"
                accept=".har"
                onChange={handleFileChange}
                id="har-file"
              />
              <label htmlFor="har-file">
                {file ? file.name : 'Drop HAR file here or click to browse'}
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              disabled={!file || uploading}
              className="upload-button"
            >
              {uploading ? 'Analyzing...' : 'Analyze HAR File'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;
