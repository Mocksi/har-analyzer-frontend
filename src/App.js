// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './components/Upload';
import Results from './components/Results';
import './App.css';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/results/:jobId" element={<Results />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
