import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportComplaint from './pages/ReportComplaint';
import FakeNewsReport from './pages/FakeNewsReport';
import TrackComplaint from './pages/TrackComplaint';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-police-navy">
          {/* Global Header Navigation */}
          <Navbar />

          {/* Main Layout Area */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/track" element={<TrackComplaint />} />

              {/* Citizen Secure Routes (Must be logged in) */}
              <Route
                path="/report"
                element={
                  <ProtectedRoute allowedRoles={['citizen', 'police', 'admin']}>
                    <ReportComplaint />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/fake-news"
                element={
                  <ProtectedRoute allowedRoles={['citizen', 'police', 'admin']}>
                    <FakeNewsReport />
                  </ProtectedRoute>
                }
              />

              {/* Internal Police Admin Panel (Only Police / Admin roles) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'police']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Bypasses */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}
