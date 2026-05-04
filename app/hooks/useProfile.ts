import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { Profile } from '../lib/types'

export function useProfile(userId?: string) {
  const currentUser = useAuthStore((s) => s.user)
  const id = userId ?? currentUser?.id
  return useQuery({
    queryKey: ['profile', id],
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
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
    onSuccess: (_data, updates) => {
      queryClient.setQueryData(['profile', user?.id], (old: any) =>
        old ? { ...old, ...updates } : old
      )
    },
  })
}

export function useUploadAvatar() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (uri: string) => {
      // Standard RN + Supabase pattern: read as base64 → decode to ArrayBuffer → upload
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      })
      const arrayBuffer = decode(base64)
      const ext = uri.split('.').pop()?.toLowerCase() ?? 'jpg'
      const mime = ext === 'png' ? 'image/png' : 'image/jpeg'
      const path = `${user!.id}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arrayBuffer, { contentType: mime, upsert: true })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      // Use stable URL without timestamp — expo-image caches by URL
      // Only add cache buster when the file actually changes (upsert guarantees new content)
      const publicUrl = `${data.publicUrl}?v=${Date.now()}`

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user!.id)
      if (updateError) throw updateError

      return publicUrl
    },
    onSuccess: (publicUrl) => {
      queryClient.setQueryData(['profile', user?.id], (old: any) =>
        old ? { ...old, avatar_url: publicUrl } : old
      )
    },
  })
}
