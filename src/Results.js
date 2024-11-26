// src/Results.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Results() {
  const { jobId } = useParams();
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('Processing');

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/results/${jobId}`
        );
        if (response.data.status === 'Processing') {
          setStatus('Processing');
        } else {
          setResult(response.data);
          setStatus('Completed');
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        clearInterval(interval);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [jobId]);

  if (status === 'Processing') {
    return <div>Your request is being processed. Please wait...</div>;
  }

  if (result) {
    return (
      <div>
        <h2>Insights</h2>
        <p>{result.insights}</p>
        {/* Display more details as needed */}
      </div>
    );
  }

  return <div>Error fetching results.</div>;
}

export default Results;
