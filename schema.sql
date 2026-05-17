-- SQL Script for Supabase SQL Editor
-- Creates tables with 'ccts_' prefix and inserts seed data.

-- 1. DROP TABLES IF THEY EXIST (for clean installations)
DROP TABLE IF EXISTS ccts_alerts CASCADE;
DROP TABLE IF EXISTS ccts_cyber_complaints CASCADE;
DROP TABLE IF EXISTS ccts_fake_news_reports CASCADE;
DROP TABLE IF EXISTS ccts_cyber_offenders CASCADE;
DROP TABLE IF EXISTS ccts_users CASCADE;

-- 2. CREATE ccts_users
CREATE TABLE ccts_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255), -- Secure password column
    role VARCHAR(50) DEFAULT 'citizen', -- 'citizen', 'police', 'admin'
    district VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE ccts_cyber_offenders (Police Truecaller Registry)
CREATE TABLE ccts_cyber_offenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(50),
    upi_id VARCHAR(100),
    bank_account VARCHAR(100),
    fraud_type VARCHAR(100) NOT NULL,
    complaint_count INT DEFAULT 1,
    risk_level VARCHAR(50) DEFAULT 'medium', -- 'high', 'medium', 'low'
    district VARCHAR(100),
    status VARCHAR(50) DEFAULT 'verified', -- 'verified', 'unverified'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE ccts_fake_news_reports
CREATE TABLE ccts_fake_news_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    media_url TEXT,
    verification_status VARCHAR(50) DEFAULT 'UNDER REVIEW', -- 'VERIFIED', 'FAKE', 'UNDER REVIEW'
    reported_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CREATE ccts_cyber_complaints
CREATE TABLE ccts_cyber_complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_id VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES ccts_users(id) ON DELETE SET NULL,
    incident_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    evidence_url TEXT,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'UNDER INVESTIGATION', 'RESOLVED', 'REJECTED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CREATE ccts_alerts
CREATE TABLE ccts_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    alert_type VARCHAR(100) DEFAULT 'scam', -- 'scam', 'phishing', 'otp', 'general'
    district VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Optional - since we are building a government app with service-role & session control, we can keep it open or bypass via service key)
ALTER TABLE ccts_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ccts_cyber_offenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ccts_fake_news_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ccts_cyber_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE ccts_alerts ENABLE ROW LEVEL SECURITY;

-- Allow all operations for Service Role key
CREATE POLICY "Allow service role all users" ON ccts_users TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role all offenders" ON ccts_cyber_offenders TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role all fake news" ON ccts_fake_news_reports TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role all complaints" ON ccts_cyber_complaints TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role all alerts" ON ccts_alerts TO service_role USING (true) WITH CHECK (true);

-- Allow public reads on offenders (for Truecaller search), alerts, and fake news verification status
CREATE POLICY "Allow public read offenders" ON ccts_cyber_offenders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read alerts" ON ccts_alerts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read fake news" ON ccts_fake_news_reports FOR SELECT TO anon, authenticated USING (true);

-- 7. INSERT SEED DATA
-- Insert initial Seed Admins and Police Users (For development login)
-- Note: In a real system, these would also exist in Supabase Auth. We can handle citizen dynamic signups through auth as well.
INSERT INTO ccts_users (email, name, password, role, district) VALUES
('admin@ccts.uppolice.gov.in', 'Director General Admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin', 'Lucknow'),
('officer.verma@ccts.uppolice.gov.in', 'Inspector Rajesh Verma', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'police', 'Kanpur');

-- Insert reported offenders (Police Truecaller Mock Data)
INSERT INTO ccts_cyber_offenders (phone_number, upi_id, bank_account, fraud_type, complaint_count, risk_level, district, status) VALUES
('+919876543210', 'scammer123@ybl', '123456789012', 'UPI Double Money Scam', 42, 'high', 'Lucknow', 'verified'),
('+918765432109', 'lotterywinner@paytm', '987654321098', 'Kaun Banega Crorepati Lottery Fraud', 18, 'high', 'Noida', 'verified'),
('+917654321098', 'joboffer@okhdfcbank', '554433221100', 'Fake Part-Time Job Telegram Scam', 7, 'medium', 'Ghaziabad', 'verified'),
(NULL, 'sextortionist@paytm', NULL, 'Sextortion / Video Call Blackmail', 24, 'high', 'Varanasi', 'verified'),
(NULL, NULL, '443322119988', 'Immediate Loan App Harassment', 12, 'medium', 'Agra', 'verified');

-- Insert Initial Active Alerts
INSERT INTO ccts_alerts (title, message, alert_type, district) VALUES
('🚨 Fake Electricity Bill SMS scam is peaking!', 'Citizens are receiving SMS claiming electricity will be disconnected if they do not call a personal mobile number. Do not pay or call! UP Police is investigating.', 'scam', 'All Districts'),
('⚠ Fake Part-Time Job Offers on Telegram', 'Scammers are offering money for rating hotels or liking YouTube videos, then forcing victims to invest in VIP groups. Report such contacts immediately.', 'scam', 'Noida'),
('🔒 Never Share OTP for Aadhaar Updates', 'Fraudsters posing as UIDAI officials are calling citizens asking for OTP to verify Aadhaar cards. UP Police reminds you: Police or Govt agencies never ask for OTP.', 'otp', 'All Districts');

-- Insert Mock Fake News Reports
INSERT INTO ccts_fake_news_reports (title, description, media_url, verification_status, reported_by) VALUES
('Communal Clash video circulating in Meerut', 'A 3-year-old viral video from a foreign country is being shared claiming to be a recent clash in Meerut to incite public unrest.', 'https://example.com/meerut-video.mp4', 'FAKE', 'Citizen Ankit'),
('Govt offering Rs 5000 allowance to all students', 'A WhatsApp forward claiming the UP government is distributing Rs 5000 under a mock scheme. Official handles have confirmed no such scheme exists.', 'https://example.com/fake-circular.jpg', 'FAKE', 'Citizen Priya'),
('UP Police establishes Cyber Shield Helpline 1930', 'A post informing citizens about the official national cyber crime helpline 1930 and the local district cyber cell portals.', 'https://example.com/cyber-shield.png', 'VERIFIED', 'Inspector Rajesh Verma');
