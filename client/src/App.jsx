import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-slate-100 min-h-screen text-slate-800 flex flex-col font-sans">
          <Navbar />
          <main className="container mx-auto p-4 md:p-8 flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200">
            Short.ly URL Shortener &bull; Built with MERN Stack
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
