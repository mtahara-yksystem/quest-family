'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentChild, useChild, useChildSkills, useGoodDeeds, useGameProgress } from '@/hooks'
import { DEFAULT_CATEGORIES } from '@/constants'

export default function HomePage() {
  const router = useRouter()

  // 1. 各種データの取得
  const { childId, loading: childIdLoading } = useCurrentChild()
  const { child, loading: childLoading } = useChild(childId)
  const { skills } = useChildSkills(childId)
  const { deeds } = useGoodDeeds(childId, 3)
  const { progress } = useGameProgress(childId)

  // 2. 状態管理
  const [charMoving, setCharMoving] = useState(false)
  const [fabPulse, setFabPulse] = useState(false)

  // 3. リダイレクト処理 (副作用として実行)
  useEffect(() => {
    // 読み込みが終わり、かつ childId が存在しない場合はオンボーディングへ
    if (!childIdLoading && !childId) {
      router.push('/onboarding')
    }
  }, [childId, childIdLoading, router])

  // 4. アニメーション発火 (?recorded=1 の判定)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)

    if (params.get('recorded') === '1') {
      setCharMoving(true)
      setFabPulse(true)

      const moveTimer = setTimeout(() => setCharMoving(false), 1800)
      const pulseTimer = setTimeout(() => setFabPulse(false), 800)

      // URLからパラメータを消去（リロード対策）
      window.history.replaceState({}, '', '/home')

      return () => {
        clearTimeout(moveTimer)
        clearTimeout(pulseTimer)
      }
    }
  }, [])

  // 5. ローディング・ガード（リダイレクト中も含む）
  if (childIdLoading || childLoading || !childId) {
    return (
      <div style={{
        padding: '100px 40px',
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        読み込み中...
      </div>
    )
  }

  // --- これ以降は childId が確実に存在する場合のみ実行される ---

  const currentRecords = progress?.total_records ?? 0
  const requiredRecords = progress?.chapter?.required_records ?? 20
  const progressPct = Math.min((currentRecords / requiredRecords) * 100, 100)

  // キャラの位置をクエスト進行度に連動（8%〜42%の範囲）
  const charLeft = `${8 + (progressPct / 100) * 34}%`
  const prevPct = Math.max(progressPct - (1 / requiredRecords) * 100, 0)
  const charFromLeft = `${8 + (prevPct / 100) * 34}%`

  return (
    <div className="home">
      {/* ヘッダー */}
      <div className="home-header">
        <div className="home-header__greeting">こんにちは、パパ</div>
        <div className="home-header__name">{child?.name ?? '...'} の冒険</div>

        <div className="quest-bar" onClick={() => router.push('/quest')}>
          <div style={{ flex: 1 }}>
            <div className="quest-bar__label">現在のクエスト</div>
            <div className="quest-bar__title">
              第{progress?.chapter?.chapter_no ?? 1}章「{progress?.chapter?.title ?? '読み込み中'}」
            </div>
            <div className="quest-bar__progress">
              <div className="quest-bar__bar-track">
                <div className="quest-bar__bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="quest-bar__count">{currentRecords} / {requiredRecords}</div>
            </div>
          </div>
          <div className="quest-bar__arrow">›</div>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="home__content">

        {/* マップカード */}
        <div className="map-card" onClick={() => router.push('/quest')}>
          <div className="map-card__label">マップ</div>
          <div className="map-card__scene">
            <div className="map-card__trees-left">🌲🌲</div>
            <div className="map-card__trees-right">🌲🌲</div>
            <div className="map-card__path" />

            {/* キャラクター */}
            <div
              className={`map-character${charMoving ? ' map-character--moving' : ''}`}
              style={{
                left: charLeft,
                '--char-from': charFromLeft,
                '--char-to': charLeft,
              } as React.CSSProperties}
            >
              🧑‍🦱
            </div>

            {/* モンスター */}
            <div className={`map-monster${progressPct > 70 ? ' map-monster--near' : ''}`}>
              👾
            </div>
          </div>
        </div>

        {/* キャラクターカード */}
        <div className="char-card" onClick={() => router.push('/records')}>
          <div className="char-card__avatar">🧑‍🦱</div>
          <div className="char-card__info">
            <div className="char-card__name">{child?.name ?? '...'}</div>
            <div className="char-card__level">⭐ 冒険者の卵</div>
            <div className="skill-bars">
              {skills.slice(0, 3).map(skill => {
                const cat = DEFAULT_CATEGORIES.find(c => c.name === skill.category?.name)
                const pct = Math.min((skill.exp % 10) * 10, 100)
                return (
                  <div key={skill.id} className="skill-bar">
                    <div className="skill-bar__label">
                      {cat?.icon} {skill.category?.name.slice(0, 3)}
                    </div>
                    <div className="skill-bar__track">
                      <div className="skill-bar__fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="char-card__arrow">›</div>
        </div>

        {/* 最近の記録 */}
        <div className="section-label">最近のよかったこと</div>

        {deeds.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📖</div>
            まだ記録がありません。<br />よかったことを記録してみよう！
          </div>
        ) : (
          deeds.map(deed => {
            const cat = DEFAULT_CATEGORIES.find(c => c.name === deed.category?.name)
            return (
              <div key={deed.id} className="record-item">
                <div className="record-item__stamp" style={{ background: cat?.bgColor ?? '#F3E8FF' }}>
                  {cat?.icon ?? '✨'}
                </div>
                <div className="record-item__body">
                  <div className="record-item__comment">{deed.comment ?? deed.category?.name}</div>
                  <div className="record-item__meta">
                    {deed.category?.name} · {deed.recorded_by === 'parent' ? '親が登録' : '自分で登録'}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* FAB */}
      <button
        className={`fab${fabPulse ? ' fab--pulse' : ''}`}
        onClick={() => router.push('/stamp')}
      >
        ＋ よかったこと を記録
      </button>
    </div>
  )
}