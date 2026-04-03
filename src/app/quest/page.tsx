'use client'

import { useRouter } from 'next/navigation'
import { useCurrentChild, useGameProgress } from '@/hooks'
import { DEFAULT_CHAPTERS } from '@/constants'

export default function QuestPage() {
  const router = useRouter()
  const { childId } = useCurrentChild()
  const { progress, loading } = useGameProgress(childId)

  const currentChapter = progress?.chapter
  const currentRecords = progress?.total_records ?? 0
  const requiredRecords = currentChapter?.required_records ?? 20
  const progressPct = Math.min((currentRecords / requiredRecords) * 100, 100)
  const remaining = requiredRecords - currentRecords

  return (
    <div className="quest">
      <button className="back-btn" onClick={() => router.back()}>‹ もどる</button>
      <h1 className="page-title">クエスト進行</h1>

      {loading && <div className="loading">読み込み中...</div>}

      {!loading && currentChapter && (
        <>
          {/* 進行カード */}
          <div className="quest-progress-card">
            <div className="quest-progress-card__chapter-no">第{currentChapter.chapter_no}章</div>
            <div className="quest-progress-card__title">「{currentChapter.title}」</div>
            <div className="quest-progress-card__desc">よかったことを積み重ねてクエストを進めよう</div>
            <div className="quest-progress-card__bar-label">進行度</div>
            <div className="quest-progress-card__bar-row">
              <div className="quest-progress-card__bar-track">
                <div className="quest-progress-card__bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="quest-progress-card__bar-count">{currentRecords}/{requiredRecords}</div>
            </div>
            <div className="quest-progress-card__remaining">
              {remaining > 0 ? `あと${remaining}ポイントでボス出現！` : '出現！やっつけろ！'}
            </div>
          </div>

          {/* ボスカード */}
          <div className="boss-card">
            <div className={`boss-card__emoji${progressPct > 70 ? ' boss-card__emoji--near' : ''}`}>
              👾
            </div>
            <div>
              <div className="boss-card__badge">ボスモンスター</div>
              <div className="boss-card__name">{currentChapter.boss_name ?? 'スライムキング'}</div>
              <div className="boss-card__status">
                {remaining > 0 ? 'まだ眠っている...' : '目覚めた！やっつけろ！'}
              </div>
            </div>
          </div>

          {/* 次の章 */}
          <div className="section-label">この先の冒険</div>
          {DEFAULT_CHAPTERS
            .filter(ch => ch.chapter_no > currentChapter.chapter_no)
            .map(ch => (
              <div key={ch.chapter_no} className="chapter-locked">
                <div className="chapter-locked__icon">🔒</div>
                <div>
                  <div className="chapter-locked__title">第{ch.chapter_no}章「{ch.title}」</div>
                  <div className="chapter-locked__hint">第{ch.chapter_no - 1}章クリアで解放</div>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  )
}
