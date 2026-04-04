'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // /auth/callback を経由してセッションを確立してからホームへ
        emailRedirectTo: `${location.origin}/auth/callback?next=/home`,
      },
    })
    if (!error) setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="login-sent">
        <span className="login-sent__icon">📧</span>
        <h1 className="login-sent__title">メールを送りました</h1>
        <p className="login-sent__body">
          {email} にログインリンクを送りました。<br />
          メールのリンクをクリックしてください。
        </p>
      </div>
    )
  }

  return (
    <div className="login">
      <div className="login__hero">
        <span className="login__logo">⚔️</span>
        <h1 className="login__app-name">QuestFamily</h1>
        <p className="login__tagline">子どもの「よかったこと」を記録して<br />一緒に冒険を進めよう</p>
      </div>
      <form className="login__form" onSubmit={handleLogin}>
        <div className="input-group">
          <label className="input-label">メールアドレス</label>
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />
        </div>
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? '送信中...' : 'ログインリンクを送る'}
        </button>
      </form>
    </div>
  )
}