'use server'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function verifyMentor(id: string, verified: boolean) {
  await supabaseAdmin.from('mentors').update({ is_verified: verified }).eq('id', id)
  revalidatePath('/mentors')
}

export async function deleteMentor(id: string) {
  await supabaseAdmin.from('mentors').delete().eq('id', id)
  revalidatePath('/mentors')
}
