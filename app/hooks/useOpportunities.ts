import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Opportunity, OpportunityType } from '../lib/types'
import { useAuthStore } from '../store/authStore'

export function useOpportunities(filter?: OpportunityType) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('opportunities_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' }, () => {
        queryClient.invalidateQueries({ queryKey: ['opportunities'] })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  return useQuery({
    queryKey: ['opportunities', filter],
    queryFn: async () => {
      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('status', 'approved')          // only approved show in feed
        .order('deadline', { ascending: true })
      if (filter) query = query.eq('type', filter)
      const { data, error } = await query
      if (error) throw error
      return data as Opportunity[]
    },
  })
}

export function useSavedOpportunities() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['saved_opportunities', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_opportunities')
        .select('opportunity_id')
        .eq('user_id', user!.id)
      if (error) throw error
      return data.map((r) => r.opportunity_id) as string[]
    },
  })
}

export function useToggleSave() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ opportunityId, saved }: { opportunityId: string; saved: boolean }) => {
      if (saved) {
        await supabase.from('saved_opportunities').delete()
          .eq('user_id', user!.id).eq('opportunity_id', opportunityId)
      } else {
        await supabase.from('saved_opportunities').insert({ user_id: user!.id, opportunity_id: opportunityId })
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved_opportunities'] }),
  })
}

export function useSubmitOpportunity() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      title: string
      organization: string
      type: OpportunityType
      deadline: string | null
      location: string
      eligibility: string
      link: string
      tags: string[]
    }) => {
      const { error } = await supabase.from('opportunities').insert({
        ...payload,
        status: 'pending',
        submitted_by: user?.id ?? null,
      })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my_submissions'] }),
  })
}

export function useMySubmissions() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['my_submissions', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('submitted_by', user!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as (Opportunity & { status: string })[]
    },
  })
}
