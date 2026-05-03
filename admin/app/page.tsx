import { supabaseAdmin } from '@/lib/supabase'

export default async function DashboardPage() {
  const [r1, r2, r3, r4] = await Promise.all([
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('opportunities').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin.from('posts').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('mentors').select('*', { count: 'exact', head: true }).eq('is_verified', false),
  ])

  const stats = [
    { label: 'Total Users', value: r1.count ?? 0, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
    { label: 'Pending Opportunities', value: r2.count ?? 0, color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20' },
    { label: 'Total Posts', value: r3.count ?? 0, color: 'text-mint', bg: 'bg-mint/10', border: 'border-mint/20' },
    { label: 'Unverified Mentors', value: r4.count ?? 0, color: 'text-coral', bg: 'bg-coral/10', border: 'border-coral/20' },
  ]

  const hasError = r1.error || r2.error || r3.error || r4.error

  return (
    <div>
      <h1 className="font-sora font-bold text-2xl text-textPrimary mb-1">Dashboard</h1>
      <p className="text-textSecondary text-sm mb-8">Welcome back. Here's what's happening.</p>

      {hasError && (
        <div className="mb-6 p-4 bg-coral/10 border border-coral/30 rounded-xl text-coral text-sm">
          ⚠️ Could not load stats — check <code className="bg-coral/20 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> in <code className="bg-coral/20 px-1 rounded">.env.local</code> and restart.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-6`}>
            <p className="text-textSecondary text-xs font-inter uppercase tracking-widest mb-2">{s.label}</p>
            <p className={`text-4xl font-sora font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
