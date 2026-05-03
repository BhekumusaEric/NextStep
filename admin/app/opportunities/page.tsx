import { supabaseAdmin } from '@/lib/supabase'
import { updateOpportunityStatus, deleteOpportunity } from './actions'

const STATUS: Record<string, string> = {
  pending: 'bg-gold/15 text-gold border-gold/30',
  approved: 'bg-mint/15 text-mint border-mint/30',
  rejected: 'bg-coral/15 text-coral border-coral/30',
}

export default async function OpportunitiesPage() {
  const { data: opps } = await supabaseAdmin
    .from('opportunities')
    .select('*, profiles!submitted_by(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-sora font-bold text-2xl text-textPrimary mb-1">Opportunities</h1>
      <p className="text-textSecondary text-sm mb-8">Review and approve user-submitted opportunities.</p>

      <div className="flex flex-col">
        {opps?.map((o) => (
          <div key={o.id} className="border-b border-border py-5 flex items-start justify-between gap-4 hover:bg-cardAlt px-2 -mx-2 transition-colors">
            <div className="flex gap-4 flex-1 min-w-0">
              <div className="w-1 rounded-full bg-primary shrink-0 self-stretch" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-inter font-semibold ${STATUS[o.status]}`}>
                    {o.status}
                  </span>
                  <span className="text-xs text-textMuted uppercase tracking-wider">{o.type}</span>
                </div>
                <p className="font-sora font-semibold text-textPrimary truncate">{o.title}</p>
                <p className="text-sm text-textSecondary">{o.organization}{o.location ? ` · ${o.location}` : ''}</p>
                <div className="flex gap-3 mt-1">
                  {o.deadline && <p className="text-xs text-textMuted">📅 {o.deadline}</p>}
                  {(o.profiles as any)?.name && <p className="text-xs text-textMuted">by {(o.profiles as any).name}</p>}
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {o.status === 'pending' && (
                <>
                  <form action={updateOpportunityStatus.bind(null, o.id, 'approved')}>
                    <button className="px-3 py-1.5 bg-mint/15 hover:bg-mint/25 text-mint border border-mint/30 text-sm rounded-xl font-inter font-semibold transition-colors">Approve</button>
                  </form>
                  <form action={updateOpportunityStatus.bind(null, o.id, 'rejected')}>
                    <button className="px-3 py-1.5 bg-coral/15 hover:bg-coral/25 text-coral border border-coral/30 text-sm rounded-xl font-inter font-semibold transition-colors">Reject</button>
                  </form>
                </>
              )}
              <form action={deleteOpportunity.bind(null, o.id)}>
                <button className="px-3 py-1.5 bg-card hover:bg-cardAlt text-textSecondary border border-border text-sm rounded-xl font-inter transition-colors">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {!opps?.length && <p className="text-textMuted mt-8">No opportunities found.</p>}
      </div>
    </div>
  )
}
