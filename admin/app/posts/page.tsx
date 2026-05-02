import { supabaseAdmin } from '@/lib/supabase'
import { deletePost, resolveReport } from './actions'

const CAT_COLOR: Record<string, string> = {
  question: 'bg-blue-500/20 text-blue-400',
  opportunity: 'bg-indigo-500/20 text-indigo-400',
  interview: 'bg-purple-500/20 text-purple-400',
  career_win: 'bg-green-500/20 text-green-400',
  advice: 'bg-yellow-500/20 text-yellow-400',
}

export default async function PostsPage() {
  const [{ data: posts }, { data: reports }] = await Promise.all([
    supabaseAdmin
      .from('posts')
      .select('*, profiles!user_id(name)')
      .order('created_at', { ascending: false })
      .limit(100),
    supabaseAdmin
      .from('reports')
      .select('*, posts(content), profiles!reporter_id(name)')
      .eq('resolved', false)
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="flex flex-col gap-10">
      {/* Reports */}
      {!!reports?.length && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-red-400">🚩 Flagged Reports ({reports.length})</h2>
          <div className="flex flex-col gap-3">
            {reports.map((r) => (
              <div key={r.id} className="bg-red-950/30 border border-red-800/40 rounded-xl p-4 flex justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-300 mb-1">"{(r.posts as any)?.content}"</p>
                  <p className="text-xs text-gray-500">Reported by {(r.profiles as any)?.name} · {r.reason}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <form action={deletePost.bind(null, (r.posts as any)?.id)}>
                    <button className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-sm rounded-lg">Delete Post</button>
                  </form>
                  <form action={resolveReport.bind(null, r.id)}>
                    <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">Dismiss</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All posts */}
      <div>
        <h1 className="text-2xl font-bold mb-6">All Posts</h1>
        <div className="flex flex-col gap-2">
          {posts?.map((p) => (
            <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CAT_COLOR[p.category] ?? 'bg-gray-700 text-gray-400'}`}>
                    {p.category}
                  </span>
                  <span className="text-xs text-gray-500">{(p.profiles as any)?.name}</span>
                </div>
                <p className="text-sm text-gray-300 truncate">{p.content}</p>
              </div>
              <form action={deletePost.bind(null, p.id)}>
                <button className="px-3 py-1.5 bg-red-900 hover:bg-red-800 text-white text-sm rounded-lg shrink-0">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
