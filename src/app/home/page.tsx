'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useChildren, useChild, useChildSkills,
  useGoodDeeds, useGameProgress,
} from '@/hooks'
import { DEFAULT_CATEGORIES } from '@/constants'
import type { Child } from '@/types/database'

export default function HomePage() {
  const router = useRouter()
  const { children, loading: childrenLoading } = useChildren()
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)

  // 子ども一覧が取得できたら最初の子を選択
  useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id)
    }
  }, [children])

  const { child } = useChild(selectedChildId)
  const { skills } = useChildSkills(selectedChildId)
  const { deeds } = useGoodDeeds(selectedChildId, 3)
  const { progress } = useGameProgress(selectedChildId)

  const [charMoving, setCharMoving] = useState(false)
  const [fabPulse, setFabPulse] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('recorded') === '1') {
      setCharMoving(true)
      setFabPulse(true)
      setTimeout(() => setCharMoving(false), 1800)
      setTimeout(() => setFabPulse(false), 800)
      window.history.replaceState({}, '', '/home')
    }
  }, [])

  if (childrenLoading) {
    return <div className="loading">読み込み中...</div>
  }

  // 子どもが未登録 → オンボーディングへ
  if (children.length === 0) {
    router.push('/onboarding')
    return null
  }

  const currentRecords = progress?.total_records ?? 0
  const requiredRecords = progress?.chapter?.required_records ?? 20
  const progressPct = Math.min((currentRecords / requiredRecords) * 100, 100)
  const charLeft = `${1 + (progressPct / 100) * 79}%`
  const prevPct = Math.max(progressPct - (1 / requiredRecords) * 100, 0)
  const charFromLeft = `${1 + (prevPct / 100) * 79}%`

  // スキル表示：上位3件 + 残り数
  const topSkills = skills.slice(0, 3)
  const restCount = Math.max(skills.length - 3, 0)

  return (
    <div className="home">
      {/* ヘッダー */}
      <div className="home-header">
        {/* 子どもタブ */}
        <div className="child-tabs">
          {children.map((c: Child) => (
            <button
              key={c.id}
              className={`child-tab${selectedChildId === c.id ? ' child-tab--active' : ''}`}
              onClick={() => setSelectedChildId(c.id)}
            >
              <span className="child-tab__avatar">👦</span>
              <span className="child-tab__name">{c.name}</span>
            </button>
          ))}
          {/* 子ども追加ボタン */}
          <button
            className="child-tab-add"
            onClick={() => router.push('/onboarding?add=1')}
            title="子どもを追加"
          >
            +
          </button>
        </div>

        <div style={{ padding: '12px 20px 0' }}>
          <div className="home-header__greeting">こんにちは、パパ</div>
          <div className="home-header__name">{child?.name ?? '...'} の冒険</div>
        </div>

        {/* クエストバー */}
        <div style={{ padding: '8px 20px 20px' }}>
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
            <div
              className={`map-character${charMoving ? ' map-character--moving' : ''}`}
              style={{
                left: charLeft,
                '--char-from': charFromLeft,
                '--char-to': charLeft,
              } as React.CSSProperties}
            >
              👦
            </div>
            <div className={`map-monster${progressPct > 70 ? ' map-monster--near' : ''}`}>
              👾
            </div>
          </div>
        </div>

        {/* キャラクターカード — スキル表示：案A */}
        <div className="char-card" onClick={() => router.push('/records')}>
          <div className="char-card__avatar">👦</div>
          <div className="char-card__info">
            <div className="char-card__name">{child?.name ?? '...'}</div>
            <div className="char-card__level">⭐ 冒険者の卵</div>

            {/* ★ 案A：アイコン＋Lv＋+Nバッジ */}
            <div className="skill-icons">
              {topSkills.map(skill => {
                const cat = DEFAULT_CATEGORIES.find(c => c.name === skill.category?.name)
                return (
                  <div key={skill.id} className="skill-icon-item">
                    <div
                      className="skill-icon-item__stamp"
                      style={{ background: cat?.bgColor ?? '#F3E8FF' }}
                    >
                      {cat?.icon ?? '✨'}
                    </div>
                    <div className="skill-icon-item__lv">Lv{skill.level}</div>
                  </div>
                )
              })}
              {restCount > 0 && (
                <div className="skill-more-badge">
                  <div className="skill-more-badge__pill">+{restCount}</div>
                  <div className="skill-more-badge__sub">他</div>
                </div>
              )}
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

      {/* FAB — 選択中の子どもIDをクエリで渡す */}
      <button
        className={`fab${fabPulse ? ' fab--pulse' : ''}`}
        onClick={() => router.push(`/stamp?childId=${selectedChildId}`)}
      >
        ＋ よかったこと を記録
      </button>
    </div>
  )
}