import { supabaseAdmin } from '@/lib/supabase'

export default async function DashboardPage() {
  const [
    { count: totalUsers },
    { count: pendingOpps },
    { count: totalPosts },
    { count: pendingMentors },
  ] = await Promise.all([
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('opportunities').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin.from('posts').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('mentors').select('*', { count: 'exact', head: true }).eq('is_verified', false),
  ])

  const stats = [
    { label: 'Total Users', value: totalUsers ?? 0, color: 'text-indigo-400' },
    { label: 'Pending Opportunities', value: pendingOpps ?? 0, color: 'text-yellow-400' },
    { label: 'Total Posts', value: totalPosts ?? 0, color: 'text-green-400' },
    { label: 'Unverified Mentors', value: pendingMentors ?? 0, color: 'text-orange-400' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">{s.label}</p>
            <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
