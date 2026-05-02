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
}
