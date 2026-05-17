import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Send, Clipboard, BookOpen, AlertCircle, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function FakeNewsReport() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_url: ''
  });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [submitMessage, setSubmitMessage] = useState(null); // { type: 'success' | 'warning', text: '' }
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch reports on startup
  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_URL}/api/fake-news`);
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Failed to load fake news', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMsg('');
    setSubmitMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setErrorMsg('Please enter a title and description.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSubmitMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/fake-news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include' // Send session cookie
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server error uploading report.');
      }

      if (data.duplicateDetected) {
        setSubmitMessage({
          type: 'warning',
          text: data.message // Shows duplicate notice
        });
      } else {
        setSubmitMessage({
          type: 'success',
          text: 'Fake news reported successfully! UP Police analysts will review this claim.'
        });
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        media_url: ''
      });

      // Refresh list
      fetchReports();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to file report.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-black tracking-widest px-2.5 py-1 rounded uppercase">
            <CheckCircle2 className="h-3 w-3" /> VERIFIED GENUINE
          </span>
        );
      case 'FAKE':
        return (
          <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black tracking-widest px-2.5 py-1 rounded uppercase">
            <XCircle className="h-3 w-3" /> FAKE / HOAX
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-black tracking-widest px-2.5 py-1 rounded uppercase">
            <HelpCircle className="h-3 w-3 animate-pulse" /> UNDER REVIEW
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-police-navy text-white px-6 py-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN: UPLOAD REPORT */}
      <div className="lg:col-span-1">
        <div className="p-6 rounded-3xl glass border border-white/10 sticky top-28">
          <div className="mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <ShieldCheck className="h-6 w-6 text-police-saffron" />
            <h2 className="text-xl font-extrabold">Report Suspected Hoax</h2>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold px-4 py-3 rounded-xl mb-4">
              {errorMsg}
            </div>
          )}

          {submitMessage && (
            <div
              className={`border text-xs font-semibold px-4 py-3 rounded-xl mb-4 ${
                submitMessage.type === 'warning'
                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'
                  : 'bg-green-500/10 border-green-500/20 text-green-300'
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1.5">Viral Headline / Claim Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Govt giving Rs 5000 free allowances"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1.5">Where did you see it / Context</label>
              <textarea
                name="description"
                rows="4"
                required
                placeholder="Describe where it is circulating (WhatsApp, Facebook, Twitter) and why you suspect it is fake news..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1.5">Evidence Screenshot URL / Links</label>
              <input
                type="url"
                name="media_url"
                placeholder="Paste link to rumor post or snapshot URL"
                value={formData.media_url}
                onChange={handleChange}
                className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-police-saffron to-police-saffronLight hover:scale-[1.01] active:scale-[0.99] text-white font-extrabold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-police-saffron/20 text-xs disabled:opacity-75"
            >
              {loading ? 'Submitting...' : 'Submit Claim for Audit'}
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: RUMOR CATALOG */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <BookOpen className="h-6 w-6 text-police-gold" />
          <h2 className="text-2xl font-extrabold">Public Fact-Check Index</h2>
        </div>

        {fetching ? (
          <div className="p-12 text-center text-slate-400 font-bold text-xs">
            <div className="w-8 h-8 border-4 border-police-saffron/20 border-t-police-saffron rounded-full animate-spin mx-auto mb-4"></div>
            Syncing Verification Catalog...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass border-dashed border-white/10 text-slate-400 text-xs font-bold">
            No hoax reports filed yet. Start by reporting a WhatsApp rumor!
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((rep) => (
              <div key={rep.id} className="p-6 rounded-2xl glass border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                  <h3 className="font-extrabold text-base text-white">{rep.title}</h3>
                  {getStatusBadge(rep.verification_status)}
                </div>
                <p className="text-slate-300 text-xs font-medium leading-relaxed mb-4">
                  {rep.description}
                </p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold border-t border-white/5 pt-3">
                  <span>Reported By: {rep.reported_by || 'Anonymous'}</span>
                  <span>Filing Date: {new Date(rep.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
