import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export interface Message {
  id: string
  request_id: string
  sender_id: string
  content: string
  created_at: string
}

export function useMessages(requestId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${requestId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `request_id=eq.${requestId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['messages', requestId] })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [requestId])

  return useQuery({
    queryKey: ['messages', requestId],
    enabled: !!requestId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as Message[]
    },
  })
}

export function useSendMessage() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ requestId, content }: { requestId: string; content: string }) => {
      const { error } = await supabase.from('messages').insert({
        request_id: requestId,
        sender_id: user!.id,
        content,
      })
      if (error) throw error
    },
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', requestId] })
    },
  })
}
