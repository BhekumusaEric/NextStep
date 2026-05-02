import { supabaseAdmin } from '@/lib/supabase'
import { verifyMentor, deleteMentor } from './actions'

export default async function MentorsPage() {
  const { data: mentors } = await supabaseAdmin
    .from('mentors')
    .select('*, profiles!user_id(name, university, avatar_url)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mentors</h1>
      <div className="flex flex-col gap-3">
        {mentors?.map((m) => {
          const profile = m.profiles as any
          return (
            <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-white">{profile?.name ?? 'Unknown'}</p>
                  {m.is_verified && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Verified</span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{profile?.university} · {m.industry}</p>
                <p className="text-xs text-gray-500">{m.experience_years} years experience</p>
              </div>
              <div className="flex gap-2">
                <form action={verifyMentor.bind(null, m.id, !m.is_verified)}>
                  <button className={`px-3 py-1.5 text-sm rounded-lg text-white ${m.is_verified ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-500'}`}>
                    {m.is_verified ? 'Unverify' : 'Verify'}
                  </button>
                </form>
                <form action={deleteMentor.bind(null, m.id)}>
                  <button className="px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white text-sm rounded-lg">Remove</button>
                </form>
              </div>
            </div>
          )
        })}
        {!mentors?.length && <p className="text-gray-500">No mentors found.</p>}
      </div>
    </div>
  )
}
