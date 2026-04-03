'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentChild, useGoodDeeds } from '@/hooks'
import { DEFAULT_CATEGORIES } from '@/constants'

export default function RecordsPage() {
  const router = useRouter()
  const { childId } = useCurrentChild()
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const { deeds, loading } = useGoodDeeds(childId, 50)

  const filtered = activeCategoryId
    ? deeds.filter(d => d.category?.name === DEFAULT_CATEGORIES.find(c => c.categoryId === activeCategoryId)?.name)
    : deeds

  return (
    <div className="records">
      <div style={{ padding: '0 20px' }}>
        <button className="back-btn" onClick={() => router.back()}>‹ もどる</button>
        <h1 className="page-title">記録一覧</h1>
        <p className="page-subtitle">これまでのよかったこと</p>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div className="filter-tabs">
          <button
            className={`filter-tab${activeCategoryId === null ? ' filter-tab--active' : ''}`}
            onClick={() => setActiveCategoryId(null)}
          >
            すべて
          </button>
          {DEFAULT_CATEGORIES.map(cat => (
            <button
              key={cat.categoryId}
              className={`filter-tab${activeCategoryId === cat.categoryId ? ' filter-tab--active' : ''}`}
              onClick={() => setActiveCategoryId(cat.categoryId === activeCategoryId ? null : cat.categoryId)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="records__list">
        {loading && <div className="loading">読み込み中...</div>}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">📖</div>
            まだ記録がありません
          </div>
        )}
        {filtered.map(deed => {
          const cat = DEFAULT_CATEGORIES.find(c => c.name === deed.category?.name)
          const date = new Date(deed.created_at)
          return (
            <div key={deed.id} className="record-item">
              <div className="record-item__stamp" style={{ background: cat?.bgColor ?? '#F3E8FF' }}>
                {cat?.icon ?? '✨'}
              </div>
              <div className="record-item__body">
                <div className="record-item__comment">{deed.comment ?? deed.category?.name}</div>
                <div className="record-item__meta">
                  {deed.category?.name} · {date.getMonth() + 1}/{date.getDate()} · {deed.recorded_by === 'parent' ? '親が登録' : '自分で登録'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
