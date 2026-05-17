import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Send, ShieldAlert, Award, FileText, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ReportComplaint() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    incident_type: 'UPI Scams',
    description: '',
    evidence_url: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdTrackingId, setCreatedTrackingId] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.location) {
      setErrorMsg('Please describe the incident and provide your district location.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/api/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include' // Send session cookie
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server rejected complaint registration.');
      }

      setCreatedTrackingId(data.tracking_id);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Server error. Failed to file complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] max-w-4xl mx-auto px-6 py-12 text-white">
      {createdTrackingId ? (
        /* SUCCESS SCREEN DISPLAY */
        <div className="p-8 rounded-3xl glass border border-green-500/20 text-center bg-green-950/10 glow-blue animate-fadeIn max-w-xl mx-auto mt-10">
          <div className="inline-flex p-4 bg-green-500/10 text-green-400 rounded-full mb-6">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-black text-green-400">Complaint Filed Successfully!</h2>
          <p className="text-slate-300 text-xs mt-3 leading-relaxed font-semibold">
            Your incident has been securely registered in the official UP Police Cyber Shield database.
          </p>

          <div className="my-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
              YOUR SECURE TRACKING ID
            </span>
            <span className="text-3xl font-black text-police-saffron tracking-wider mt-2 block">
              {createdTrackingId}
            </span>
            <p className="text-[10px] text-slate-500 font-bold mt-2">
              Save this ID safely! You can use it to track live updates and police resolution statuses.
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              to="/track"
              className="flex-1 bg-gradient-to-r from-police-saffron to-police-saffronLight text-white font-extrabold py-3.5 rounded-xl text-xs hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
            >
              <FileText className="h-4 w-4" />
              Track Case
            </Link>
            <button
              onClick={() => {
                setCreatedTrackingId('');
                setFormData({
                  incident_type: 'UPI Scams',
                  description: '',
                  evidence_url: '',
                  location: ''
                });
              }}
              className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-extrabold py-3.5 rounded-xl text-xs transition-colors"
            >
              File Another
            </button>
          </div>
        </div>
      ) : (
        /* COMPLAINT FORM SCREEN */
        <div className="p-8 rounded-3xl glass border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-police-saffron/10 pointer-events-none">
            <ShieldAlert className="h-40 w-40" />
          </div>

          <div className="mb-8 border-b border-white/5 pb-6">
            <h2 className="text-3xl font-extrabold tracking-wide flex items-center gap-2">
              <AlertTriangle className="h-7 w-7 text-police-saffron" />
              File Cyber Crime Incident
            </h2>
            <p className="text-slate-400 text-xs mt-1.5 font-semibold">
              Fill details truthfully. Your email is logged for secure session authentication.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold px-4 py-3 rounded-xl mb-6">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-slate-400 font-bold block uppercase mb-2">Incident Type</label>
                <select
                  name="incident_type"
                  value={formData.incident_type}
                  onChange={handleChange}
                  className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold"
                >
                  <option value="UPI Scams" className="bg-police-navy">UPI Scams / Double Money</option>
                  <option value="Sextortion" className="bg-police-navy">Sextortion / Video Blackmail</option>
                  <option value="Fake Job" className="bg-police-navy">Fake Job / Telegram Rating Scam</option>
                  <option value="Loan App" className="bg-police-navy">Immediate Loan App Harassment</option>
                  <option value="Deepfake" className="bg-police-navy">Deepfake / AI Face-swap Incident</option>
                  <option value="Cyber Fraud" className="bg-police-navy">General Cyber Fraud</option>
                  <option value="Others" className="bg-police-navy">Others</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block uppercase mb-2">District Location (Uttar Pradesh)</label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Lucknow, Noida, Meerut"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bold block uppercase mb-2">Full Description of Incident</label>
              <textarea
                name="description"
                rows="5"
                required
                placeholder="Explain what occurred, how the scammer contacted you, transaction details (UPI IDs, transaction dates, links clicked), and phone numbers utilized..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bold block uppercase mb-2">Evidence Attachment Link (Screenshot URL / Drive link)</label>
              <input
                type="url"
                name="evidence_url"
                placeholder="https://drive.google.com/... or https://imgur.com/..."
                value={formData.evidence_url}
                onChange={handleChange}
                className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold"
              />
              <p className="text-[10px] text-slate-500 font-bold mt-1.5">
                Paste a Google Drive, Dropbox, or Imgur link containing transactional proofs or chat records.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-police-saffron to-police-saffronLight hover:scale-[1.01] active:scale-[0.99] text-white font-extrabold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-police-saffron/20 text-sm disabled:opacity-75"
              >
                {loading ? 'Submitting Safe Report...' : 'File Instant Complaint'}
                <Send className="h-4 w-4" />
              </button>
              <Link
                to="/"
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-extrabold px-6 py-4 rounded-xl text-sm transition-colors flex items-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
