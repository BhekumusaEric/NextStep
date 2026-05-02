'use server'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function setUserRole(id: string, role: 'user' | 'admin') {
  await supabaseAdmin.from('profiles').update({ role }).eq('id', id)
  revalidatePath('/users')
}

export async function deleteUser(id: string) {
  await supabaseAdmin.auth.admin.deleteUser(id)
  revalidatePath('/users')
}
