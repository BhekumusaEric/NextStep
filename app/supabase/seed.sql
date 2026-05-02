-- Seed opportunities — Run in Supabase Dashboard → SQL Editor

insert into public.opportunities (title, organization, type, deadline, location, eligibility, link, tags) values
('Software Engineering Intern', 'Vodacom', 'internship', '2025-08-31', 'Johannesburg, SA', 'Currently enrolled in a CS or Engineering degree', 'https://vodacom.co.za/careers', array['Tech', 'Software', 'Mobile']),
('Data Science Learnership', 'Standard Bank', 'learnership', '2025-07-15', 'Cape Town, SA', 'Matric + any tertiary qualification', 'https://standardbank.co.za/careers', array['Data', 'Finance', 'Analytics']),
('Graduate Programme 2026', 'Deloitte', 'graduate', '2025-09-30', 'Johannesburg, SA', 'Final year or recent graduate', 'https://deloitte.com/za/careers', array['Consulting', 'Finance', 'Strategy']),
('NSFAS Bursary 2026', 'NSFAS', 'scholarship', '2025-10-31', 'South Africa', 'South African citizen, household income below R350k', 'https://nsfas.org.za', array['Funding', 'Education', 'Bursary']),
('AWS Cloud Bootcamp', 'Amazon Web Services', 'bootcamp', '2025-07-01', 'Online', 'Open to all', 'https://aws.amazon.com/training', array['Cloud', 'Tech', 'AWS']),
('AfricArena Tech Summit', 'AfricArena', 'event', '2025-08-10', 'Cape Town, SA', 'Open to all', 'https://africarena.com', array['Networking', 'Startups', 'Tech']),
('IT Graduate Trainee', 'Nedbank', 'graduate', '2025-08-01', 'Johannesburg, SA', 'BSc Computer Science or IT degree', 'https://nedbank.co.za/careers', array['Tech', 'Banking', 'IT']),
('UX Design Internship', 'Takealot', 'internship', '2025-07-20', 'Cape Town, SA', '3rd year Design or HCI student', 'https://takealot.com/careers', array['Design', 'UX', 'Product']),
('Sasol Engineering Bursary', 'Sasol', 'scholarship', '2025-08-15', 'South Africa', 'Grade 12 with Maths and Science, or 1st year Engineering', 'https://sasol.com/careers', array['Engineering', 'Energy', 'Bursary']),
('Business Analyst Learnership', 'Discovery', 'learnership', '2025-07-31', 'Johannesburg, SA', 'Diploma or degree in Business or IT', 'https://discovery.co.za/careers', array['Business', 'Analytics', 'Insurance']);
