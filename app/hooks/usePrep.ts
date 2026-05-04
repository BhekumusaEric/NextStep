import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useInterviewQuestions(careerPath: string | null, category?: string) {
  return useQuery({
    queryKey: ['interview_questions', careerPath, category],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      let query = supabase
        .from('interview_questions')
        .select('*, submitted_by_profile:profiles(name)')
        .order('is_curated', { ascending: false })
        .order('upvotes', { ascending: false })

      if (careerPath) {
        query = query.or(`career_path.eq.${careerPath},career_path.is.null`)
      }
      if (category) query = query.eq('category', category)

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export function useInterviewAnswers(questionId: string) {
  return useQuery({
    queryKey: ['interview_answers', questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interview_answers')
        .select('*, profiles(name, avatar_url)')
        .eq('question_id', questionId)
        .order('upvotes', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useAddAnswer() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ questionId, content }: { questionId: string; content: string }) => {
      const { error } = await supabase.from('interview_answers').insert({
        question_id: questionId,
        user_id: user!.id,
        content,
      })
      if (error) throw error
    },
    onSuccess: (_d, { questionId }) =>
      queryClient.invalidateQueries({ queryKey: ['interview_answers', questionId] }),
  })
}

export function useAddQuestion() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      question: string
      career_path: string | null
      difficulty: string
      category: string
    }) => {
      const { error } = await supabase.from('interview_questions').insert({
        ...payload,
        submitted_by: user!.id,
        is_curated: false,
      })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interview_questions'] }),
  })
}

export function useInterviewTips(phase?: string) {
  return useQuery({
    queryKey: ['interview_tips', phase],
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      let query = supabase
        .from('interview_tips')
        .select('*')
        .order('is_curated', { ascending: false })
        .order('upvotes', { ascending: false })
      if (phase) query = query.eq('phase', phase)
      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}
