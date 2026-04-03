// ============================================================
// Supabase クライアント
// ブラウザ用とサーバー用を分けて管理
// ============================================================

import { createBrowserClient } from '@supabase/ssr'

// ブラウザ（クライアントコンポーネント）用
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
