import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { User, Mail, MapPin, Key, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Input details, 2: Verify OTP
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    district: '',
    password: ''
  });
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMsg('');
  };

  // Step 1: Send OTP via EmailJS
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.district || !formData.password) {
      setErrorMsg('All fields are required.');
      return;
    }

    setSendingOtp(true);
    setErrorMsg('');

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    // Development Console Log Fallback (extremely helpful for immediate testing)
    console.log(`=========================================`);
    console.log(`🛡️  UP POLICE CYBER SHIELD - GENERATED OTP: ${otp}`);
    console.log(`=========================================`);

    try {
      // Generate 15 minutes expiration timestamp
      const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Setup EmailJS parameters mapping every possible placeholder name
      const templateParams = {
        to_name: formData.name,
        to_email: formData.email,
        
        // 1. Lowercase/Standard Aliases
        otp_code: otp,
        otp: otp,
        code: otp,
        token: otp,
        key: otp,
        val: otp,
        text: otp,
        passcode: otp,
        password: otp,
        email_code: otp,
        verification_code: otp,
        verification_otp: otp,

        // 2. Uppercase Aliases (Template variables are case-sensitive)
        OTP_CODE: otp,
        OTP: otp,
        CODE: otp,
        TOKEN: otp,
        KEY: otp,
        VAL: otp,
        TEXT: otp,
        PASSCODE: otp,
        PASSWORD: otp,
        EMAIL_CODE: otp,
        VERIFICATION_CODE: otp,
        VERIFICATION_OTP: otp,

        // 3. CamelCase / PascalCase Aliases
        otpCode: otp,
        OtpCode: otp,
        Otp: otp,
        Code: otp,
        Token: otp,
        Key: otp,
        Val: otp,
        Passcode: otp,
        Password: otp,
        emailCode: otp,
        EmailCode: otp,
        verificationCode: otp,
        VerificationCode: otp,
        verificationOtp: otp,
        VerificationOtp: otp,
        
        // 4. Expiration variables (already verified working)
        valid_till: expiryTime,
        expiry: expiryTime,
        expires_at: expiryTime,
        expire_time: expiryTime,
        time: expiryTime,
        
        message: `Your verification OTP for UP Police Cyber Shield registration is: ${otp}`,
        reply_to: 'ccts.uppolice@gmail.com'
      };

      // Dispatched using EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSuccessMsg(`A 6-digit OTP has been sent to ${formData.email}. Please check your inbox.`);
      setStep(2);
    } catch (err) {
      console.error('EmailJS error:', err);
      // Show warning but allow fallback for easy testing in case of sandbox issues
      setErrorMsg('Email dispatch failed, but OTP bypassed in dev console log. You can find the OTP in developer tools console!');
      setStep(2);
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Verify OTP and Register user in database
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!userOtpInput.trim()) {
      setErrorMsg('Please enter the OTP.');
      return;
    }

    if (userOtpInput.trim() !== generatedOtp) {
      setErrorMsg('Invalid OTP code. Please check your email or developer console.');
      return;
    }

    setRegistering(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server registration failed.');
      }

      setSuccessMsg('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Server error. Failed to save registration.');
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex justify-center items-center px-6 py-12 bg-police-navy relative">
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-police-saffron/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 rounded-3xl glass border border-white/10 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-police-saffron/10 text-police-saffron rounded-2xl mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-wide">Citizen Signup</h2>
          <p className="text-slate-400 text-xs mt-1.5 font-semibold">
            Protect yourself and verify cyber safety. Register details.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold px-4 py-3 rounded-xl mb-6">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-semibold px-4 py-3 rounded-xl mb-6">
            {successMsg}
          </div>
        )}

        {step === 1 ? (
          /* Step 1 Form */
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="text-xs text-slate-400 font-bold block uppercase mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bold block uppercase mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bold block uppercase mb-2">District in UP</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="district"
                  required
                  placeholder="e.g. Lucknow, Noida, Kanpur"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bold block uppercase mb-2">Login Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Key className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Set secure login password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sendingOtp}
              className="w-full bg-gradient-to-r from-police-saffron to-police-saffronLight hover:scale-[1.01] active:scale-[0.99] text-white font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-police-saffron/20 text-sm disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {sendingOtp ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Sending OTP Code...
                </>
              ) : (
                <>
                  Generate Verification OTP
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2 Form (OTP Verification) */
          <form onSubmit={handleVerifyAndRegister} className="space-y-5">
            <div>
              <label className="text-xs text-slate-400 font-bold block uppercase mb-2">Verification Code (OTP)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Key className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  maxLength="6"
                  required
                  placeholder="Enter 6-digit code"
                  value={userOtpInput}
                  onChange={(e) => setUserOtpInput(e.target.value)}
                  className="w-full bg-police-blue/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-police-saffron/50 transition-colors font-semibold text-center tracking-widest text-lg"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-2 text-center">
                Check your email inbox. If there is a sandbox delay, view your browser/development terminal console!
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-white/5 border border-white/10 text-white font-extrabold py-3.5 rounded-xl text-sm hover:bg-white/10 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={registering}
                className="w-2/3 bg-gradient-to-r from-police-saffron to-police-saffronLight hover:scale-[1.01] active:scale-[0.99] text-white font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-police-saffron/20 text-sm disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {registering ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    Verify & Register
                    <ShieldCheck className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400 font-semibold">
          Already registered?{' '}
          <Link to="/login" className="text-police-saffron hover:underline">
            Log In here
          </Link>
        </div>
      </div>
    </div>
  );
}
