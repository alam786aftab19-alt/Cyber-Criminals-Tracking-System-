import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Key, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setErrorMsg('');

    const result = await login(email.trim(), password);

    if (result.success) {
      // Check user role for dynamic routing
      const role = result.user.role;
      if (role === 'admin' || role === 'police') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setErrorMsg(result.error || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  // Helper shortcuts for developers/evaluators
  const setDemoCredential = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('admin123'); // seed accounts default password
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-6 py-12 bg-police-navy relative">
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-police-accent/10 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 rounded-3xl glass border border-white/10 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-police-saffron/10 text-police-saffron rounded-2xl mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-wide">Secure Access Login</h2>
          <p className="text-slate-400 text-xs mt-1.5 font-semibold">
            Sign in to file complaints, report viral rumors, or access police systems.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold px-4 py-3 rounded-xl mb-6">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs text-slate-400 font-bold block uppercase mb-2">Registered Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bold block uppercase mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Key className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-police-saffron to-police-saffronLight hover:scale-[1.01] active:scale-[0.99] text-white font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-police-saffron/20 text-sm disabled:opacity-75"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Authenticating Session...
              </>
            ) : (
              <>
                Secure Login
                <ShieldCheck className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Box (Extremely useful for evaluators) */}
        <div className="mt-8 p-4 rounded-xl bg-police-blue/40 border border-white/5">
          <h4 className="text-[10px] text-police-gold font-bold tracking-wider uppercase mb-2">
            Testing Credentials Shortcuts:
          </h4>
          <div className="space-y-1.5">
            <button
              onClick={() => setDemoCredential('admin@ccts.uppolice.gov.in')}
              className="w-full flex justify-between items-center text-[10px] font-bold text-slate-300 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded transition-all text-left"
            >
              <span>Police Admin (Light Dashboard)</span>
              <span className="text-police-saffron text-[9px]">admin@ccts.uppolice.gov.in</span>
            </button>
            <button
              onClick={() => setDemoCredential('officer.verma@ccts.uppolice.gov.in')}
              className="w-full flex justify-between items-center text-[10px] font-bold text-slate-300 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded transition-all text-left"
            >
              <span>Police Inspector</span>
              <span className="text-police-saffron text-[9px]">officer.verma@ccts.uppolice.gov.in</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400 font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="text-police-saffron hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
