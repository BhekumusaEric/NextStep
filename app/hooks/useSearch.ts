import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Opportunity } from '../lib/types'
import { Post } from './usePosts'

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    enabled: query.trim().length > 1,
    queryFn: async () => {
      const [opps, posts] = await Promise.all([
        supabase
          .from('opportunities')
          .select('*')
          .or(`title.ilike.%${query}%,organization.ilike.%${query}%`)
          .limit(10),
        supabase
          .from('posts')
          .select('*, profiles(name, university, avatar_url), comments(count)')
          .ilike('content', `%${query}%`)
          .limit(10),
      ])
      return {
        opportunities: (opps.data ?? []) as Opportunity[],
        posts: (posts.data ?? []).map((p: any) => ({ ...p, comment_count: p.comments?.[0]?.count ?? 0 })) as Post[],
      }
    },
  })
}
