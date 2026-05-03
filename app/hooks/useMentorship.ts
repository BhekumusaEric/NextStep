import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export interface Mentor {
  id: string
  user_id: string
  industry: string | null
  experience_years: number | null
  skills: string[]
  availability: string | null
  profiles: { name: string | null; university: string | null; avatar_url: string | null; bio: string | null }
}

export interface MentorshipRequest {
  id: string
  mentee_id: string
  mentor_id: string
  message: string | null
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
  mentors: { profiles: { name: string | null } }
  profiles: { name: string | null }
}

export function useMentors() {
  return useQuery({
    queryKey: ['mentors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentors')
        .select('*, profiles(name, university, avatar_url, bio)')
      if (error) throw error
      return data as Mentor[]
    },
  })
}

export function useMyRequests() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['my_requests', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentorship_requests')
        .select('*, mentors(profiles(name)), profiles(name)')
        .eq('mentee_id', user!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as MentorshipRequest[]
    },
  })
}

export function useIncomingRequests(mentorId?: string) {
  return useQuery({
    queryKey: ['incoming_requests', mentorId],
    enabled: !!mentorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentorship_requests')
        .select('*, profiles(name)')
        .eq('mentor_id', mentorId!)
        .neq('status', 'declined')          // show pending + accepted
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as MentorshipRequest[]
    },
  })
}

export function useSendRequest() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ mentorId, message }: { mentorId: string; message: string }) => {
      const { error } = await supabase.from('mentorship_requests').insert({
        mentee_id: user!.id,
        mentor_id: mentorId,
        message,
      })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my_requests'] }),
  })
}

export function useRespondRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: 'accepted' | 'declined' }) => {
      const { error } = await supabase.from('mentorship_requests').update({ status }).eq('id', requestId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incoming_requests'] })
      queryClient.invalidateQueries({ queryKey: ['my_requests'] })
    },
  })
}

export function useMyMentorProfile() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['my_mentor', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from('mentors').select('*').eq('user_id', user!.id).single()
      return data as Mentor | null
    },
  })
}

export function useBecomeMentor() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { industry: string; experience_years: number; skills: string[]; availability: string }) => {
      const { error } = await supabase.from('mentors').insert({ user_id: user!.id, ...payload })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] })
      queryClient.invalidateQueries({ queryKey: ['my_mentor'] })
    },
  })
}
