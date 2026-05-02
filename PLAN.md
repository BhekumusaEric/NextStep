# RiseHub — Build Plan

## Stack

- React Native + Expo
- Supabase (auth, database, storage, real-time)
- Zustand (state management)
- React Query (data fetching + caching)

---

## Phase 1 — Foundation (Weeks 1–2)

**Goal:** Project setup + auth working end-to-end.

- [ ] Init Expo project with TypeScript
- [ ] Set up folder structure (`app/`, `components/`, `lib/`, `hooks/`, `store/`)
- [ ] Configure Supabase project (auth, DB)
- [ ] Implement auth screens: Sign Up, Sign In, Forgot Password
- [ ] Google OAuth via Supabase
- [ ] Onboarding screen (name, university, career interests, skills)
- [ ] Persist session with Zustand
- [ ] Bottom tab navigator (Home, Community, Mentorship, Notifications, Profile)

---

## Phase 2 — Opportunities Feed (Weeks 3–4)

**Goal:** Core value prop live — users can discover opportunities.

- [ ] `opportunities` table in Supabase
- [ ] Feed screen with list of opportunities
- [ ] Opportunity card: title, org, deadline, tags, location
- [ ] Opportunity detail screen
- [ ] Filter by type (Internship, Learnership, Scholarship, Event, Bootcamp)
- [ ] Save / bookmark opportunity
- [ ] Share opportunity (deep link or native share)
- [ ] Admin can seed opportunities manually via Supabase dashboard

---

## Phase 3 — Community Forum (Weeks 5–6)

**Goal:** Engagement layer — users talk, share, ask.

- [ ] `posts` and `comments` tables in Supabase
- [ ] Forum feed screen
- [ ] Create post (text + optional tags)
- [ ] Comment on post
- [ ] Upvote post
- [ ] Report post
- [ ] Post categories: Question, Opportunity, Interview Experience, Career Win

---

## Phase 4 — Profiles (Week 7)

**Goal:** Users have identity on the platform.

- [ ] Profile screen (view own + others)
- [ ] Edit profile: bio, skills, university, social links (GitHub, LinkedIn)
- [ ] Avatar upload via Supabase Storage
- [ ] View saved opportunities from profile

---

## Phase 5 — Mentorship (Week 8)

**Goal:** Connect mentees with mentors.

- [ ] `mentors` and `mentorship_requests` tables
- [ ] Mentor discovery screen
- [ ] Mentor profile: name, industry, experience, skills, availability
- [ ] Send mentorship request
- [ ] Mentor accepts / declines request
- [ ] Basic in-app notification on request update

---

## Phase 6 — Polish + Launch Prep (Weeks 9–10)

**Goal:** Stable, shippable MVP.

- [ ] Push notifications (Expo Notifications + Supabase triggers)
- [ ] Search (opportunities + forum posts)
- [ ] Empty states, loading skeletons, error handling
- [ ] Onboarding flow polish
- [ ] TestFlight (iOS) + internal track (Android) builds
- [ ] Invite 50–100 beta users from personal network

---

## Database Tables (Supabase / PostgreSQL)

| Table | Key Fields |
|---|---|
| `users` | id, name, university, bio, skills, career_interests, avatar_url |
| `opportunities` | id, title, org, type, deadline, location, eligibility, link, tags |
| `saved_opportunities` | user_id, opportunity_id |
| `posts` | id, user_id, content, category, upvotes |
| `comments` | id, post_id, user_id, content |
| `mentors` | id, user_id, industry, experience, availability |
| `mentorship_requests` | id, mentee_id, mentor_id, status, message |

---

## Folder Structure

```
app/
  (auth)/         # login, signup, onboarding
  (tabs)/         # home, community, mentorship, notifications, profile
components/       # shared UI components
lib/              # supabase client, helpers
hooks/            # custom hooks
store/            # zustand stores
```

---

## Build Principles

- Ship working screens over perfect code
- Seed real opportunities from day one — don't launch empty
- Community trust > feature count
- Sequence: Community → Engagement → Product → Growth → Revenue → Scale
