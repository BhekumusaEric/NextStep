import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export interface Post {
  id: string
  user_id: string
  content: string
  category: string
  upvotes: number
  created_at: string
  profiles: { name: string | null; university: string | null; avatar_url: string | null }
  comment_count: number
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  profiles: { name: string | null; avatar_url: string | null }
}

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(name, university, avatar_url), comments(count)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data.map((p: any) => ({
        ...p,
        comment_count: p.comments?.[0]?.count ?? 0,
      })) as Post[]
    },
  })
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as Comment[]
    },
  })
}

export function useCreatePost() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ content, category }: { content: string; category: string }) => {
      const { error } = await supabase.from('posts').insert({ user_id: user!.id, content, category })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export function useCreateComment() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const { error } = await supabase.from('comments').insert({ post_id: postId, user_id: user!.id, content })
      if (error) throw error
    },
    onSuccess: (_d, vars) => queryClient.invalidateQueries({ queryKey: ['comments', vars.postId] }),
  })
}

export function useUpvote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.rpc('increment_upvotes', { post_id: postId })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })
}
