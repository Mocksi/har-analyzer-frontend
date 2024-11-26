// src/Upload.js

import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  const [file, setFile] = useState(null);
  const [persona, setPersona] = useState('Developer');
  const [jobId, setJobId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

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
      console.error('Error uploading file:', error);
    }
  };

  if (jobId) {
    // Redirect to results page
    window.location.href = `/results/${jobId}`;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select Persona:
        <select value={persona} onChange={(e) => setPersona(e.target.value)}>
          <option value="Developer">Developer</option>
          <option value="QA Professional">QA Professional</option>
          <option value="Sales Engineer">Sales Engineer</option>
          {/* Add more personas as needed */}
        </select>
      </label>
      <br />
      <label>
        Upload HAR File:
        <input
          type="file"
          accept=".har"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Upload;
