import { supabaseAdmin } from '@/lib/supabase'
import { deletePost, resolveReport } from './actions'

const CAT: Record<string, string> = {
  question: 'bg-primary/15 text-primary border-primary/30',
  opportunity: 'bg-mint/15 text-mint border-mint/30',
  interview: 'bg-gold/15 text-gold border-gold/30',
  career_win: 'bg-mint/15 text-mint border-mint/30',
  advice: 'bg-gold/15 text-gold border-gold/30',
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
      .select('*, posts(id, content), profiles!reporter_id(name)')
      .eq('resolved', false)
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="flex flex-col gap-10">
      {!!reports?.length && (
        <div>
          <h2 className="font-sora font-bold text-lg text-coral mb-4">Flagged Reports ({reports.length})</h2>
          <div className="flex flex-col">
            {reports.map((r) => (
              <div key={r.id} className="border-b border-coral/20 py-4 flex justify-between gap-4 hover:bg-coral/5 px-2 -mx-2 transition-colors">
                <div>
                  <p className="text-sm text-textPrimary mb-1">"{(r.posts as any)?.content}"</p>
                  <p className="text-xs text-textMuted">Reported by {(r.profiles as any)?.name} · {r.reason}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <form action={deletePost.bind(null, (r.posts as any)?.id)}>
                    <button className="px-3 py-1.5 bg-coral/15 hover:bg-coral/25 text-coral border border-coral/30 text-sm rounded-xl font-inter font-semibold transition-colors">Delete Post</button>
                  </form>
                  <form action={resolveReport.bind(null, r.id)}>
                    <button className="px-3 py-1.5 bg-card hover:bg-cardAlt text-textSecondary border border-border text-sm rounded-xl font-inter transition-colors">Dismiss</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h1 className="font-sora font-bold text-2xl text-textPrimary mb-1">All Posts</h1>
        <p className="text-textSecondary text-sm mb-8">{posts?.length ?? 0} posts</p>
        <div className="flex flex-col">
          {posts?.map((p) => (
            <div key={p.id} className="border-b border-border py-4 flex justify-between gap-4 hover:bg-cardAlt px-2 -mx-2 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-inter font-semibold ${CAT[p.category] ?? 'bg-card text-textSecondary border-border'}`}>
                    {p.category}
                  </span>
                  <span className="text-xs text-textMuted">{(p.profiles as any)?.name}</span>
                </div>
                <p className="text-sm text-textSecondary truncate">{p.content}</p>
              </div>
              <form action={deletePost.bind(null, p.id)}>
                <button className="px-3 py-1.5 bg-coral/15 hover:bg-coral/25 text-coral border border-coral/30 text-sm rounded-xl font-inter font-semibold shrink-0 transition-colors">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
