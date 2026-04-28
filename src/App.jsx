import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary-500/30">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
