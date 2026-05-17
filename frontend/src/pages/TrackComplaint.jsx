import React, { useState } from 'react';
import { Search, FileText, CheckCircle2, ShieldAlert, AlertCircle, Calendar, MapPin, ClipboardList } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function TrackComplaint() {
  const [trackingId, setTrackingId] = useState('');
  const [searching, setSearching] = useState(false);
  const [complaint, setComplaint] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setSearching(true);
    setComplaint(null);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/api/complaints/track/${encodeURIComponent(trackingId.trim().toUpperCase())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to retrieve case file.');
      }

      setComplaint(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error communicating with lookup system.');
    } finally {
      setSearching(false);
    }
  };

  const getStatusBanner = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            PENDING: This report has been received and is queued for investigator assignment.
          </div>
        );
      case 'UNDER INVESTIGATION':
        return (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
            <ClipboardList className="h-5 w-5 shrink-0 animate-pulse" />
            UNDER INVESTIGATION: A UP Police cyber analyst has been assigned and is verifying transaction IDs/证据.
          </div>
        );
      case 'RESOLVED':
        return (
          <div className="bg-green-500/10 border border-green-500/20 text-green-300 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            RESOLVED: Investigation finalized. Fraud indicators have been blacklisted and cataloged.
          </div>
        );
      case 'REJECTED':
        return (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            REJECTED: Report flagged as duplicate, erroneous, or spam submission.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[85vh] max-w-3xl mx-auto px-6 py-12 text-white">
      <div className="p-8 rounded-3xl glass border border-white/10 relative overflow-hidden">
        <div className="text-center mb-8 border-b border-white/5 pb-6">
          <div className="inline-flex p-3 bg-police-gold/10 text-police-gold rounded-2xl mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-wide">Track Case File</h2>
          <p className="text-slate-400 text-xs mt-1.5 font-semibold">
            Input your 10-digit alphanumeric tracking identifier to check live officer investigation states.
          </p>
        </div>

        {/* Query Input */}
        <form onSubmit={handleTrack} className="flex gap-2 max-w-xl mx-auto mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. CCTS-ABC123"
              required
              value={trackingId}
              onChange={(e) => {
                setTrackingId(e.target.value);
                setErrorMsg('');
              }}
              className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-extrabold uppercase tracking-widest text-center"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="bg-gradient-to-r from-police-saffron to-police-saffronLight hover:scale-[1.01] active:scale-[0.99] text-white font-extrabold px-6 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs disabled:opacity-75"
          >
            {searching ? 'Querying...' : 'Lookup Status'}
          </button>
        </form>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold px-4 py-3 rounded-xl mb-6 max-w-xl mx-auto text-center">
            {errorMsg}
          </div>
        )}

        {/* Complaint Detailed Record */}
        {complaint && (
          <div className="mt-8 border-t border-white/5 pt-8 animate-fadeIn space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">INCIDENT CATEGORY</span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">{complaint.incident_type}</h3>
              </div>
              <span className="bg-police-saffron/10 border border-police-saffron/20 text-police-saffron text-[10px] font-black tracking-widest px-3 py-1.5 rounded uppercase">
                {complaint.status}
              </span>
            </div>

            {/* Status explanation Banner */}
            {getStatusBanner(complaint.status)}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-police-gold" />
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold">FILING DATE</span>
                  <span>{new Date(complaint.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-police-gold" />
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold">DISTRICT FILER</span>
                  <span>{complaint.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">COMPLAINT STATEMENT</span>
              <p className="p-4 rounded-xl bg-police-blue/20 border border-white/5 text-slate-300 text-xs font-medium leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {complaint.evidence_url && (
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1.5">Evidence URL Attached</span>
                <a
                  href={complaint.evidence_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-police-saffron hover:underline text-xs font-bold break-all"
                >
                  {complaint.evidence_url}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
