-- Run in Supabase Dashboard → SQL Editor
-- More opportunities

insert into public.opportunities (title, organization, type, deadline, location, eligibility, link, tags) values
('Software Developer Internship', 'Capitec Bank', 'internship', '2025-08-15', 'Stellenbosch, SA', 'BSc Computer Science or Software Engineering student', 'https://capitecbank.co.za/careers', array['Tech', 'Banking', 'Software']),
('Data Engineering Learnership', 'MTN South Africa', 'learnership', '2025-07-30', 'Johannesburg, SA', 'Diploma or degree in IT or Engineering', 'https://mtn.co.za/careers', array['Data', 'Telecoms', 'Engineering']),
('Finance Graduate Programme', 'PwC South Africa', 'graduate', '2025-09-15', 'Cape Town, SA', 'BCom Accounting or Finance degree', 'https://pwc.co.za/careers', array['Finance', 'Accounting', 'Consulting']),
('Allan Gray Scholarship', 'Allan Gray Orbis Foundation', 'scholarship', '2025-08-31', 'South Africa', 'Grade 12 or 1st year university student with entrepreneurial mindset', 'https://allangrayorbis.org', array['Scholarship', 'Entrepreneurship', 'Funding']),
('Product Design Internship', 'Yoco Technologies', 'internship', '2025-07-25', 'Cape Town, SA', '3rd or 4th year Design or HCI student', 'https://yoco.com/careers', array['Design', 'Product', 'Fintech']),
('Google Africa Developer Scholarship', 'Google / Andela', 'scholarship', '2025-08-01', 'Online', 'Open to all African developers', 'https://andela.com/alc', array['Tech', 'Cloud', 'Scholarship']),
('Consulting Graduate Analyst', 'McKinsey & Company', 'graduate', '2025-10-01', 'Johannesburg, SA', 'Any honours or postgraduate degree', 'https://mckinsey.com/careers', array['Consulting', 'Strategy', 'Business']),
('Cybersecurity Learnership', 'Liquid Intelligent Technologies', 'learnership', '2025-07-20', 'Johannesburg, SA', 'IT diploma or degree', 'https://liquid.tech/careers', array['Cybersecurity', 'Tech', 'Networking']),
('Women in Tech Bootcamp', 'WeThinkCode_', 'bootcamp', '2025-07-10', 'Johannesburg & Cape Town', 'Women identifying, no prior coding experience needed', 'https://wethinkcode.co.za', array['Tech', 'Coding', 'Women in Tech']),
('Startup Pitch Competition', 'Seedstars Africa', 'event', '2025-08-20', 'Johannesburg, SA', 'Early-stage startup founders', 'https://seedstars.com/africa', array['Startups', 'Entrepreneurship', 'Funding']),
('HR Graduate Trainee', 'Shoprite Group', 'graduate', '2025-09-01', 'Cape Town, SA', 'BCom Industrial Psychology or HR Management', 'https://shoprite.co.za/careers', array['HR', 'Retail', 'Business']),
('Cloud Engineering Internship', 'Amazon Web Services', 'internship', '2025-08-10', 'Cape Town, SA', 'Final year CS, Engineering or IT student', 'https://amazon.jobs', array['Cloud', 'AWS', 'Engineering']),
('Absa Group Bursary', 'Absa Group', 'scholarship', '2025-07-31', 'South Africa', 'Full time student in Commerce, IT or Engineering', 'https://absa.co.za/careers', array['Finance', 'Banking', 'Bursary']),
('UX Research Internship', 'Naspers / Prosus', 'internship', '2025-08-05', 'Cape Town, SA', 'Psychology, HCI or Design student', 'https://prosus.com/careers', array['UX', 'Research', 'Tech']),
('Pan-African Hackathon 2025', 'Microsoft Africa', 'event', '2025-09-05', 'Online + Nairobi', 'Open to all African developers and designers', 'https://microsoft.com/africa/hackathon', array['Hackathon', 'Tech', 'Innovation']);

-- Seed community posts (replace the UUIDs below with real profile IDs from your users table, or run after creating test users)
-- To get your test user ID: select id from auth.users limit 5;

-- Example posts (update user_id with real IDs from your DB)
-- insert into public.posts (user_id, content, category) values
-- ('<your-user-id>', 'Just got accepted into the Deloitte Graduate Programme! For anyone applying — focus on your case study prep and be authentic in the interview. Happy to answer questions 🎉', 'career_win'),
-- ('<your-user-id>', 'Anyone else applying to the AWS Cloud Bootcamp? Would love to connect and study together before the programme starts.', 'question'),
-- ('<your-user-id>', 'Tips for a strong bursary application: 1) Start early 2) Get your academic transcripts ready 3) Write a genuine motivation letter — they can tell when it''s copy-pasted. Good luck everyone!', 'advice'),
-- ('<your-user-id>', 'Just finished my McKinsey interview. The problem solving round is intense but very fair. They want to see your thinking process more than the right answer.', 'interview'),
-- ('<your-user-id>', 'Sharing this gem — WeThinkCode_ is fully free and they place you in real companies after. No excuses not to apply if you''re in JHB or CT.', 'opportunity');
