import { supabaseAdmin } from '@/lib/supabase'
import { setUserRole, deleteUser } from './actions'

export default async function UsersPage() {
  const { data: users } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">University</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50">
                <td className="px-4 py-3 text-white">{u.name ?? <span className="text-gray-500">—</span>}</td>
                <td className="px-4 py-3 text-gray-400">{u.university ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-700 text-gray-400'}`}>
                    {u.role ?? 'user'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <form action={setUserRole.bind(null, u.id, u.role === 'admin' ? 'user' : 'admin')}>
                    <button className="text-xs px-2 py-1 bg-indigo-700 hover:bg-indigo-600 rounded text-white">
                      {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                    </button>
                  </form>
                  <form action={deleteUser.bind(null, u.id)}>
                    <button className="text-xs px-2 py-1 bg-red-800 hover:bg-red-700 rounded text-white">Ban</button>
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
