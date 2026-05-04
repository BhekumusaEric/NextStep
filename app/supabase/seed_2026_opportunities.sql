-- Seed: Real Open Opportunities (as of May 2026)
-- Run in Supabase Dashboard → SQL Editor

-- Archive everything that has already closed
UPDATE public.opportunities
SET is_archived = true
WHERE deadline < '2026-05-03' AND is_archived = false;

-- Remove previously seeded system opportunities to avoid duplicates
DELETE FROM public.opportunities WHERE submitted_by IS NULL AND status = 'approved' AND is_archived = false;

INSERT INTO public.opportunities
  (title, organization, type, deadline, location, eligibility, link, tags, status, is_archived)
VALUES

-- ============================================================
-- BOOTCAMPS & SKILLS PROGRAMMES
-- ============================================================
(
  'Software Development Programme 2026',
  'WeThinkCode_',
  'bootcamp',
  '2026-07-31',
  'Johannesburg & Cape Town',
  'Ages 17–37, no prior coding experience required, SA citizen or permanent resident',
  'https://www.wethinkcode.co.za/apply',
  ARRAY['Tech','Coding','Free','Software Engineering'],
  'approved', false
),
(
  'AWS re/Start Cloud Programme — Cohort 2026',
  'Amazon Web Services',
  'bootcamp',
  '2026-06-30',
  'Cape Town & Johannesburg (Hybrid)',
  'Unemployed or underemployed adults, no cloud experience needed, SA resident',
  'https://aws.amazon.com/training/restart/',
  ARRAY['Cloud','AWS','DevOps','Free'],
  'approved', false
),
(
  'Microsoft LEAP Apprenticeship 2026',
  'Microsoft Africa',
  'bootcamp',
  '2026-08-01',
  'Johannesburg (Hybrid)',
  'Career changers and non-traditional backgrounds in tech, 18+',
  'https://www.microsoft.com/en-za/leap',
  ARRAY['Microsoft','Software Engineering','Apprenticeship','Free'],
  'approved', false
),
(
  'Umuzi Full Stack Web Development 2026',
  'Umuzi',
  'bootcamp',
  '2026-07-15',
  'Johannesburg (Braamfontein)',
  'Ages 18–30, matric certificate, SA citizen, no experience needed',
  'https://www.umuzi.org/apply',
  ARRAY['Web Development','JavaScript','Full Stack','Free'],
  'approved', false
),
(
  'Capaciti Data Science & AI Programme',
  'Capaciti (iXperience)',
  'bootcamp',
  '2026-09-30',
  'Cape Town & Johannesburg',
  'Matric or higher, interest in data and technology',
  'https://capaciti.org.za',
  ARRAY['Data Science','AI','Machine Learning','Free'],
  'approved', false
),
(
  'Google Career Certificates — 2026 Cohort',
  'Google / Coursera',
  'bootcamp',
  '2026-12-31',
  'Online',
  'Open to all, no degree required, self-paced',
  'https://grow.google/certificates/',
  ARRAY['Google','Data Analytics','UX Design','IT Support','Online'],
  'approved', false
),
(
  'Harambee Youth Employment Accelerator',
  'Harambee',
  'bootcamp',
  '2026-11-30',
  'Johannesburg, Cape Town, Durban',
  'Ages 18–35, matric, unemployed youth, SA citizen',
  'https://www.harambee.co.za',
  ARRAY['Employment','Youth','Skills','Free'],
  'approved', false
),
(
  'SAP Skills for Africa — 2026 Intake',
  'SAP',
  'bootcamp',
  '2026-08-31',
  'Johannesburg & Online',
  'Recent graduates in IT, Engineering or Business, under 35',
  'https://www.sap.com/africa/about/social-responsibility/skills-for-africa.html',
  ARRAY['SAP','ERP','Business Technology','Enterprise'],
  'approved', false
),
(
  'Explore Data Science Academy — 2026',
  'EDSA',
  'bootcamp',
  '2026-07-01',
  'Cape Town & Online',
  'Matric with maths, passion for data, SA citizen',
  'https://edsa.co.za',
  ARRAY['Data Science','Machine Learning','Python','Free'],
  'approved', false
),

-- ============================================================
-- INTERNSHIPS
-- ============================================================
(
  'Software Engineering Intern — 2026/27',
  'Capitec Bank',
  'internship',
  '2026-07-31',
  'Stellenbosch, Western Cape',
  'BSc Computer Science or Software Engineering, 3rd/4th year student',
  'https://www.capitecbank.co.za/about-us/careers',
  ARRAY['Software Engineering','Banking','Fintech'],
  'approved', false
),
(
  'Data Analyst Intern — 2026',
  'Standard Bank',
  'internship',
  '2026-06-30',
  'Johannesburg, Gauteng',
  'BCom Statistics, Data Science or related, final year or recent graduate',
  'https://www.standardbank.co.za/southafrica/personal/about-us/careers',
  ARRAY['Data','Analytics','Banking','SQL'],
  'approved', false
),
(
  'UX/UI Design Intern',
  'Yoco Technologies',
  'internship',
  '2026-07-15',
  'Cape Town (Hybrid)',
  '3rd or 4th year Design, HCI or related student',
  'https://www.yoco.com/za/careers/',
  ARRAY['UX','Design','Fintech','Product'],
  'approved', false
),
(
  'Cloud Solutions Intern — 2026',
  'Amazon Web Services',
  'internship',
  '2026-08-31',
  'Cape Town, Western Cape',
  'Final year CS, Engineering or IT student',
  'https://www.amazon.jobs/en/teams/internships-for-students',
  ARRAY['Cloud','AWS','Engineering','Tech'],
  'approved', false
),
(
  'Software Development Intern',
  'Takealot Group',
  'internship',
  '2026-07-20',
  'Cape Town, Western Cape',
  'BSc Computer Science or Software Engineering, 3rd year+',
  'https://www.takealot.com/careers',
  ARRAY['Software','E-commerce','Python','Java'],
  'approved', false
),
(
  'Cybersecurity Intern — 2026',
  'Vodacom',
  'internship',
  '2026-08-01',
  'Midrand, Gauteng',
  'IT Security, Computer Science or related degree student',
  'https://www.vodacom.co.za/vodacom/about-us/careers',
  ARRAY['Cybersecurity','Telecoms','Networking','Tech'],
  'approved', false
),
(
  'Product Management Intern',
  'Naspers / Prosus',
  'internship',
  '2026-09-01',
  'Cape Town (Hybrid)',
  'Final year Business, Engineering or CS student',
  'https://www.prosus.com/careers/',
  ARRAY['Product','Management','Tech','Strategy'],
  'approved', false
),
(
  'AI/ML Research Intern',
  'Google South Africa',
  'internship',
  '2026-09-15',
  'Johannesburg (Hybrid)',
  'MSc or Honours in CS, Mathematics or related with ML focus',
  'https://careers.google.com/jobs/results/?location=South+Africa',
  ARRAY['AI','Machine Learning','Research','Google'],
  'approved', false
),
(
  'Finance & Accounting Intern',
  'Deloitte South Africa',
  'internship',
  '2026-07-31',
  'Johannesburg & Cape Town',
  'BCom Accounting or Finance, 2nd year+',
  'https://www2.deloitte.com/za/en/careers.html',
  ARRAY['Finance','Accounting','Consulting','Audit'],
  'approved', false
),
(
  'Marketing & Digital Intern',
  'MTN South Africa',
  'internship',
  '2026-08-15',
  'Johannesburg, Gauteng',
  'BCom Marketing, Communications or Digital Media student',
  'https://www.mtn.co.za/Pages/Careers.aspx',
  ARRAY['Marketing','Digital','Telecoms','Brand'],
  'approved', false
),
(
  'Backend Engineering Intern',
  'Investec',
  'internship',
  '2026-07-31',
  'Johannesburg & Cape Town',
  'BSc Computer Science or Software Engineering, 3rd year+',
  'https://www.investec.com/en_za/welcome-to-investec/careers.html',
  ARRAY['Backend','Engineering','Finance','Java'],
  'approved', false
),
(
  'Data Engineering Intern',
  'Discovery Health',
  'internship',
  '2026-08-31',
  'Johannesburg, Gauteng',
  'BSc Data Science, Statistics or Computer Science, final year',
  'https://www.discovery.co.za/portal/individual/careers',
  ARRAY['Data','Engineering','Healthcare','Python'],
  'approved', false
),

-- ============================================================
-- LEARNERSHIPS
-- ============================================================
(
  'IT Systems Development Learnership (NQF 5) — 2026',
  'Accenture South Africa',
  'learnership',
  '2026-06-30',
  'Johannesburg & Cape Town',
  'Matric with Maths, unemployed youth aged 18–35, SA citizen',
  'https://www.accenture.com/za-en/careers',
  ARRAY['IT','Systems','NQF5','Learnership'],
  'approved', false
),
(
  'Data Engineering Learnership — 2026',
  'MTN South Africa',
  'learnership',
  '2026-07-31',
  'Johannesburg, Gauteng',
  'Diploma or degree in IT or Engineering, unemployed, SA citizen',
  'https://www.mtn.co.za/Pages/Careers.aspx',
  ARRAY['Data','Engineering','Telecoms','Learnership'],
  'approved', false
),
(
  'Software Testing Learnership',
  'BCX (Business Connexion)',
  'learnership',
  '2026-08-15',
  'Pretoria, Gauteng',
  'IT diploma or degree, no experience required, SA citizen',
  'https://www.bcx.co.za/careers',
  ARRAY['QA','Testing','Software','IT'],
  'approved', false
),
(
  'Finance Learnership (NQF 4) — 2026',
  'Absa Group',
  'learnership',
  '2026-07-01',
  'Johannesburg & Cape Town',
  'Matric with Maths and Accounting, unemployed youth, SA citizen',
  'https://www.absa.co.za/about-absa/careers/',
  ARRAY['Finance','Banking','NQF4','Learnership'],
  'approved', false
),
(
  'Network Engineering Learnership',
  'Liquid Intelligent Technologies',
  'learnership',
  '2026-06-30',
  'Johannesburg, Gauteng',
  'IT diploma, CCNA advantageous, SA citizen',
  'https://www.liquid.tech/careers',
  ARRAY['Networking','CCNA','IT','Infrastructure'],
  'approved', false
),
(
  'Digital Marketing Learnership',
  'Vodacom',
  'learnership',
  '2026-08-31',
  'Midrand, Gauteng',
  'Matric or diploma in Marketing or Communications, unemployed youth',
  'https://www.vodacom.co.za/vodacom/about-us/careers',
  ARRAY['Digital Marketing','Telecoms','Learnership','NQF4'],
  'approved', false
),

-- ============================================================
-- GRADUATE PROGRAMMES
-- ============================================================
(
  'Graduate Development Programme — 2027 Intake',
  'Deloitte South Africa',
  'graduate',
  '2026-10-31',
  'Johannesburg & Cape Town',
  'Honours or postgraduate degree in Accounting, Finance, IT or Engineering',
  'https://www2.deloitte.com/za/en/careers/students-and-graduates.html',
  ARRAY['Consulting','Audit','Finance','Graduate'],
  'approved', false
),
(
  'Technology Graduate Programme — 2027',
  'Standard Bank Group',
  'graduate',
  '2026-09-30',
  'Johannesburg, Gauteng',
  'BSc/BCom in CS, IT, Engineering or related, completed degree',
  'https://www.standardbank.co.za/southafrica/personal/about-us/careers',
  ARRAY['Tech','Banking','Graduate','Software'],
  'approved', false
),
(
  'Business Analyst Graduate Programme',
  'PwC South Africa',
  'graduate',
  '2026-10-15',
  'Cape Town & Johannesburg',
  'BCom, BSc or Engineering degree, strong analytical skills',
  'https://www.pwc.co.za/en/careers/student-careers.html',
  ARRAY['Business Analysis','Consulting','Finance','Graduate'],
  'approved', false
),
(
  'Software Engineer Graduate — 2027',
  'Amazon (AWS)',
  'graduate',
  '2026-10-31',
  'Cape Town, Western Cape',
  'BSc Computer Science or Software Engineering, completed degree',
  'https://www.amazon.jobs/en/teams/university-tech',
  ARRAY['Software Engineering','Cloud','AWS','Graduate'],
  'approved', false
),
(
  'Management Consulting Analyst — 2027',
  'McKinsey & Company',
  'graduate',
  '2026-11-01',
  'Johannesburg, Gauteng',
  'Any honours or postgraduate degree, exceptional academic record',
  'https://www.mckinsey.com/careers/students',
  ARRAY['Consulting','Strategy','Management','Graduate'],
  'approved', false
),
(
  'Engineering Graduate Programme — 2027',
  'Eskom',
  'graduate',
  '2026-09-01',
  'Multiple locations, South Africa',
  'BSc/BEng in Electrical, Mechanical or Civil Engineering',
  'https://www.eskom.co.za/careers/',
  ARRAY['Engineering','Energy','Graduate','Infrastructure'],
  'approved', false
),
(
  'Human Capital Graduate Programme',
  'Shoprite Group',
  'graduate',
  '2026-09-15',
  'Cape Town, Western Cape',
  'BCom Industrial Psychology or HR Management, completed degree',
  'https://www.shoprite.co.za/careers',
  ARRAY['HR','Retail','Graduate','People'],
  'approved', false
),
(
  'Digital & Technology Graduate Programme',
  'Nedbank',
  'graduate',
  '2026-08-31',
  'Johannesburg, Gauteng',
  'BSc/BCom in IT, Data Science or Engineering, completed degree',
  'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/aboutus/careers.html',
  ARRAY['Tech','Banking','Graduate','Digital'],
  'approved', false
),
(
  'Actuarial Graduate Programme',
  'Old Mutual',
  'graduate',
  '2026-09-30',
  'Cape Town, Western Cape',
  'BSc Actuarial Science or Mathematics, completed degree',
  'https://www.oldmutual.co.za/careers/',
  ARRAY['Actuarial','Finance','Insurance','Graduate'],
  'approved', false
),

-- ============================================================
-- SCHOLARSHIPS & BURSARIES
-- ============================================================
(
  'Allan Gray Fellowship — 2027 Intake',
  'Allan Gray Orbis Foundation',
  'scholarship',
  '2026-08-31',
  'South Africa',
  'Grade 12 or 1st/2nd year university, entrepreneurial mindset, SA citizen',
  'https://www.allangrayorbis.org/fellowship/',
  ARRAY['Scholarship','Entrepreneurship','Fellowship','Funding'],
  'approved', false
),
(
  'Absa Group Bursary — 2027',
  'Absa Group',
  'scholarship',
  '2026-09-30',
  'South Africa',
  'Full-time student in Commerce, IT or Engineering, financial need, SA citizen',
  'https://www.absa.co.za/about-absa/careers/bursaries/',
  ARRAY['Bursary','Finance','Banking','Funding'],
  'approved', false
),
(
  'Sasol Bursary Programme — 2027',
  'Sasol',
  'scholarship',
  '2026-08-31',
  'South Africa',
  'Engineering, Science or Technology student, financial need, SA citizen',
  'https://www.sasol.com/careers/bursaries',
  ARRAY['Engineering','Science','Bursary','Energy'],
  'approved', false
),
(
  'Google Generation Scholarship — EMEA 2026',
  'Google',
  'scholarship',
  '2026-10-01',
  'Sub-Saharan Africa (Online)',
  'Undergraduate or graduate CS student, demonstrated financial need',
  'https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship-emea',
  ARRAY['Google','CS','Scholarship','Tech'],
  'approved', false
),
(
  'Mastercard Foundation Scholars Program — 2027',
  'Mastercard Foundation',
  'scholarship',
  '2026-10-31',
  'Various African Universities',
  'Academically talented but financially disadvantaged African students',
  'https://mastercardfdn.org/all/scholars/',
  ARRAY['Scholarship','Pan-African','Funding','Leadership'],
  'approved', false
),
(
  'MTN Bursary Programme — 2027',
  'MTN South Africa',
  'scholarship',
  '2026-08-15',
  'South Africa',
  'Engineering, IT or Commerce student, financial need, SA citizen',
  'https://www.mtn.co.za/Pages/Careers.aspx',
  ARRAY['Telecoms','Engineering','Bursary','IT'],
  'approved', false
),
(
  'Investec Bursary — 2027 Intake',
  'Investec',
  'scholarship',
  '2026-09-15',
  'South Africa',
  'BCom, BSc or Engineering student, strong academic record, SA citizen',
  'https://www.investec.com/en_za/welcome-to-investec/careers/bursaries.html',
  ARRAY['Finance','Banking','Bursary','Investment'],
  'approved', false
),
(
  'Nedbank Bursary Programme',
  'Nedbank',
  'scholarship',
  '2026-08-31',
  'South Africa',
  'IT, Data Science, Engineering or Finance student, financial need',
  'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/aboutus/careers.html',
  ARRAY['Banking','IT','Bursary','Finance'],
  'approved', false
),

-- ============================================================
-- HACKATHONS & EVENTS (Mid 2026)
-- ============================================================
(
  'Hack the Future 2026',
  'Accenture South Africa',
  'event',
  '2026-09-30',
  'Johannesburg & Cape Town',
  'Students and young professionals in tech, open to all',
  'https://hackthefuture.co.za',
  ARRAY['Hackathon','Tech','Innovation','Accenture'],
  'approved', false
),
(
  'Microsoft Imagine Cup 2026',
  'Microsoft',
  'event',
  '2026-11-30',
  'Online (Global)',
  'Student developers worldwide, team of 1–4',
  'https://imaginecup.microsoft.com',
  ARRAY['Hackathon','Microsoft','AI','Global','Prize'],
  'approved', false
),
(
  'NASA Space Apps Challenge 2026',
  'NASA / SANSA',
  'event',
  '2026-10-03',
  'Johannesburg, Cape Town & Online',
  'Open to all — developers, scientists, designers, storytellers',
  'https://www.spaceappschallenge.org',
  ARRAY['Hackathon','Space','NASA','Innovation'],
  'approved', false
),
(
  'AfricArena Summit & Pitch Competition 2026',
  'AfricArena',
  'event',
  '2026-11-15',
  'Cape Town, Western Cape',
  'African tech startups and entrepreneurs',
  'https://africarena.com',
  ARRAY['Startup','Pitch','Funding','Pan-African'],
  'approved', false
),
(
  'Google Developer Student Clubs Summit 2026',
  'Google DSC',
  'event',
  '2026-09-05',
  'Multiple SA Universities',
  'University students interested in technology',
  'https://developers.google.com/community/gdsc',
  ARRAY['Google','Students','Tech','Community'],
  'approved', false
),
(
  'Women in Tech Summit SA 2026',
  'WomHub',
  'event',
  '2026-09-25',
  'Johannesburg (Hybrid)',
  'Women in technology and entrepreneurship',
  'https://womhub.com',
  ARRAY['Women in Tech','Networking','Summit','Diversity'],
  'approved', false
),
(
  'Seedstars Johannesburg 2026',
  'Seedstars',
  'event',
  '2026-10-20',
  'Johannesburg, Gauteng',
  'Early-stage startups (pre-Series A)',
  'https://www.seedstars.com/communities/johannesburg/',
  ARRAY['Startup','Pitch','Funding','Entrepreneurship'],
  'approved', false
),
(
  'Standard Bank FinTech Hackathon 2026',
  'Standard Bank',
  'event',
  '2026-08-20',
  'Johannesburg (In-person)',
  'Open to all developers, designers and entrepreneurs',
  'https://www.standardbank.co.za/southafrica/personal/about-us/newsroom',
  ARRAY['Hackathon','Fintech','Banking','Innovation'],
  'approved', false
),
(
  'MTN App of the Year 2026',
  'MTN South Africa',
  'event',
  '2026-09-30',
  'South Africa (Online submissions)',
  'Open to all South African developers',
  'https://appoftheyear.co.za',
  ARRAY['Mobile','App Development','Competition','Prize'],
  'approved', false
);
