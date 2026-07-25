'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useChild, useMonthlySummary, useMonthlyComment } from '@/hooks'
import { SummaryCard } from '@/components/features/summary/SummaryCard'
import { currentYearMonth, shiftYearMonth } from '@/lib/monthlySummary'

function SummaryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get('childId') ?? ''

  const [yearMonth, setYearMonth] = useState(searchParams.get('month') ?? currentYearMonth())
  const { child } = useChild(childId || null)
  const { data, loading } = useMonthlySummary(childId || null, yearMonth)
  const { comment, loading: commentLoading, saving, save } = useMonthlyComment(childId || null, yearMonth)

  const [draftComment, setDraftComment] = useState('')
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setDraftComment(comment) }, [comment])

  const isCurrentMonth = yearMonth === currentYearMonth()
  const [y, m] = yearMonth.split('-')

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#FAFAF8', scale: 2 })
      const link = document.createElement('a')
      link.download = `questfamily_${yearMonth}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={() => router.back()}>‹ もどる</button>

      <div className="summary-month-nav">
        <button className="summary-month-nav__arrow" onClick={() => setYearMonth(shiftYearMonth(yearMonth, -1))}>
          ‹ 前月
        </button>
        <div className="summary-month-nav__label">{y}年{Number(m)}月</div>
        <button
          className="summary-month-nav__arrow"
          onClick={() => setYearMonth(shiftYearMonth(yearMonth, 1))}
          disabled={isCurrentMonth}
        >
          翌月 ›
        </button>
      </div>

      {(loading || !child || !data) ? (
        <div className="loading">読み込み中...</div>
      ) : (
        <>
          <SummaryCard ref={cardRef} child={child} data={data} comment={draftComment} />

          <div className="summary-comment-editor">
            <label className="input-label">{child.name}へ一言（任意）</label>
            <textarea
              className="input-field input-field--textarea"
              value={draftComment}
              onChange={e => setDraftComment(e.target.value)}
              maxLength={40}
              placeholder="今月もよくがんばったね！"
            />
            <div className="summary-comment-editor__count">{draftComment.length}/40</div>
            <button className="btn btn--ghost" onClick={() => save(draftComment)} disabled={saving || commentLoading}>
              {saving ? '保存中...' : '一言を保存'}
            </button>
          </div>

          <button className="btn btn--primary" onClick={handleDownload} disabled={downloading}>
            {downloading ? '作成中...' : '📥 画像として保存'}
          </button>
        </>
      )}
    </div>
  )
}

export default function SummaryPage() {
  return (
    <Suspense fallback={<div className="loading">読み込み中...</div>}>
      <SummaryContent />
    </Suspense>
  )
}