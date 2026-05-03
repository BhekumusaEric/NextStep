import { supabaseAdmin } from '@/lib/supabase'
import { verifyMentor, deleteMentor } from './actions'

export default async function MentorsPage() {
  const { data: mentors } = await supabaseAdmin
    .from('mentors')
    .select('*, profiles!user_id(name, university)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-sora font-bold text-2xl text-textPrimary mb-1">Mentors</h1>
      <p className="text-textSecondary text-sm mb-8">Verify mentors before they appear to users.</p>

      <div className="flex flex-col">
        {mentors?.map((m) => {
          const profile = m.profiles as any
          return (
            <div key={m.id} className="border-b border-border py-5 flex items-center justify-between gap-4 hover:bg-cardAlt px-2 -mx-2 transition-colors">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-sora font-bold text-primary text-sm shrink-0">
                  {profile?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-sora font-semibold text-textPrimary">{profile?.name ?? 'Unknown'}</p>
                    {m.is_verified && (
                      <span className="text-xs bg-mint/15 text-mint border border-mint/30 px-2 py-0.5 rounded-full font-inter font-semibold">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-sm text-textSecondary">{profile?.university} · {m.industry}</p>
                  <p className="text-xs text-textMuted">{m.experience_years} yrs experience</p>
                </div>
              </div>
              <div className="flex gap-2">
                <form action={verifyMentor.bind(null, m.id, !m.is_verified)}>
                  <button className={`px-3 py-1.5 text-sm rounded-xl border font-inter font-semibold transition-colors ${
                    m.is_verified
                      ? 'bg-card text-textSecondary border-border hover:bg-cardAlt'
                      : 'bg-mint/15 text-mint border-mint/30 hover:bg-mint/25'
                  }`}>
                    {m.is_verified ? 'Unverify' : 'Verify'}
                  </button>
                </form>
                <form action={deleteMentor.bind(null, m.id)}>
                  <button className="px-3 py-1.5 bg-coral/15 hover:bg-coral/25 text-coral border border-coral/30 text-sm rounded-xl font-inter font-semibold transition-colors">Remove</button>
                </form>
              </div>
            </div>
          )
        })}
        {!mentors?.length && <p className="text-textMuted mt-8">No mentors found.</p>}
      </div>
    </div>
  )
}
