// app/layout.tsx
import { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import MainContent from './MainContent';
import { Icon } from './components/Icon';

function App() {
  return (
    <Router>
      <StrictMode>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/dashboard" element={<MainContent />} />
        </Routes>
      </StrictMode>
    </Router>
  );
}

export default App;