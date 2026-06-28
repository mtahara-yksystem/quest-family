'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGoodDeeds } from '@/hooks'
import { DEFAULT_CATEGORIES } from '@/constants'
import { createClient } from '@/lib/supabase'

// ============================================================
// 週間ヒートマップ
// ============================================================

type DayStat = {
  date: Date
  count: number
  isToday: boolean
}

function WeekHeatmap({ childId }: { childId: string }) {
  const [days, setDays] = useState<DayStat[]>([])

  useEffect(() => {
    if (!childId) return
    const supabase = createClient()

    // 今週の月曜〜日曜を算出
    const today = new Date()
    const dow = today.getDay() // 0=日,1=月,...
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((dow + 6) % 7))
    monday.setHours(0, 0, 0, 0)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    supabase
      .from('good_deeds')
      .select('created_at')
      .eq('child_id', childId)
      .gte('created_at', monday.toISOString())
      .lte('created_at', sunday.toISOString())
      .then(({ data }) => {
        // 日付ごとにカウント
        const countMap: Record<string, number> = {}
        ;(data ?? []).forEach(d => {
          const key = d.created_at.slice(0, 10)
          countMap[key] = (countMap[key] ?? 0) + 1
        })

        const todayStr = today.toISOString().slice(0, 10)
        const result: DayStat[] = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(monday)
          d.setDate(monday.getDate() + i)
          const key = d.toISOString().slice(0, 10)
          return {
            date: d,
            count: countMap[key] ?? 0,
            isToday: key === todayStr,
          }
        })
        setDays(result)
      })
  }, [childId])

  const DAY_LABELS = ['月', '火', '水', '木', '金', '土', '日']

  function cellClass(count: number) {
    if (count === 0) return 'heatmap-cell'
    if (count === 1) return 'heatmap-cell heatmap-cell--1'
    if (count === 2) return 'heatmap-cell heatmap-cell--2'
    return 'heatmap-cell heatmap-cell--3'
  }

  return (
    <div className="week-heatmap">
      <div className="week-heatmap__label">今週の記録</div>
      <div className="week-heatmap__grid">
        {DAY_LABELS.map((label, i) => (
          <div key={label} className="week-heatmap__col">
            <div className="week-heatmap__day-label">{label}</div>
            <div
              className={`${cellClass(days[i]?.count ?? 0)}${days[i]?.isToday ? ' heatmap-cell--today' : ''}`}
            >
              {days[i]?.count > 0 ? days[i].count : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// 記録一覧本体
// ============================================================

function RecordsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get('childId') ?? ''
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const { deeds, loading } = useGoodDeeds(childId || null, 50)

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

      {/* ヒートマップ */}
      {childId && (
        <div style={{ padding: '0 20px 4px' }}>
          <WeekHeatmap childId={childId} />
        </div>
      )}

      {/* フィルタータブ */}
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

      {/* 記録リスト */}
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
            <div
              key={deed.id}
              className="record-item record-item--clickable"
              onClick={() => router.push(`/records/${deed.id}?childId=${childId}`)}
            >
              <div className="record-item__stamp" style={{ background: cat?.bgColor ?? '#F3E8FF' }}>
                {cat?.icon ?? '✨'}
              </div>
              <div className="record-item__body">
                <div className="record-item__comment">{deed.comment ?? deed.category?.name}</div>
                <div className="record-item__meta">
                  {deed.category?.name} · {date.getMonth() + 1}/{date.getDate()}
                </div>
              </div>
              <div className="record-item__arrow">›</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function RecordsPage() {
  return (
    <Suspense fallback={<div className="loading">読み込み中...</div>}>
      <RecordsContent />
    </Suspense>
  )
}
