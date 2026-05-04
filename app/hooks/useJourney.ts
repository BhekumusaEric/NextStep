import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { RoadmapStep, UserProgress } from '../lib/types'

export function useRoadmap(careerPathId: string | null) {
  return useQuery({
    queryKey: ['roadmap', careerPathId],
    enabled: !!careerPathId,
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roadmap_steps')
        .select('*')
        .eq('career_path_id', careerPathId!)
        .order('step_order')
      if (error) throw error
      return data as RoadmapStep[]
    },
  })
}

export function useUserProgress() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['user_progress', user?.id],
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user!.id)
      if (error) throw error
      return data as UserProgress[]
    },
  })
}

export function useToggleStep() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ stepId, completed }: { stepId: string; completed: boolean }) => {
      if (completed) {
        const { error } = await supabase.from('user_progress').delete()
          .eq('user_id', user!.id).eq('step_id', stepId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('user_progress').upsert({
          user_id: user!.id,
          step_id: stepId,
          completed: true,
          completed_at: new Date().toISOString(),
        })
        if (error) throw error
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user_progress', user?.id] }),
  })
}
