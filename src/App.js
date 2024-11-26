// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './Upload';
import Results from './Results';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/results/:jobId" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
