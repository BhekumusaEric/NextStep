-- Step 1: Add is_archived column
ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false;

-- Step 2: Archive all past opportunities (deadline already passed)
UPDATE public.opportunities
SET is_archived = true
WHERE deadline < CURRENT_DATE;

-- Step 3: Clear old seeded data to avoid duplicates
DELETE FROM public.opportunities WHERE submitted_by IS NULL AND status = 'approved';

-- Step 4: Seed real, current opportunities
INSERT INTO public.opportunities
  (title, organization, type, deadline, location, eligibility, link, tags, status, is_archived)
VALUES

-- ============================================================
-- SKILLS TRAINING PROGRAMS
-- ============================================================
(
  'Software Development Programme',
  'WeThinkCode_',
  'bootcamp',
  '2026-01-31',
  'Johannesburg & Cape Town',
  'Ages 17–37, no prior coding experience required, SA citizen or permanent resident',
  'https://www.wethinkcode.co.za/apply',
  ARRAY['Tech','Coding','Free','Software Engineering'],
  'approved', false
),
(
  'Data Science & AI Programme',
  'Capaciti (iXperience)',
  'bootcamp',
  '2025-09-30',
  'Cape Town & Johannesburg',
  'Matric or higher, interest in data and technology',
  'https://capaciti.org.za',
  ARRAY['Data Science','AI','Machine Learning','Free'],
  'approved', false
),
(
  'Full Stack Web Development Bootcamp',
  'Umuzi',
  'bootcamp',
  '2025-10-31',
  'Johannesburg (Braamfontein)',
  'Ages 18–30, matric certificate, SA citizen',
  'https://www.umuzi.org/apply',
  ARRAY['Web Development','JavaScript','Full Stack','Free'],
  'approved', false
),
(
  'Tech Incubator Programme',
  'mLabs',
  'bootcamp',
  '2025-11-30',
  'Johannesburg, Pretoria & Cape Town',
  'Early-stage tech entrepreneurs and developers',
  'https://www.mlabs.co.za',
  ARRAY['Entrepreneurship','Mobile','Tech','Incubator'],
  'approved', false
),
(
  'AWS re/Start Programme',
  'Amazon Web Services (AWS)',
  'bootcamp',
  '2025-09-15',
  'Cape Town & Johannesburg',
  'Unemployed or underemployed adults, no cloud experience needed',
  'https://aws.amazon.com/training/restart/',
  ARRAY['Cloud','AWS','DevOps','Free'],
  'approved', false
),
(
  'Microsoft LEAP Apprenticeship',
  'Microsoft Africa',
  'bootcamp',
  '2025-10-01',
  'Johannesburg (Hybrid)',
  'Career changers and non-traditional backgrounds in tech',
  'https://www.microsoft.com/en-za/leap',
  ARRAY['Microsoft','Software Engineering','Apprenticeship'],
  'approved', false
),
(
  'Google Career Certificates',
  'Google / Coursera',
  'bootcamp',
  '2025-12-31',
  'Online',
  'Open to all, no degree required',
  'https://grow.google/certificates/',
  ARRAY['Google','Data Analytics','UX Design','IT Support','Online'],
  'approved', false
),
(
  'Explore Data Science Academy',
  'EDSA',
  'bootcamp',
  '2025-09-01',
  'Cape Town & Online',
  'Matric with maths, passion for data',
  'https://edsa.co.za',
  ARRAY['Data Science','Machine Learning','Python','Free'],
  'approved', false
),
(
  'SAP Skills for Africa',
  'SAP',
  'bootcamp',
  '2025-10-15',
  'Johannesburg & Online',
  'Recent graduates in IT, Engineering or Business',
  'https://www.sap.com/africa/about/social-responsibility/skills-for-africa.html',
  ARRAY['SAP','ERP','Business Technology','Enterprise'],
  'approved', false
),
(
  'Harambee Youth Employment Accelerator',
  'Harambee',
  'bootcamp',
  '2025-12-31',
  'Johannesburg, Cape Town, Durban',
  'Ages 18–35, matric, unemployed youth',
  'https://www.harambee.co.za',
  ARRAY['Employment','Youth','Skills','Free'],
  'approved', false
),

-- ============================================================
-- INTERNSHIPS
-- ============================================================
(
  'Software Engineering Intern',
  'Capitec Bank',
  'internship',
  '2025-08-31',
  'Stellenbosch, Western Cape',
  'BSc Computer Science, Software Engineering or related, 3rd/4th year',
  'https://www.capitecbank.co.za/about-us/careers',
  ARRAY['Software Engineering','Banking','Fintech'],
  'approved', false
),
(
  'Data Analyst Intern',
  'Standard Bank',
  'internship',
  '2025-09-15',
  'Johannesburg, Gauteng',
  'BCom Statistics, Data Science or related, final year',
  'https://www.standardbank.co.za/southafrica/personal/about-us/careers',
  ARRAY['Data','Analytics','Banking','SQL'],
  'approved', false
),
(
  'UX/UI Design Intern',
  'Yoco Technologies',
  'internship',
  '2025-08-15',
  'Cape Town (Hybrid)',
  '3rd or 4th year Design, HCI or related student',
  'https://www.yoco.com/za/careers/',
  ARRAY['UX','Design','Fintech','Product'],
  'approved', false
),
(
  'Cloud Solutions Intern',
  'Amazon Web Services',
  'internship',
  '2025-09-30',
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
  '2025-08-20',
  'Cape Town, Western Cape',
  'BSc Computer Science or Software Engineering, 3rd year+',
  'https://www.takealot.com/careers',
  ARRAY['Software','E-commerce','Python','Java'],
  'approved', false
),
(
  'Cybersecurity Intern',
  'Vodacom',
  'internship',
  '2025-09-01',
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
  '2025-10-01',
  'Cape Town (Hybrid)',
  'Final year Business, Engineering or CS student',
  'https://www.prosus.com/careers/',
  ARRAY['Product','Management','Tech','Strategy'],
  'approved', false
),
(
  'Finance & Accounting Intern',
  'Deloitte South Africa',
  'internship',
  '2025-08-31',
  'Johannesburg & Cape Town',
  'BCom Accounting or Finance, 2nd year+',
  'https://www2.deloitte.com/za/en/careers.html',
  ARRAY['Finance','Accounting','Consulting','Audit'],
  'approved', false
),
(
  'Marketing & Communications Intern',
  'MTN South Africa',
  'internship',
  '2025-09-15',
  'Johannesburg, Gauteng',
  'BCom Marketing or Communications student',
  'https://www.mtn.co.za/Pages/Careers.aspx',
  ARRAY['Marketing','Communications','Telecoms','Brand'],
  'approved', false
),
(
  'AI/ML Research Intern',
  'Google South Africa',
  'internship',
  '2025-10-15',
  'Johannesburg (Hybrid)',
  'MSc or Honours in CS, Mathematics or related with ML focus',
  'https://careers.google.com/jobs/results/?location=South+Africa',
  ARRAY['AI','Machine Learning','Research','Google'],
  'approved', false
),

-- ============================================================
-- LEARNERSHIPS
-- ============================================================
(
  'IT Systems Development Learnership (NQF 5)',
  'Accenture South Africa',
  'learnership',
  '2025-09-30',
  'Johannesburg & Cape Town',
  'Matric with Maths, unemployed youth aged 18–35',
  'https://www.accenture.com/za-en/careers',
  ARRAY['IT','Systems','NQF5','Learnership'],
  'approved', false
),
(
  'Data Engineering Learnership',
  'MTN South Africa',
  'learnership',
  '2025-08-31',
  'Johannesburg, Gauteng',
  'Diploma or degree in IT or Engineering, unemployed',
  'https://www.mtn.co.za/Pages/Careers.aspx',
  ARRAY['Data','Engineering','Telecoms','Learnership'],
  'approved', false
),
(
  'Software Testing Learnership',
  'BCX (Business Connexion)',
  'learnership',
  '2025-09-15',
  'Pretoria, Gauteng',
  'IT diploma or degree, no experience required',
  'https://www.bcx.co.za/careers',
  ARRAY['QA','Testing','Software','IT'],
  'approved', false
),
(
  'Network Engineering Learnership',
  'Liquid Intelligent Technologies',
  'learnership',
  '2025-08-15',
  'Johannesburg, Gauteng',
  'IT diploma, CCNA advantageous',
  'https://www.liquid.tech/careers',
  ARRAY['Networking','CCNA','IT','Infrastructure'],
  'approved', false
),
(
  'Finance Learnership (NQF 4)',
  'Absa Group',
  'learnership',
  '2025-10-01',
  'Johannesburg & Cape Town',
  'Matric with Maths and Accounting, unemployed youth',
  'https://www.absa.co.za/about-absa/careers/',
  ARRAY['Finance','Banking','NQF4','Learnership'],
  'approved', false
),

-- ============================================================
-- GRADUATE PROGRAMMES
-- ============================================================
(
  'Graduate Development Programme',
  'Deloitte South Africa',
  'graduate',
  '2025-10-31',
  'Johannesburg & Cape Town',
  'Honours or postgraduate degree in Accounting, Finance, IT or Engineering',
  'https://www2.deloitte.com/za/en/careers/students-and-graduates.html',
  ARRAY['Consulting','Audit','Finance','Graduate'],
  'approved', false
),
(
  'Technology Graduate Programme',
  'Standard Bank Group',
  'graduate',
  '2025-09-30',
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
  '2025-10-15',
  'Cape Town & Johannesburg',
  'BCom, BSc or Engineering degree, strong analytical skills',
  'https://www.pwc.co.za/en/careers/student-careers.html',
  ARRAY['Business Analysis','Consulting','Finance','Graduate'],
  'approved', false
),
(
  'Engineering Graduate Programme',
  'Eskom',
  'graduate',
  '2025-09-01',
  'Multiple locations, South Africa',
  'BSc/BEng in Electrical, Mechanical or Civil Engineering',
  'https://www.eskom.co.za/careers/',
  ARRAY['Engineering','Energy','Graduate','Infrastructure'],
  'approved', false
),
(
  'Management Consulting Analyst',
  'McKinsey & Company',
  'graduate',
  '2025-11-01',
  'Johannesburg, Gauteng',
  'Any honours or postgraduate degree, exceptional academic record',
  'https://www.mckinsey.com/careers/students',
  ARRAY['Consulting','Strategy','Management','Graduate'],
  'approved', false
),
(
  'Software Engineer Graduate',
  'Amazon (AWS)',
  'graduate',
  '2025-10-31',
  'Cape Town, Western Cape',
  'BSc Computer Science or Software Engineering, completed degree',
  'https://www.amazon.jobs/en/teams/university-tech',
  ARRAY['Software Engineering','Cloud','AWS','Graduate'],
  'approved', false
),
(
  'Human Capital Graduate Programme',
  'Shoprite Group',
  'graduate',
  '2025-09-15',
  'Cape Town, Western Cape',
  'BCom Industrial Psychology or HR Management',
  'https://www.shoprite.co.za/careers',
  ARRAY['HR','Retail','Graduate','People'],
  'approved', false
),

-- ============================================================
-- SCHOLARSHIPS & BURSARIES
-- ============================================================
(
  'Allan Gray Fellowship',
  'Allan Gray Orbis Foundation',
  'scholarship',
  '2026-03-31',
  'South Africa',
  'Grade 12 or 1st/2nd year university, entrepreneurial mindset, SA citizen',
  'https://www.allangrayorbis.org/fellowship/',
  ARRAY['Scholarship','Entrepreneurship','Fellowship','Funding'],
  'approved', false
),
(
  'Absa Group Bursary',
  'Absa Group',
  'scholarship',
  '2025-09-30',
  'South Africa',
  'Full-time student in Commerce, IT or Engineering, financial need',
  'https://www.absa.co.za/about-absa/careers/bursaries/',
  ARRAY['Bursary','Finance','Banking','Funding'],
  'approved', false
),
(
  'Sasol Bursary Programme',
  'Sasol',
  'scholarship',
  '2025-08-31',
  'South Africa',
  'Engineering, Science or Technology student, financial need, SA citizen',
  'https://www.sasol.com/careers/bursaries',
  ARRAY['Engineering','Science','Bursary','Energy'],
  'approved', false
),
(
  'Google Generation Scholarship',
  'Google',
  'scholarship',
  '2025-10-01',
  'Sub-Saharan Africa (Online)',
  'Undergraduate or graduate CS student, demonstrated financial need',
  'https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship-emea',
  ARRAY['Google','CS','Scholarship','Tech'],
  'approved', false
),
(
  'Investec Bursary',
  'Investec',
  'scholarship',
  '2025-09-15',
  'South Africa',
  'BCom, BSc or Engineering student, strong academic record',
  'https://www.investec.com/en_za/welcome-to-investec/careers/bursaries.html',
  ARRAY['Finance','Banking','Bursary','Investment'],
  'approved', false
),
(
  'MTN Bursary Programme',
  'MTN South Africa',
  'scholarship',
  '2025-08-15',
  'South Africa',
  'Engineering, IT or Commerce student, financial need, SA citizen',
  'https://www.mtn.co.za/Pages/Careers.aspx',
  ARRAY['Telecoms','Engineering','Bursary','IT'],
  'approved', false
),
(
  'Mastercard Foundation Scholars Program',
  'Mastercard Foundation',
  'scholarship',
  '2025-10-31',
  'Various African Universities',
  'Academically talented but financially disadvantaged African students',
  'https://mastercardfdn.org/all/scholars/',
  ARRAY['Scholarship','Pan-African','Funding','Leadership'],
  'approved', false
),

-- ============================================================
-- HACKATHONS & EVENTS
-- ============================================================
(
  'Standard Bank hackathon: FinTech Edition',
  'Standard Bank',
  'event',
  '2025-09-20',
  'Johannesburg (In-person)',
  'Open to all developers, designers and entrepreneurs',
  'https://www.standardbank.co.za/southafrica/personal/about-us/newsroom',
  ARRAY['Hackathon','Fintech','Banking','Innovation'],
  'approved', false
),
(
  'Hack the Future',
  'Accenture South Africa',
  'event',
  '2025-10-10',
  'Johannesburg & Cape Town',
  'Students and young professionals in tech',
  'https://hackthefuture.co.za',
  ARRAY['Hackathon','Tech','Innovation','Accenture'],
  'approved', false
),
(
  'MTN App of the Year',
  'MTN South Africa',
  'event',
  '2025-09-30',
  'South Africa (Online submissions)',
  'Open to all South African developers',
  'https://appoftheyear.co.za',
  ARRAY['Mobile','App Development','Competition','Prize'],
  'approved', false
),
(
  'NASA Space Apps Challenge',
  'NASA / SANSA',
  'event',
  '2025-10-04',
  'Johannesburg, Cape Town & Online',
  'Open to all — developers, scientists, designers, storytellers',
  'https://www.spaceappschallenge.org',
  ARRAY['Hackathon','Space','NASA','Innovation'],
  'approved', false
),
(
  'AfricArena Summit & Pitch Competition',
  'AfricArena',
  'event',
  '2025-11-15',
  'Cape Town, Western Cape',
  'African tech startups and entrepreneurs',
  'https://africarena.com',
  ARRAY['Startup','Pitch','Funding','Pan-African'],
  'approved', false
),
(
  'Seedstars Johannesburg',
  'Seedstars',
  'event',
  '2025-10-20',
  'Johannesburg, Gauteng',
  'Early-stage startups (pre-Series A)',
  'https://www.seedstars.com/communities/johannesburg/',
  ARRAY['Startup','Pitch','Funding','Entrepreneurship'],
  'approved', false
),
(
  'Women in Tech Summit SA',
  'WomHub',
  'event',
  '2025-09-25',
  'Johannesburg (Hybrid)',
  'Women in technology and entrepreneurship',
  'https://womhub.com',
  ARRAY['Women in Tech','Networking','Summit','Diversity'],
  'approved', false
),
(
  'Google Developer Student Clubs Summit',
  'Google DSC',
  'event',
  '2025-10-05',
  'Multiple SA Universities',
  'University students interested in technology',
  'https://developers.google.com/community/gdsc',
  ARRAY['Google','Students','Tech','Community'],
  'approved', false
),
(
  'Microsoft Imagine Cup',
  'Microsoft',
  'event',
  '2026-02-28',
  'Online (Global)',
  'Student developers worldwide, team of 1–4',
  'https://imaginecup.microsoft.com',
  ARRAY['Hackathon','Microsoft','AI','Global','Prize'],
  'approved', false
),
(
  'Liquid Hack',
  'Liquid Intelligent Technologies',
  'event',
  '2025-11-01',
  'Johannesburg, Gauteng',
  'Developers, designers and innovators across Africa',
  'https://liquid.tech',
  ARRAY['Hackathon','Cloud','Networking','Innovation'],
  'approved', false
);

-- ============================================================
-- ARCHIVE PAST OPPORTUNITIES
-- ============================================================
UPDATE public.opportunities
SET is_archived = true
WHERE deadline < CURRENT_DATE
  AND is_archived = false;
