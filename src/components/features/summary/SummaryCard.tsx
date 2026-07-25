'use client'

import { forwardRef } from 'react'
import { DEFAULT_CATEGORIES } from '@/constants'
import { BossIcon } from '@/components/ui/BossIcons'
import type { MonthlySummaryData } from '@/lib/monthlySummary'
import type { Child } from '@/types/database'

type Props = {
  child: Child
  data: MonthlySummaryData
  comment: string
}

export const SummaryCard = forwardRef<HTMLDivElement, Props>(function SummaryCard(
  { child, data, comment },
  ref
) {
  const [year, month] = data.yearMonth.split('-')
  const grownSkills = data.skillGrowth
    .filter(s => s.expEnd > s.expStart)
    .sort((a, b) => (b.expEnd - b.expStart) - (a.expEnd - a.expStart))

  return (
    <div ref={ref} className="summary-card">
      <div className="summary-card__header">
        <div className="summary-card__period">{year}年{Number(month)}月・MONTHLY REPORT</div>
        <div className="summary-card__title">{child.name}の冒険レポート</div>
      </div>

      {data.lastDefeatedChapter ? (
        <div className="summary-card__boss-banner">
          <div className="summary-card__boss-icon">
            <BossIcon bossImageUrl={data.lastDefeatedChapter.boss_image_url ?? '/images/bosses/slime_king.svg'} />
          </div>
          <div>
            <div className="summary-card__boss-label">第{data.lastDefeatedChapter.chapter_no}章クリア</div>
            <div className="summary-card__boss-title">「{data.lastDefeatedChapter.title}」制覇</div>
            {data.lastDefeatedChapter.boss_name && (
              <div className="summary-card__boss-sub">{data.lastDefeatedChapter.boss_name}をやっつけた</div>
            )}
          </div>
        </div>
      ) : (
        <div className="summary-card__boss-banner summary-card__boss-banner--pending">
          <div className="summary-card__boss-icon summary-card__boss-icon--emoji">⚔️</div>
          <div>
            <div className="summary-card__boss-label">まだ冒険の途中</div>
            <div className="summary-card__boss-title">次のボスに向けて前進中！</div>
          </div>
        </div>
      )}

      <div className="summary-card__stats">
        <div className="summary-card__stat">
          <div className="summary-card__stat-num">{data.recordCount}</div>
          <div className="summary-card__stat-label">記録</div>
        </div>
        <div className="summary-card__stat">
          <div className="summary-card__stat-num">{data.bossesDefeated}</div>
          <div className="summary-card__stat-label">ボス討伐</div>
        </div>
        <div className="summary-card__stat">
          <div className="summary-card__stat-num">{data.levelUpCount}</div>
          <div className="summary-card__stat-label">レベルアップ</div>
        </div>
      </div>

      {data.highlights.length > 0 && (
        <div className="summary-card__section">
          <div className="summary-card__section-label">今月のハイライト</div>
          {data.highlights.map(h => {
            const cat = DEFAULT_CATEGORIES.find(c => c.name === h.categoryName)
            return (
              <div key={h.id} className="summary-card__highlight">
                <div className="summary-card__highlight-icon" style={{ background: cat?.bgColor ?? '#F3E8FF' }}>
                  {cat?.icon ?? '✨'}
                </div>
                <div className="summary-card__highlight-text">{h.comment}</div>
              </div>
            )
          })}
        </div>
      )}

      {grownSkills.length > 0 && (
        <div className="summary-card__growth-summary">
          📈 {grownSkills.slice(0, 2).map(s => s.categoryName).join('・')}のスキルが成長！
        </div>
      )}

      {comment.trim() && (
        <div className="summary-card__comment">
          <div className="summary-card__comment-label">パパ・ママから{child.name}へ</div>
          <div className="summary-card__comment-body">{comment}</div>
        </div>
      )}

      <div className="summary-card__badge">今月の称号：がんばり屋さん</div>
    </div>
  )
})