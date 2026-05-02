import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { Profile } from '../lib/types'

export function useProfile(userId?: string) {
  const currentUser = useAuthStore((s) => s.user)
  const id = userId ?? currentUser?.id
  return useQuery({
    queryKey: ['profile', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
      if (error) throw error
      return data as Profile
    },
  })
}

export function useUpdateProfile() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user!.id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', user?.id] }),
  })
}

export function useUploadAvatar() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uri: string) => {
      const ext = uri.split('.').pop() ?? 'jpg'
      const path = `${user!.id}/avatar.${ext}`
      const response = await fetch(uri)
      const blob = await response.blob()
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, blob, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user!.id)
      if (updateError) throw updateError
      return publicUrl
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', user?.id] }),
  })
}
