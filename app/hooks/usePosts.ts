import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
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
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('posts_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

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
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (postId: string) => {
      // Check if already upvoted
      const { data: existing } = await supabase
        .from('post_upvotes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user!.id)
        .single()
      if (existing) return // already upvoted, do nothing
      await supabase.from('post_upvotes').insert({ post_id: postId, user_id: user!.id })
      await supabase.rpc('increment_upvotes', { post_id: postId })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export function useUpvotedPosts() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['upvoted_posts', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from('post_upvotes').select('post_id').eq('user_id', user!.id)
      return (data ?? []).map((r) => r.post_id) as string[]
    },
  })
}
