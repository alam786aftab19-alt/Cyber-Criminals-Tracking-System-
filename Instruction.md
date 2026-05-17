Here’s a polished **AI app-building prompt** you can use in tools like Lovable, Bolt, Replit AI, Cursor, Claude, GPT, or any full-stack generator to create the project for **UP Police** using **Supabase + Node.js/Express + EmailJS + Render**.

---

# UP Police Cyber Shield – Full Stack AI Build Prompt

Build a modern, scalable cyber safety and fake news prevention platform for **UP Police** named **“Police Truecaller – Cyber Shield”**.

## Core Vision

Can we match the speed of cyber criminals—who strike in seconds and vanish in silence?

Prevention starts with a live registry of cyber offenders that alerts citizens before fraud happens.

Counter fake news at scale using the collective strength of 4 lakh police personnel and 28 crore citizens—matching speed with speed, volume with volume.

The platform should feel like a combination of:

* Truecaller
* Cyber crime reporting system
* Fake news detection network
* Public safety intelligence dashboard

---

# Tech Stack

Use:

* Frontend: React + Tailwind CSS
* Backend: Node.js + Express
* Database/Auth: Supabase
* Email Notifications: EmailJS
* Deployment:

  * Frontend on Render or Vercel
  * Backend on Render
* Optional:

  * Socket.IO for real-time alerts
  * AI moderation/fake-news classification
  * Geo-mapping for incident visualization

---

# Main Features

## 1. Cyber Offender Registry (“Police Truecaller”)

Users can:

* Search phone numbers
* Search UPI IDs
* Search bank accounts
* Search email addresses
* Search social media handles

If a match exists:

* Show fraud risk level
* Show complaint count
* Show fraud type
* Show district/state
* Show warning banner

Example warning:
“⚠ Reported in 42 cyber fraud complaints across Uttar Pradesh.”

Police admins can:

* Add offenders
* Verify reports
* Block fake submissions
* Update investigation status

---

## 2. Real-Time Fraud Alerts

Citizens receive:

* SMS/email alerts
* Live fraud notifications
* Trending scam warnings
* OTP fraud alerts
* Phishing alerts

Use:

* EmailJS for email notifications
* WebSocket/Socket.IO for real-time alerts

---

## 3. Fake News Reporting & Verification

Users can:

* Upload screenshots
* Paste links
* Submit videos/images
* Report viral WhatsApp forwards

System should:

* Detect duplicate fake news
* Allow police verification
* Show:

  * VERIFIED
  * FAKE
  * UNDER REVIEW

Add AI-assisted classification:

* Hate speech
* Communal misinformation
* Scam content
* Political misinformation

---

## 4. Citizen Reporting Portal

Users can report:

* Cyber fraud
* UPI scams
* Sextortion
* Fake job scams
* Loan app scams
* Deepfake incidents

Fields:

* Incident type
* Description
* Screenshot upload
* Phone number
* Transaction ID
* Date/time
* Location

Generate complaint tracking ID automatically.

---

## 5. Police Dashboard

Admin dashboard should include:

* Total complaints
* Live fraud heatmap
* Fake news trends
* District-wise analytics
* High-risk phone numbers
* Complaint resolution rate
* Recent alerts

Add:

* Dark mode
* Responsive UI
* Charts and graphs
* Real-time updates

---

# Database Schema (Supabase)

Create tables:

## users

* id
* name
* email
* role
* district
* created_at

## cyber_offenders

* id
* phone_number
* upi_id
* bank_account
* fraud_type
* complaint_count
* risk_level
* district
* status
* created_at

## fake_news_reports

* id
* title
* description
* media_url
* verification_status
* reported_by
* created_at

## cyber_complaints

* id
* tracking_id
* user_id
* incident_type
* description
* evidence_url
* location
* status
* created_at

## alerts

* id
* title
* message
* alert_type
* district
* created_at

---

# Authentication

Use Supabase Auth:

* Citizen login/signup
* Police login
* Admin roles
* OTP/email authentication

---

# UI Design

Theme:

* UP Police branding
* Dark blue + saffron accents
* Government-grade modern interface
* Fast and clean UX

Landing page should include:

* Hero section
* Live fraud counter
* Search bar
* Emergency alert ticker
* “Check Before You Trust” campaign section

---

# Security Requirements

Implement:

* Rate limiting
* JWT authentication
* Input sanitization
* File upload validation
* SQL injection protection
* CAPTCHA for spam prevention

---

# APIs

Build REST APIs using Express:

Examples:

* POST /report-fraud
* GET /search-number/:phone
* POST /report-fake-news
* GET /alerts
* POST /admin/add-offender

---

# Deployment

Deploy:

* Backend on Render
* Frontend on Render/Vercel
* Environment variables for:

  * Supabase URL
  * Supabase anon key
  * JWT secret
  * EmailJS credentials

---

# Extra Advanced Features

Optional:

* AI chatbot for cyber safety guidance
* Voice-based fraud reporting
* Hindi + English multilingual support
* WhatsApp integration
* Face recognition for repeat offenders
* Scam trend prediction dashboard

---

# Final Output Requirements

Generate:

* Complete frontend code
* Complete backend code
* Supabase schema SQL
* API routes
* Authentication flow
* Responsive UI
* Deployment instructions
* .env example
* README.md

The app should be production-ready, scalable, secure, and suitable for a government cyber safety initiative under UP Police.

Title:
“UP Police Cyber Shield – Police Truecaller & Fake News Defense Network”

Tagline:
“Matching speed with speed. Protecting citizens before fraud happens.”
Frontend and Backend folder must be there and mostly files inside them, and when create any table follow this CCTS_ and when user_role is Admin then his panel open and also very light css and colour uses in admin panel 