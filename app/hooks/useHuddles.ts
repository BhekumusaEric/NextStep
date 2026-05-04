import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

// ── Huddles ───────────────────────────────────────────────────

export interface Huddle {
  id: string
  host_id: string
  title: string
  description: string | null
  scheduled_at: string
  capacity: number
  status: 'upcoming' | 'live' | 'ended'
  created_at: string
  profiles: { name: string | null; avatar_url: string | null }
  huddle_rsvps: { user_id: string }[]
}

export function useHuddles() {
  return useQuery({
    queryKey: ['huddles'],
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('huddles')
        .select('*, profiles(name, avatar_url), huddle_rsvps(user_id)')
        .neq('status', 'ended')
        .order('scheduled_at', { ascending: true })
      if (error) throw error
      return data as Huddle[]
    },
  })
}

export function useCreateHuddle() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { title: string; description: string; scheduled_at: string; capacity: number; status?: string }) => {
      const { data, error } = await supabase
        .from('huddles')
        .insert({ ...payload, host_id: user!.id })
        .select('id')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['huddles'] }),
  })
}

export function useGoLive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (huddleId: string) => {
      const { error } = await supabase
        .from('huddles')
        .update({ status: 'live' })
        .eq('id', huddleId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['huddles'] }),
  })
}

export function useEndHuddle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (huddleId: string) => {
      const { error } = await supabase
        .from('huddles')
        .update({ status: 'ended' })
        .eq('id', huddleId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['huddles'] }),
  })
}

export function useDeleteHuddle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (huddleId: string) => {
      const { error } = await supabase.from('huddles').delete().eq('id', huddleId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['huddles'] }),
  })
}

export function useToggleRSVP() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ huddleId, rsvpd }: { huddleId: string; rsvpd: boolean }) => {
      if (rsvpd) {
        await supabase.from('huddle_rsvps').delete().eq('huddle_id', huddleId).eq('user_id', user!.id)
      } else {
        await supabase.from('huddle_rsvps').insert({ huddle_id: huddleId, user_id: user!.id })
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['huddles'] }),
  })
}

// ── Huddle messages ───────────────────────────────────────────

export interface HuddleMessage {
  id: string
  huddle_id: string
  user_id: string
  content: string
  is_pinned: boolean
  created_at: string
  profiles: { name: string | null; avatar_url: string | null }
}

export function useHuddleMessages(huddleId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel(`huddle_messages_${huddleId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'huddle_messages', filter: `huddle_id=eq.${huddleId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['huddle_messages', huddleId] })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [huddleId])

  return useQuery({
    queryKey: ['huddle_messages', huddleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('huddle_messages')
        .select('*, profiles(name, avatar_url)')
        .eq('huddle_id', huddleId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as HuddleMessage[]
    },
  })
}

export function useSendHuddleMessage() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ huddleId, content }: { huddleId: string; content: string }) => {
      const { error } = await supabase.from('huddle_messages').insert({
        huddle_id: huddleId, user_id: user!.id, content,
      })
      if (error) throw error
    },
    onSuccess: (_d, { huddleId }) =>
      queryClient.invalidateQueries({ queryKey: ['huddle_messages', huddleId] }),
  })
}

export function useDeleteHuddleMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ messageId, huddleId }: { messageId: string; huddleId: string }) => {
      const { error } = await supabase.from('huddle_messages').delete().eq('id', messageId)
      if (error) throw error
    },
    onSuccess: (_d, { huddleId }) =>
      queryClient.invalidateQueries({ queryKey: ['huddle_messages', huddleId] }),
  })
}

// ── Notifications ─────────────────────────────────────────────

export interface AppNotification {
  id: string
  user_id: string
  type: string
  title: string
  body: string | null
  read: boolean
  reference_id: string | null
  created_at: string
}

export function useNotifications() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user?.id) return
    const channel = supabase
      .channel('notifications_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user?.id])

  return useQuery({
    queryKey: ['notifications', user?.id],
    enabled: !!user,
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as AppNotification[]
    },
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  return useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('notifications').update({ read: true }).eq('id', id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] }),
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  return useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('notifications').delete().eq('id', id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] }),
  })
}

export function useClearAllNotifications() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  return useMutation({
    mutationFn: async () => {
      await supabase.from('notifications').delete().eq('user_id', user!.id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] }),
  })
}
