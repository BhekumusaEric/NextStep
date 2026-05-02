'use server'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function deletePost(id: string) {
  await supabaseAdmin.from('posts').delete().eq('id', id)
  revalidatePath('/posts')
}

export async function resolveReport(id: string) {
  await supabaseAdmin.from('reports').update({ resolved: true }).eq('id', id)
  revalidatePath('/posts')
}
