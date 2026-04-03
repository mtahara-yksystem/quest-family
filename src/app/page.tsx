import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function RootPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 未ログイン → ログイン画面へ
  if (!user) redirect('/login')

  // ログイン済み → ホームへ
  redirect('/home')
}
