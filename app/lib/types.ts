export type OpportunityType = 'internship' | 'learnership' | 'graduate' | 'scholarship' | 'event' | 'bootcamp'

export interface Opportunity {
  id: string
  title: string
  organization: string
  type: OpportunityType
  deadline: string | null
  location: string | null
  eligibility: string | null
  link: string | null
  tags: string[]
  status: 'pending' | 'approved' | 'rejected'
  submitted_by: string | null
  created_at: string
}

export interface Profile {
  id: string
  name: string | null
  university: string | null
  bio: string | null
  skills: string[]
  career_interests: string[]
  avatar_url: string | null
  github_url: string | null
  linkedin_url: string | null
  background: 'student' | 'graduate' | 'switcher' | 'beginner' | null
  career_path: string | null
  journey_stage: number | null
  goal: 'internship' | 'fulltime' | 'freelance' | 'learning' | null
}

export interface CareerPath {
  id: string
  title: string
  description: string
  icon: string
}

export interface RoadmapStep {
  id: string
  career_path_id: string
  title: string
  resource_url: string | null
  step_order: number
  estimated_days: number
}

export interface UserProgress {
  id: string
  user_id: string
  step_id: string
  completed: boolean
  completed_at: string | null
}
