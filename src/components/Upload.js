// src/Upload.js

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Upload.css';

export function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile?.type === 'application/json' || selectedFile?.name.endsWith('.har')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a valid HAR file');
    }
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/json' || droppedFile?.name.endsWith('.har')) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a valid HAR file');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setUploading(true);

    try {
      // Read the file content
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });

      // Parse the HAR content
      const harContent = JSON.parse(fileContent);

      // Send the parsed JSON directly instead of FormData
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/analyze`,
        harContent,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      navigate(`/results/${response.data.jobId}`);
    } catch (err) {
      console.error('Upload error:', err);
      if (err.name === 'SyntaxError') {
        setError('Invalid HAR file format');
      } else {
        setError(err.response?.data?.error || 'Failed to upload file');
      }
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
            <div 
              className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".har,application/json"
                onChange={handleFileChange}
                id="har-file"
                className="file-input"
              />
              <label htmlFor="har-file">
                {file ? (
                  <span className="file-name">{file.name}</span>
                ) : (
                  <>
                    <span className="upload-icon">📁</span>
                    <span className="upload-text">
                      Drop HAR file here or click to browse
                    </span>
                  </>
                )}
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
