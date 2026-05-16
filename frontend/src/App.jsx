import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Candidates from './pages/Candidates';
import Match from './pages/Match';
import AIShortlist from './pages/AIShortlist';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1528',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <div className="app-wrapper">
        <Navbar />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/match"     element={<Match />} />
          <Route path="/ai"        element={<AIShortlist />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
