import { supabaseAdmin } from '@/lib/supabase'
import { setUserRole, deleteUser } from './actions'

export default async function UsersPage() {
  const { data: users } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-sora font-bold text-2xl text-textPrimary mb-1">Users</h1>
      <p className="text-textSecondary text-sm mb-8">{users?.length ?? 0} registered users</p>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="px-4 py-3 text-left text-xs font-inter font-bold text-textMuted uppercase tracking-widest">Name</th>
              <th className="px-4 py-3 text-left text-xs font-inter font-bold text-textMuted uppercase tracking-widest">University</th>
              <th className="px-4 py-3 text-left text-xs font-inter font-bold text-textMuted uppercase tracking-widest">Role</th>
              <th className="px-4 py-3 text-left text-xs font-inter font-bold text-textMuted uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-cardAlt transition-colors">
                <td className="px-4 py-3 font-inter text-textPrimary">{u.name ?? <span className="text-textMuted">—</span>}</td>
                <td className="px-4 py-3 font-inter text-textSecondary">{u.university ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-inter font-semibold ${
                    u.role === 'admin'
                      ? 'bg-primary/15 text-primary border-primary/30'
                      : 'bg-card text-textSecondary border-border'
                  }`}>
                    {u.role ?? 'user'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <form action={setUserRole.bind(null, u.id, u.role === 'admin' ? 'user' : 'admin')}>
                    <button className="text-xs px-2.5 py-1 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 rounded-lg font-inter font-semibold transition-colors">
                      {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                    </button>
                  </form>
                  <form action={deleteUser.bind(null, u.id)}>
                    <button className="text-xs px-2.5 py-1 bg-coral/15 hover:bg-coral/25 text-coral border border-coral/30 rounded-lg font-inter font-semibold transition-colors">Ban</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
