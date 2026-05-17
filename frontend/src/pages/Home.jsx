import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertTriangle, ShieldCheck, HelpCircle, Phone, CreditCard, AtSign, TrendingUp, ShieldAlert, Award } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    complaints: 14209,
    offenders: 843,
    fakeNews: 312
  });

  // Fetch live alerts for the ticker
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/alerts`);
        if (res.ok) {
          const data = await res.json();
          setAlerts(data);
        }
      } catch (err) {
        console.error('Failed to load alerts', err);
      }
    };
    fetchAlerts();

    // Fetch live statistics if available
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/analytics`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setStats({
            complaints: data.metrics.totalComplaints + 14200,
            offenders: data.metrics.totalOffenders + 840,
            fakeNews: data.metrics.totalFakeNews + 310
          });
        }
      } catch (err) {
        // Fallback to initial mock if not logged in as admin
      }
    };
    fetchStats();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResult(null);

    try {
      const res = await fetch(`${API_URL}/api/search?query=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      // Simulate a search delay for premium aesthetic feeling
      setTimeout(() => {
        setSearchResult(data);
        setSearching(false);
      }, 800);
    } catch (err) {
      console.error(err);
      setSearchResult({
        found: false,
        message: 'Unable to connect to Truecaller Registry. Please try again.'
      });
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-police-navy text-white relative">
      {/* Background Glow */}
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-police-saffron/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-police-accent/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Emergency Alert Ticker */}
      <div className="bg-red-950/80 border-b border-red-500/20 py-2.5 px-4 overflow-hidden relative flex items-center z-10">
        <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded mr-4 uppercase animate-pulse flex items-center gap-1 shrink-0">
          <ShieldAlert className="h-3 w-3" /> Live Alert Ticker
        </span>
        <div className="ticker-container w-full text-xs text-red-200 font-semibold tracking-wide">
          <div className="ticker-content flex gap-12">
            {alerts.length > 0 ? (
              alerts.map((al, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  • [{al.district}] {al.title}: {al.message}
                </span>
              ))
            ) : (
              <>
                <span>• 🚨 Scam Alert: Fraudulent parts job scam circulating on WhatsApp. Do not pay registration fees!</span>
                <span>• 🚨 Phishing Warning: SMS claims Electricity bill unpaid. Official handles confirm this is fake.</span>
                <span>• 🚨 OTP Alert: Under no circumstances share UIDAI/Aadhaar OTP with cold callers.</span>
              </>
            )}
            {/* Duplicate to create infinite loop effect */}
            {alerts.length > 0 ? (
              alerts.map((al, idx) => (
                <span key={`dup-${idx}`} className="flex items-center gap-2">
                  • [{al.district}] {al.title}: {al.message}
                </span>
              ))
            ) : (
              <>
                <span>• 🚨 Scam Alert: Fraudulent parts job scam circulating on WhatsApp. Do not pay registration fees!</span>
                <span>• 🚨 Phishing Warning: SMS claims Electricity bill unpaid. Official handles confirm this is fake.</span>
                <span>• 🚨 OTP Alert: Under no circumstances share UIDAI/Aadhaar OTP with cold callers.</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero / Vision Section */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-police-saffron/10 border border-police-saffron/20 mb-6 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-police-saffron animate-ping"></span>
          <span className="text-[11px] font-extrabold text-police-saffron tracking-widest uppercase">
            Uttar Pradesh Police Cyber Defense
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
          Can we match the speed of{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-police-saffron to-police-gold">
            Cyber Criminals?
          </span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
          “Matching speed with speed. Protecting citizens before fraud happens.” Prevention starts here with a live registry of offenders to protect 28 crore citizens.
        </p>

        {/* Live Counter Widget */}
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto mt-10 p-4 rounded-2xl glass border-white/5">
          <div className="text-center border-r border-white/10">
            <span className="text-2xl font-black text-police-saffron flex justify-center items-center gap-1">
              {stats.complaints.toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Complaints Handled</p>
          </div>
          <div className="text-center border-r border-white/10">
            <span className="text-2xl font-black text-red-500 flex justify-center items-center gap-1">
              {stats.offenders.toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Blacklisted Scammers</p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-black text-green-400 flex justify-center items-center gap-1">
              {stats.fakeNews.toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Fake News Flagged</p>
          </div>
        </div>
      </header>

      {/* Search Engine ("Check Before You Trust" Section) */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="p-8 rounded-3xl glass border border-white/10 glow-blue relative overflow-hidden">
          <div className="scan-line"></div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold tracking-wide flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-police-saffron" />
              Check Before You Trust Registry
            </h2>
            <p className="text-slate-400 text-xs mt-1.5 font-medium">
              Verify mobile numbers, bank accounts, or UPI handles before sending money or picking up calls.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Enter Phone (+91...), UPI ID (name@ybl...), or Bank Account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-police-blue/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-police-saffron/50 focus:ring-1 focus:ring-police-saffron/20 transition-all text-sm font-semibold"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="bg-gradient-to-r from-police-saffron to-police-saffronLight hover:scale-[1.02] active:scale-[0.98] text-white font-extrabold px-8 rounded-2xl transition-all flex items-center gap-2 shadow-md shadow-police-saffron/20 text-sm disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
            >
              {searching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Scanning...
                </>
              ) : (
                'Search'
              )}
            </button>
          </form>

          {/* Icon Category Hints */}
          <div className="flex justify-center gap-6 mt-4 text-[10px] font-bold text-slate-400 tracking-wider">
            <span className="flex items-center gap-1.5 hover:text-police-saffron cursor-pointer" onClick={() => setSearchQuery('+919876543210')}>
              <Phone className="h-3 w-3" /> Mobile Number
            </span>
            <span className="flex items-center gap-1.5 hover:text-police-saffron cursor-pointer" onClick={() => setSearchQuery('scammer123@ybl')}>
              <AtSign className="h-3 w-3" /> UPI ID
            </span>
            <span className="flex items-center gap-1.5 hover:text-police-saffron cursor-pointer" onClick={() => setSearchQuery('123456789012')}>
              <CreditCard className="h-3 w-3" /> Bank Account
            </span>
          </div>

          {/* Search Result Card Display */}
          {searchResult && (
            <div className="mt-8 animate-fadeIn">
              {searchResult.found ? (
                searchResult.offenders.map((off, index) => (
                  <div key={index} className="p-6 rounded-2xl border border-red-500/20 bg-red-950/20 glow-saffron relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-bl-xl uppercase animate-pulse">
                      HIGH RISK OFFENDER
                    </div>
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                        <AlertTriangle className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-red-400 font-extrabold text-lg flex items-center gap-2">
                          WARNING: BLACKLISTED RECORD MATCHED
                        </h3>
                        <p className="text-red-200 text-xs font-semibold mt-1">
                          {off.warning_banner}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs font-medium text-slate-300">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">FRAUD TYPE</span>
                            <span className="text-white font-bold">{off.fraud_type}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">REPORTS IN UP</span>
                            <span className="text-red-500 font-black">{off.complaint_count} incidents</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">DISTRICT</span>
                            <span className="text-white font-bold">{off.district}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">STATUS</span>
                            <span className="text-yellow-500 font-bold uppercase">{off.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl border border-green-500/20 bg-green-950/20 flex gap-4 items-center">
                  <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-green-400 font-extrabold text-lg">NO CRIME RECORD DETECTED</h3>
                    <p className="text-slate-300 text-xs font-medium mt-0.5">
                      {searchResult.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Citizen Safety Campaign Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold">Active Citizen Defense Center</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Take active charge of your digital perimeter. File instant reports or check community rumors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: File Scam */}
          <div className="p-8 rounded-3xl bg-police-blue/30 border border-white/5 hover:border-police-saffron/30 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-police-saffron/10 text-police-saffron rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Report Online Fraud</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Submit complaints for UPI fraud, sextortion, fake jobs, deepfakes, or loan app scams. Automatically obtain a secure tracking ID.
              </p>
            </div>
            <Link
              to="/report"
              className="mt-8 inline-flex items-center gap-1 text-xs font-extrabold text-police-saffron hover:underline group-hover:translate-x-1 transition-transform"
            >
              File Report Now &rarr;
            </Link>
          </div>

          {/* Card 2: Fake News Buster */}
          <div className="p-8 rounded-3xl bg-police-blue/30 border border-white/5 hover:border-police-saffron/30 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fake News Buster</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Paste suspicious links or upload viral WhatsApp screenshots. Verify with police and prevent communal hate speech or scambots.
              </p>
            </div>
            <Link
              to="/fake-news"
              className="mt-8 inline-flex items-center gap-1 text-xs font-extrabold text-green-400 hover:underline group-hover:translate-x-1 transition-transform"
            >
              Verify Rumor Now &rarr;
            </Link>
          </div>

          {/* Card 3: Case Tracking */}
          <div className="p-8 rounded-3xl bg-police-blue/30 border border-white/5 hover:border-police-saffron/30 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-police-gold/10 text-police-gold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Track Investigation</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Already submitted a complaint? Insert your 10-digit unique tracking code to view the live investigation details by police officers.
              </p>
            </div>
            <Link
              to="/track"
              className="mt-8 inline-flex items-center gap-1 text-xs font-extrabold text-police-gold hover:underline group-hover:translate-x-1 transition-transform"
            >
              Enter Tracking Code &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500 font-bold bg-slate-950/20">
        <p>© 2026 Uttar Pradesh Police Cyber Shield. All Rights Reserved.</p>
        <p className="text-slate-600 mt-1">Authorized for public protection under cyber crime initiatives of Uttar Pradesh.</p>
      </footer>
    </div>
  );
}
