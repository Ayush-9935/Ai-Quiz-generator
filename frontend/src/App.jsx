import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import History from './pages/History';
import Navbar from './components/Navbar';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token'));

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <main className="flex-1 w-full h-full pt-8 pb-12 px-4 lg:px-8 overflow-y-auto" style={{ backgroundColor: 'transparent' }}>
          <div className="w-full h-full mx-auto" style={{ maxWidth: '1440px' }}>
            <Routes>
              <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
              <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/quiz/:id" element={isAuthenticated ? <Quiz /> : <Navigate to="/login" />} />
              <Route path="/result" element={isAuthenticated ? <Result /> : <Navigate to="/login" />} />
              <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
