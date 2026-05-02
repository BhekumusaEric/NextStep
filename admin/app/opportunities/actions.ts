'use server'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function updateOpportunityStatus(id: string, status: 'approved' | 'rejected') {
  await supabaseAdmin.from('opportunities').update({ status }).eq('id', id)
  revalidatePath('/opportunities')
}

export async function deleteOpportunity(id: string) {
  await supabaseAdmin.from('opportunities').delete().eq('id', id)
  revalidatePath('/opportunities')
}
