import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, User, LayoutDashboard, FileText } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 shadow-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-tr from-police-saffron to-police-gold p-2 rounded-lg text-white shadow-md group-hover:scale-105 transition-transform duration-200">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-police-saffron">
              POLICE TRUECALLER
            </h1>
            <p className="text-[10px] text-police-gold font-bold tracking-widest uppercase">
              Cyber Shield • UP Police
            </p>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-police-saffron transition-colors duration-200">Home</Link>
          <Link to="/report" className="hover:text-police-saffron transition-colors duration-200">Report Scams</Link>
          <Link to="/fake-news" className="hover:text-police-saffron transition-colors duration-200">Fake News Buster</Link>
          <Link to="/track" className="hover:text-police-saffron transition-colors duration-200">Track Complaint</Link>
        </div>

        {/* Action / User profile */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Role Dashboard badge */}
              {(user.role === 'admin' || user.role === 'police') && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 bg-police-saffron hover:bg-police-saffron/90 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md shadow-police-saffron/20 transition-all duration-200"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Police Dashboard
                </Link>
              )}

              {/* User Identity */}
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs text-slate-400">Authenticated ({user.role})</span>
                <span className="text-sm font-semibold text-white flex items-center gap-1.5 justify-end">
                  <User className="h-3.5 w-3.5 text-police-gold" />
                  {user.name.split(' ')[0]}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-white/5 hover:bg-red-500/10 hover:text-red-400 p-2.5 rounded-lg border border-white/10 hover:border-red-500/20 text-slate-300 transition-all duration-200"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white px-4 py-2 text-sm font-semibold transition-colors duration-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-police-saffron to-police-saffronLight hover:scale-[1.02] text-white font-bold px-4 py-2 rounded-lg text-sm shadow-md shadow-police-saffron/20 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
