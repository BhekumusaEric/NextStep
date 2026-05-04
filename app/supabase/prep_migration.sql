-- Get Ready Migration — run in Supabase SQL Editor

-- Interview questions (curated + community)
CREATE TABLE IF NOT EXISTS public.interview_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  career_path text,                          -- null = applies to all paths
  question text NOT NULL,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  category text CHECK (category IN ('behavioural','technical','situational','general')),
  suggested_answer text,                     -- curated STAR-method answer
  submitted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_curated boolean DEFAULT false,          -- true = seeded by platform
  upvotes int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Community answers on questions
CREATE TABLE IF NOT EXISTS public.interview_answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id uuid REFERENCES public.interview_questions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  upvotes int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Interview tips
CREATE TABLE IF NOT EXISTS public.interview_tips (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL,
  phase text DEFAULT 'during' CHECK (phase IN ('before','during','after')),
  submitted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_curated boolean DEFAULT false,
  upvotes int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions viewable by everyone" ON public.interview_questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add questions" ON public.interview_questions FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Answers viewable by everyone" ON public.interview_answers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can answer" ON public.interview_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own answers" ON public.interview_answers FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Tips viewable by everyone" ON public.interview_tips FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add tips" ON public.interview_tips FOR INSERT WITH CHECK (auth.uid() = submitted_by);

-- ============================================================
-- SEED: Curated interview questions
-- ============================================================

-- General (all paths)
INSERT INTO public.interview_questions (career_path, question, difficulty, category, suggested_answer, is_curated) VALUES
(null, 'Tell me about yourself.', 'easy', 'general', 'Use the Present-Past-Future framework: who you are now, what led you here, and where you''re heading. Keep it under 2 minutes and tie it to the role.', true),
(null, 'Why do you want to work here?', 'easy', 'general', 'Research the company beforehand. Mention a specific project, value or product that genuinely excites you. Show you''ve done your homework.', true),
(null, 'What is your greatest weakness?', 'medium', 'behavioural', 'Pick a real weakness, show self-awareness, then explain the concrete steps you''re taking to improve it. Avoid clichés like "I work too hard".', true),
(null, 'Describe a time you worked in a team and faced conflict.', 'medium', 'behavioural', 'Use the STAR method: Situation, Task, Action, Result. Focus on how you listened, communicated and found a resolution — not on who was wrong.', true),
(null, 'Where do you see yourself in 5 years?', 'easy', 'general', 'Show ambition but keep it realistic. Align your answer with growth in the company. Mention skills you want to build and impact you want to have.', true),
(null, 'Tell me about a time you failed and what you learned.', 'medium', 'behavioural', 'Be honest. Pick a real failure, own it fully, then focus most of your answer on what you learned and how you applied that lesson.', true),
(null, 'How do you handle working under pressure or tight deadlines?', 'medium', 'situational', 'Give a specific example. Mention prioritisation, communication with your team, and how you maintained quality under pressure.', true),
(null, 'What motivates you?', 'easy', 'general', 'Be genuine. Connect your motivation to the actual work — solving problems, helping people, building things — not just salary or titles.', true),

-- Data Analyst
('data_analyst', 'What is the difference between a LEFT JOIN and an INNER JOIN?', 'easy', 'technical', 'INNER JOIN returns only rows where there is a match in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right — unmatched right rows return NULL.', true),
('data_analyst', 'How would you handle missing data in a dataset?', 'medium', 'technical', 'Options include: dropping rows (if few), imputing with mean/median/mode, using forward/backward fill for time series, or flagging missing values as a separate category. Choice depends on the data and context.', true),
('data_analyst', 'Explain the difference between supervised and unsupervised learning.', 'medium', 'technical', 'Supervised learning trains on labelled data to predict outcomes (e.g. classification, regression). Unsupervised learning finds patterns in unlabelled data (e.g. clustering, dimensionality reduction).', true),
('data_analyst', 'Walk me through how you would approach a new data analysis project.', 'medium', 'situational', 'Define the business question → understand the data → clean and explore → analyse and model → visualise and communicate findings → iterate based on feedback.', true),
('data_analyst', 'What is a p-value and how do you interpret it?', 'hard', 'technical', 'A p-value measures the probability of observing your results if the null hypothesis were true. A p-value < 0.05 typically means the result is statistically significant — but always consider effect size and context too.', true),

-- Frontend Developer
('frontend_dev', 'What is the difference between == and === in JavaScript?', 'easy', 'technical', '== checks value equality with type coercion (e.g. "5" == 5 is true). === checks both value and type without coercion (e.g. "5" === 5 is false). Always prefer === to avoid unexpected bugs.', true),
('frontend_dev', 'Explain the concept of the virtual DOM in React.', 'medium', 'technical', 'React keeps a lightweight copy of the real DOM in memory. When state changes, React diffs the virtual DOM against the previous version and only updates the parts of the real DOM that changed — making updates fast.', true),
('frontend_dev', 'What is CSS specificity and how does it work?', 'medium', 'technical', 'Specificity determines which CSS rule applies when multiple rules target the same element. Inline styles > IDs > classes/attributes > elements. Calculate as a 4-part score: (inline, IDs, classes, elements).', true),
('frontend_dev', 'What is the difference between useMemo and useCallback in React?', 'hard', 'technical', 'useMemo memoizes a computed value. useCallback memoizes a function reference. Both prevent unnecessary recalculations on re-renders — use them when the computation or function is expensive or passed as a prop.', true),
('frontend_dev', 'How does the browser render a webpage? Walk me through the process.', 'medium', 'technical', 'Parse HTML → build DOM. Parse CSS → build CSSOM. Combine into Render Tree. Layout (calculate positions). Paint (draw pixels). Composite layers. JavaScript can block or modify this pipeline.', true),

-- UI/UX Designer
('ui_ux_designer', 'Walk me through your design process from brief to final design.', 'medium', 'situational', 'Research and empathise with users → define the problem → ideate solutions → prototype → test with real users → iterate. Always tie decisions back to user needs and business goals.', true),
('ui_ux_designer', 'What is the difference between UX and UI design?', 'easy', 'general', 'UX (User Experience) is about the overall feel and flow — how easy and enjoyable a product is to use. UI (User Interface) is about the visual layer — colours, typography, components. Good products need both.', true),
('ui_ux_designer', 'How do you handle feedback that conflicts with your design decisions?', 'medium', 'behavioural', 'Separate ego from the work. Ask for the reasoning behind the feedback. If it''s backed by user data or business logic, adapt. If not, present your rationale with evidence. Design is a conversation.', true),
('ui_ux_designer', 'What accessibility considerations do you build into your designs?', 'medium', 'technical', 'Colour contrast ratios (WCAG AA minimum), touch target sizes (44x44pt minimum), screen reader labels, focus states, not relying on colour alone to convey meaning, and testing with real assistive technology.', true),

-- Product Manager
('product_manager', 'How do you prioritise features when everything feels urgent?', 'medium', 'situational', 'Use a framework like RICE (Reach, Impact, Confidence, Effort) or MoSCoW. Align with business goals and user pain points. Communicate trade-offs clearly to stakeholders and get alignment before committing.', true),
('product_manager', 'How would you define success for a new feature?', 'medium', 'technical', 'Define metrics before launch: primary metric (e.g. adoption rate), guardrail metrics (e.g. don''t hurt retention), and a timeline. Success is measurable, not just "people like it".', true),
('product_manager', 'Tell me about a product you love and what you would improve about it.', 'easy', 'general', 'Pick something you genuinely use. Praise specific design decisions, then identify a real user pain point with evidence. Propose a solution and explain the trade-offs. Shows product thinking.', true),

-- ============================================================
-- SEED: Curated interview tips
-- ============================================================
INSERT INTO public.interview_tips (title, body, phase, is_curated) VALUES
('Research the company deeply', 'Go beyond the website. Read their latest news, LinkedIn posts, Glassdoor reviews and any press coverage. Know their products, competitors and recent challenges. Interviewers notice when you''ve done your homework.', 'before', true),
('Prepare 3 strong stories using STAR', 'STAR = Situation, Task, Action, Result. Prepare 3 versatile stories from your experience that you can adapt to different questions. Practice saying them out loud — not reading them.', 'before', true),
('Test your tech 30 minutes before', 'For virtual interviews: test your camera, mic, internet and the meeting link. Have a backup plan (phone hotspot, phone call). Technical issues are avoidable stress.', 'before', true),
('Dress one level above the company culture', 'When in doubt, overdress slightly. It shows respect. You can always dress down once you''re inside — you can''t undo a first impression.', 'before', true),
('Bring printed copies of your CV', 'Even if they have it digitally, bringing 2–3 printed copies shows preparation and professionalism. It also gives you something to reference during the interview.', 'before', true),
('Listen to the full question before answering', 'Don''t rush to answer. Take 2–3 seconds to think. It''s not awkward — it shows you''re thoughtful. Interviewers prefer a considered answer over a fast, shallow one.', 'during', true),
('Ask clarifying questions', 'If a question is vague, ask for clarification. "Just to make sure I understand — are you asking about X or Y?" This shows communication skills and prevents you from answering the wrong question.', 'during', true),
('Show enthusiasm — it matters more than you think', 'Skills can be taught. Attitude is harder to change. Interviewers are also asking "do I want to work with this person?" Let your genuine interest in the role show.', 'during', true),
('Turn weaknesses into growth stories', 'When asked about weaknesses, never say "I have none" or "I work too hard." Pick something real, show self-awareness, and explain what you''re actively doing to improve it.', 'during', true),
('Have 3 questions ready to ask them', 'Always ask questions at the end. Good ones: "What does success look like in this role in the first 90 days?" or "What do you enjoy most about working here?" Avoid asking about salary first.', 'during', true),
('Send a thank-you message within 24 hours', 'A short, genuine email thanking them for their time and reiterating your interest goes a long way. Most candidates don''t do this — it makes you memorable.', 'after', true),
('Reflect and write down the questions you were asked', 'Do this immediately after. Note what went well and what you''d answer differently. This makes you sharper for the next interview.', 'after', true),
('Follow up if you haven''t heard back in a week', 'A polite follow-up email after 5–7 business days is professional, not pushy. It shows you''re still interested and organised.', 'after', true);
