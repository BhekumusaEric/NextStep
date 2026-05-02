import { supabaseAdmin } from '@/lib/supabase'
import { updateOpportunityStatus, deleteOpportunity } from './actions'

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
}

export default async function OpportunitiesPage() {
  const { data: opps } = await supabaseAdmin
    .from('opportunities')
    .select('*, profiles!submitted_by(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Opportunities</h1>
      <div className="flex flex-col gap-3">
        {opps?.map((o) => (
          <div key={o.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[o.status]}`}>
                  {o.status}
                </span>
                <span className="text-xs text-gray-500 uppercase">{o.type}</span>
              </div>
              <p className="font-semibold text-white truncate">{o.title}</p>
              <p className="text-sm text-gray-400">{o.organization} · {o.location}</p>
              {o.deadline && <p className="text-xs text-gray-500 mt-1">Deadline: {o.deadline}</p>}
              {o.profiles && <p className="text-xs text-gray-500">Submitted by: {(o.profiles as any).name ?? 'Unknown'}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              {o.status === 'pending' && (
                <>
                  <form action={updateOpportunityStatus.bind(null, o.id, 'approved')}>
                    <button className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg">Approve</button>
                  </form>
                  <form action={updateOpportunityStatus.bind(null, o.id, 'rejected')}>
                    <button className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-sm rounded-lg">Reject</button>
                  </form>
                </>
              )}
              <form action={deleteOpportunity.bind(null, o.id)}>
                <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {!opps?.length && <p className="text-gray-500">No opportunities found.</p>}
      </div>
    </div>
  )
}
