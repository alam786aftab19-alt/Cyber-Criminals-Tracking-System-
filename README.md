# UP Police Cyber Shield – Police Truecaller & Fake News Defense Network

> **Matching speed with speed. Protecting citizens before fraud happens.**

UP Police Cyber Shield is a modern, high-performance, full-stack cybersecurity defense platform designed to protect citizens from real-time digital fraud and verify viral misinformation. The system contains a premium, immersive dark citizen portal featuring an instant **"Police Truecaller" search engine**, and a minimalist, **light-themed administrative dashboard** for police officers to black-list offenders and triage incidents.

---

## 🛡️ Core Features

1. **Cyber Offender Registry ("Police Truecaller"):**
   - Lookup suspicious phone numbers, UPI handles, or bank accounts before executing transactions.
   - Triggers instant warning banners alerting users: `⚠️ Alert: Reported in X cyber fraud complaints across Uttar Pradesh.`

2. **Session-based Authentication:**
   - Powered by standard `express-session` cookies.
   - Restricts API access based on verified citizen or administrative roles (`citizen`, `police`, `admin`).
   - Syncs active sessions on hard page refreshes automatically.

3. **Fake News Buster & Duplicate Detection:**
   - Citizens can upload screenshots or paste claims.
   - The backend checks dynamic matches against active databases. If duplicate keywords exist, the user is notified: *"Note: A similar report is already under investigation. Your submission has been linked to current review."*

4. **Incident Reporting Portal:**
   - Citizens can report UPI scams, sextortion, fake jobs, deepfakes, or loan app harassment.
   - Generates a unique 10-digit alphanumeric tracking reference (e.g. `CCTS-Y6T9R8`) for investigations.
   - Live Case Tracking allows citizens to check progress (Pending, Under Investigation, Resolved).

5. **Executive Light Admin Dashboard:**
   - Minimalist, crisp styling tailored for administrative focus (`bg-slate-50`).
   - Aggregated analytical metrics: Total cases, blacklisted scammers, resolution rates.
   - Live analytics bar chart (using Recharts) mapping complaint hotspots by district.
   - Triage action tabs: edit case statuses, verify/reject viral rumor articles, blacklist new offenders, and broadcast real-time threat tickers.

---

## ⚙️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, Recharts, EmailJS-browser.
- **Backend:** Node.js, Express, Express-Session, Cors, Supabase JS Client, Dotenv.
- **Database:** Supabase (PostgreSQL), with all tables carrying the designated prefix `ccts_`.

---

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Database Schema Installation
1. Go to your [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor** from the left navigation panel.
3. Open the file [schema.sql](./schema.sql) from the root of this project.
4. Copy its contents, paste them into the SQL Editor, and click **Run**.
   *This creates tables (`ccts_users`, `ccts_cyber_offenders`, etc.), configures Row Level Security (RLS) bypass policies for the service role, and seeds pre-made admin users and search offenders.*

---

### Step 2: Backend Setup
1. Navigate into the backend folder:
   ```bash
   cd backend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Configure the environment file by creating `backend/.env` (pre-filled in your workspace):
   ```env
   PORT=5000
   SUPABASE_URL=https://ukcajjfmvedeoykyelcj.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SESSION_SECRET=up_police_cyber_shield_secret_key_2026_xyz
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the server in hot-reload development mode:
   ```bash
   npm run dev
   ```
   *The server active confirmation will load on: `http://localhost:5000`*

---

### Step 3: Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install React dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables by creating `frontend/.env` (pre-filled in your workspace):
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_EMAILJS_SERVICE_ID=service_qyvuqcs
   VITE_EMAILJS_TEMPLATE_ID=template_ht3fkqo
   VITE_EMAILJS_PUBLIC_KEY=1vT683ZkiQnFhlSpP
   ```
4. Start the Vite React client dev server:
   ```bash
   npm run dev
   ```
   *The browser will open on: `http://localhost:5173`*

---

## 🔑 Testing Credentials

Use these preset seed accounts on the `/login` screen to instantly view the dashboards:

- **Police Admin Panel (Light Theme Dashboard):**
  - **Email:** `admin@ccts.uppolice.gov.in`
- **Police Inspector Triage Account:**
  - **Email:** `officer.verma@ccts.uppolice.gov.in`
- **New Citizen Account:**
  - Click **Sign Up**, fill your details, generate the OTP (which sends an email via EmailJS or logs to the browser inspect console for quick bypass), and log in.
