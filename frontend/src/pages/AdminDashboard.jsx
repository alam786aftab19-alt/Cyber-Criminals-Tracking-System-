import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ClipboardList, ShieldAlert, CheckCircle, HelpCircle, UserCheck, PlusCircle, Radio, BarChart3, Edit, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('complaints'); // complaints, fakeNews, addOffender, publishAlert
  const [analytics, setAnalytics] = useState({
    metrics: {
      totalComplaints: 0,
      resolvedComplaints: 0,
      totalFakeNews: 0,
      totalOffenders: 0,
      resolutionRate: 0
    },
    districtAnalytics: []
  });

  const [complaints, setComplaints] = useState([]);
  const [fakeNews, setFakeNews] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingLists, setLoadingLists] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', text: '' }

  // 1. Form States
  const [offenderForm, setOffenderForm] = useState({
    phone_number: '',
    upi_id: '',
    bank_account: '',
    fraud_type: 'UPI Double Money Scam',
    risk_level: 'high',
    district: ''
  });

  const [alertForm, setAlertForm] = useState({
    title: '',
    message: '',
    alert_type: 'scam',
    district: 'All Districts'
  });

  // Fetch metrics and analytics (Light UI theme)
  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/analytics`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Analytics load failed', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch list items based on tabs
  const fetchLists = async () => {
    setLoadingLists(true);
    try {
      if (activeTab === 'complaints') {
        const res = await fetch(`${API_URL}/api/admin/complaints`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setComplaints(data);
        }
      } else if (activeTab === 'fakeNews') {
        const res = await fetch(`${API_URL}/api/admin/fake-news`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setFakeNews(data);
        }
      }
    } catch (err) {
      console.error('List sync error', err);
    } finally {
      setLoadingLists(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchLists();
  }, [activeTab]);

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  // Update Complaint Status
  const handleUpdateComplaintStatus = async (complaintId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/complaints/${complaintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      if (res.ok) {
        showNotification('success', 'Complaint status updated successfully!');
        fetchLists();
        fetchAnalytics();
      } else {
        showNotification('error', 'Failed to update complaint.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Server error updating status.');
    }
  };

  // Update Fake News Status
  const handleUpdateFakeNewsStatus = async (newsId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/fake-news/${newsId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verification_status: newStatus }),
        credentials: 'include'
      });

      if (res.ok) {
        showNotification('success', 'Fake news verification state updated!');
        fetchLists();
        fetchAnalytics();
      } else {
        showNotification('error', 'Failed to update fake news report.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Server error updating fake news.');
    }
  };

  // Submit new offender to registry
  const handleAddOffender = async (e) => {
    e.preventDefault();
    if (!offenderForm.district) {
      showNotification('error', 'Please enter a target district.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/offenders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offenderForm),
        credentials: 'include'
      });

      if (res.ok) {
        showNotification('success', 'New offender registered inside Truecaller system!');
        setOffenderForm({
          phone_number: '',
          upi_id: '',
          bank_account: '',
          fraud_type: 'UPI Double Money Scam',
          risk_level: 'high',
          district: ''
        });
        fetchAnalytics();
      } else {
        showNotification('error', 'Failed to register offender.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Server error adding offender.');
    }
  };

  // Submit emergency warning
  const handlePublishAlert = async (e) => {
    e.preventDefault();
    if (!alertForm.title || !alertForm.message) {
      showNotification('error', 'Title and message are required.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertForm),
        credentials: 'include'
      });

      if (res.ok) {
        showNotification('success', 'Emergency public safety alert broadcasted!');
        setAlertForm({
          title: '',
          message: '',
          alert_type: 'scam',
          district: 'All Districts'
        });
        fetchAnalytics();
      } else {
        showNotification('error', 'Failed to publish alert.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Server error issuing alert.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      {/* HEADER SECTION (Light, crisp colors) */}
      <header className="flex justify-between items-center flex-wrap gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">
            POLICE INTERNAL SYSTEM
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Cyber Shield Control Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Logged in: <span className="font-bold text-slate-700">{user?.name} ({user?.role})</span> | District Cell: {user?.district}
          </p>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div
            className={`px-4 py-3 rounded-lg text-xs font-black shadow-md border animate-bounce ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {notification.text}
          </div>
        )}
      </header>

      {/* METRICS ROW (Clean minimalist cards) */}
      {loadingAnalytics ? (
        <div className="p-8 text-center text-slate-500 font-bold text-xs">Syncing control engine...</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">Total Filed Cases</span>
            <span className="text-3xl font-black text-slate-950 mt-2 block">{analytics.metrics.totalComplaints}</span>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">Resolved Cases</span>
            <span className="text-3xl font-black text-emerald-600 mt-2 block">{analytics.metrics.resolvedComplaints}</span>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">Resolution Rate</span>
            <span className="text-3xl font-black text-slate-950 mt-2 block">{analytics.metrics.resolutionRate}%</span>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">Blacklisted Scammers</span>
            <span className="text-3xl font-black text-red-500 mt-2 block">{analytics.metrics.totalOffenders}</span>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">Fact Check Index</span>
            <span className="text-3xl font-black text-blue-600 mt-2 block">{analytics.metrics.totalFakeNews}</span>
          </div>
        </div>
      )}

      {/* DETAILED STATS & ANALYTICS CHARTS (Clean Minimalist styling) */}
      {!loadingAnalytics && analytics.districtAnalytics.length > 0 && (
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm mb-8">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-slate-500" />
            Top 5 Incident Hotspots (Complaints by District)
          </h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.districtAnalytics}>
                <XAxis dataKey="district" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip cursor={{ fill: '#F1F5F9' }} />
                <Bar dataKey="complaints" fill="#64748B" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* OPERATIONS WORKSPACE CONTROL */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase block px-3 mb-2">OPERATIONS WORKSPACE</span>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'complaints'
                ? 'bg-slate-200 text-slate-900 border border-slate-300'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Verify Complaints
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('fakeNews')}
            className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'fakeNews'
                ? 'bg-slate-200 text-slate-900 border border-slate-300'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Fact Check Rumors
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('addOffender')}
            className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'addOffender'
                ? 'bg-slate-200 text-slate-900 border border-slate-300'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Add Cyber Scammer
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('publishAlert')}
            className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'publishAlert'
                ? 'bg-slate-200 text-slate-900 border border-slate-300'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Radio className="h-4 w-4" /> Broadcast Warning
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>

        {/* Dynamic workspace area */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          {activeTab === 'complaints' && (
            /* VERIFY COMPLAINTS WORKSPACE */
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-widest mb-6">Filer Complaints Registry</h2>
              {loadingLists ? (
                <div className="p-8 text-center text-slate-400 font-bold text-xs">Querying database...</div>
              ) : complaints.length === 0 ? (
                <div className="p-10 text-center text-slate-400 font-bold text-xs border border-dashed rounded-xl">
                  No citizens complaints registered in database.
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((c) => (
                    <div key={c.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex flex-col gap-3">
                      <div className="flex justify-between items-start flex-wrap gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">TRACKING: {c.tracking_id}</span>
                          <h3 className="font-bold text-slate-900 mt-0.5">{c.incident_type}</h3>
                        </div>
                        <select
                          value={c.status}
                          onChange={(e) => handleUpdateComplaintStatus(c.id, e.target.value)}
                          className="bg-white border border-slate-300 text-slate-700 text-xs font-extrabold py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="UNDER INVESTIGATION">UNDER INVESTIGATION</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                        {c.description}
                      </p>

                      {c.evidence_url && (
                        <div className="text-[10px] font-bold">
                          <span className="text-slate-400 mr-2 block md:inline uppercase">Evidence Link:</span>
                          <a href={c.evidence_url} target="_blank" rel="noopener noreferrer" className="text-slate-600 underline break-all">{c.evidence_url}</a>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold border-t border-slate-200 pt-3 mt-1">
                        <span>Filer: {c.ccts_users?.name} ({c.ccts_users?.email})</span>
                        <span>Location: {c.location} | Date: {new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'fakeNews' && (
            /* VERIFY FAKE NEWS WORKSPACE */
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-widest mb-6">WhatsApp rumor audit center</h2>
              {loadingLists ? (
                <div className="p-8 text-center text-slate-400 font-bold text-xs">Querying database...</div>
              ) : fakeNews.length === 0 ? (
                <div className="p-10 text-center text-slate-400 font-bold text-xs border border-dashed rounded-xl">
                  No fake news claims submitted for verification yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {fakeNews.map((f) => (
                    <div key={f.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex flex-col gap-3">
                      <div className="flex justify-between items-start flex-wrap gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <h3 className="font-bold text-slate-900">{f.title}</h3>
                          <span className="text-[9px] font-extrabold text-slate-400 uppercase">Reporter: {f.reported_by}</span>
                        </div>
                        <select
                          value={f.verification_status}
                          onChange={(e) => handleUpdateFakeNewsStatus(f.id, e.target.value)}
                          className="bg-white border border-slate-300 text-slate-700 text-xs font-extrabold py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
                        >
                          <option value="UNDER REVIEW">UNDER REVIEW</option>
                          <option value="VERIFIED">VERIFIED GENUINE</option>
                          <option value="FAKE">FAKE / HOAX</option>
                        </select>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                        {f.description}
                      </p>

                      {f.media_url && (
                        <div className="text-[10px] font-bold">
                          <span className="text-slate-400 mr-2 block md:inline uppercase">Attached Proof:</span>
                          <a href={f.media_url} target="_blank" rel="noopener noreferrer" className="text-slate-600 underline break-all">{f.media_url}</a>
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 font-bold mt-1 text-right block border-t border-slate-200 pt-3">
                        Submitted: {new Date(f.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addOffender' && (
            /* ADD OFFENDER FORM */
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-widest mb-6">Add cyber offender registry</h2>
              <form onSubmit={handleAddOffender} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 font-black block uppercase mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +919876543210"
                      value={offenderForm.phone_number}
                      onChange={(e) => setOffenderForm({ ...offenderForm, phone_number: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-black block uppercase mb-1.5">UPI Handle</label>
                    <input
                      type="text"
                      placeholder="e.g. scammer@ybl"
                      value={offenderForm.upi_id}
                      onChange={(e) => setOffenderForm({ ...offenderForm, upi_id: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-black block uppercase mb-1.5">Bank Account No.</label>
                    <input
                      type="text"
                      placeholder="e.g. 123456789012"
                      value={offenderForm.bank_account}
                      onChange={(e) => setOffenderForm({ ...offenderForm, bank_account: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 font-black block uppercase mb-1.5">Fraud Type</label>
                    <select
                      value={offenderForm.fraud_type}
                      onChange={(e) => setOffenderForm({ ...offenderForm, fraud_type: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-slate-500 font-semibold"
                    >
                      <option value="UPI Double Money Scam">UPI Double Money Scam</option>
                      <option value="Kaun Banega Crorepati Lottery Fraud">Kaun Banega Crorepati Lottery Fraud</option>
                      <option value="Fake Part-Time Job Telegram Scam">Fake Part-Time Job Telegram Scam</option>
                      <option value="Sextortion / Video Call Blackmail">Sextortion / Video Call Blackmail</option>
                      <option value="Immediate Loan App Harassment">Immediate Loan App Harassment</option>
                      <option value="Deepfake Scam">Deepfake Scam</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-black block uppercase mb-1.5">Risk Rating</label>
                    <select
                      value={offenderForm.risk_level}
                      onChange={(e) => setOffenderForm({ ...offenderForm, risk_level: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-slate-500 font-semibold"
                    >
                      <option value="high">HIGH RISK (Red Banner)</option>
                      <option value="medium">MEDIUM RISK (Orange Banner)</option>
                      <option value="low">LOW RISK (Yellow Banner)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-black block uppercase mb-1.5">Origin District</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lucknow, Noida, Varanasi"
                      value={offenderForm.district}
                      onChange={(e) => setOffenderForm({ ...offenderForm, district: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 text-right">
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs py-2.5 px-6 rounded-lg shadow-sm transition-colors"
                  >
                    Blacklist Offender In Truecaller
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'publishAlert' && (
            /* BROADCAST WARNING */
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-widest mb-6">Broadcast public emergency warning</h2>
              <form onSubmit={handlePublishAlert} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 font-black block uppercase mb-1.5">Alert Header / Headline</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 🚨 Fake Electricity Disconnection SMS Scam"
                      value={alertForm.title}
                      onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-black block uppercase mb-1.5">Target District</label>
                    <input
                      type="text"
                      placeholder="e.g. All Districts, Noida, Kanpur"
                      value={alertForm.district}
                      onChange={(e) => setAlertForm({ ...alertForm, district: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-black block uppercase mb-1.5">Warning Bullet Message (Shown in scrolling ticker)</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Provide full description of threat vectors, warning instructions, and safe reminders for the citizen scroll..."
                    value={alertForm.message}
                    onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 font-semibold leading-relaxed"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-200 text-right">
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs py-2.5 px-6 rounded-lg shadow-sm transition-colors"
                  >
                    Broadcast Warning Live
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
