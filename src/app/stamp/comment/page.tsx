'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRecordGoodDeed, useGameProgress } from '@/hooks'
import { DEFAULT_CATEGORIES } from '@/constants'
import { createClient } from '@/lib/supabase'
import type { Category } from '@/types/database'
import { RecordEffect, LevelUpEffect, BossDefeatedEffect, LoopEffect } from '@/components/features/game/Effects'

type EffectState =
  | { type: 'none' }
  | { type: 'record'; stamp: string; categoryName: string; comment: string | null; questTitle: string; currentRecords: number; requiredRecords: number }
  | { type: 'levelup'; newLevel: number; categoryName: string; categoryIcon: string; skillExp: number }
  | { type: 'boss'; bossName: string; bossImageUrl: string; chapterNo: number; chapterTitle: string; nextChapterTitle?: string }  // ← bossEmoji → bossImageUrl
  | { type: 'loop'; loopCount: number }

function CommentForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId') ?? ''
  const childId = searchParams.get('childId') ?? ''
  const [comment, setComment] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [effect, setEffect] = useState<EffectState>({ type: 'none' })
  const { record, loading } = useRecordGoodDeed()
  const { progress } = useGameProgress(childId || null)
  const supabase = createClient()

  useEffect(() => {
    if (!categoryId) return
    supabase.from('categories').select('*').eq('id', categoryId).single()
      .then(({ data }) => { if (data) setCategory(data) })
  }, [categoryId])

  const defaultCat = DEFAULT_CATEGORIES.find(dc => dc.name === category?.name)

  const handleSubmit = async (skipComment = false) => {
    if (!childId || !categoryId || !progress) return
    const result = await record({
      childId,
      categoryId,
      comment: skipComment ? null : comment.trim() || null,
      recordedBy: 'parent',
    })
    if (result.error) return

    const currentChapter = progress.chapter
    const newRecords = (progress.total_records ?? 0) + 1

    if (result.looped) {
      setEffect({ type: 'loop', loopCount: result.newLoopCount ?? 2 })
    } else if (result.bossDefeated) {
      setEffect({
        type: 'boss',
        bossName: currentChapter?.boss_name ?? 'ボス',
        bossImageUrl: currentChapter?.boss_image_url ?? '/images/bosses/slime_king.svg',  // ← bossEmoji: '👾' から変更
        chapterNo: currentChapter?.chapter_no ?? 1,
        chapterTitle: currentChapter?.title ?? '',
        nextChapterTitle: result.nextChapter?.title,
      })
    } else if (result.leveledUp) {
      setEffect({ type: 'levelup', newLevel: result.newLevel ?? 2, categoryName: category?.name ?? '', categoryIcon: defaultCat?.icon ?? '✨', skillExp: result.skillExp ?? 0 })
    } else {
      setEffect({ type: 'record', stamp: defaultCat?.icon ?? '✨', categoryName: category?.name ?? '', comment: skipComment ? null : comment.trim() || null, questTitle: currentChapter?.title ?? '', currentRecords: newRecords, requiredRecords: currentChapter?.required_records ?? 20 })
    }
  }

  const handleEffectClose = () => {
    setEffect({ type: 'none' })
    router.push('/home?recorded=1')
  }

  return (
    <>
      {effect.type === 'record'  && <RecordEffect {...effect} onClose={handleEffectClose} />}
      {effect.type === 'levelup' && <LevelUpEffect {...effect} onClose={handleEffectClose} />}
      {effect.type === 'boss'    && <BossDefeatedEffect {...effect} onClose={handleEffectClose} />}
      {effect.type === 'loop'    && <LoopEffect {...effect} onClose={handleEffectClose} />}

      <div className="page">
        <button className="back-btn" onClick={() => router.back()}>‹ もどる</button>
        <h1 className="page-title">コメント（任意）</h1>
        <p className="page-subtitle">どんなよかったことだった？</p>

        {category && (
          <div className="stamp-preview">
            <div className="stamp-preview__icon" style={{ background: defaultCat?.bgColor ?? '#F3E8FF' }}>
              {defaultCat?.icon ?? '✨'}
            </div>
            <div>
              <div className="stamp-preview__name">{category.name}</div>
              <div className="stamp-preview__sub">スタンプが選ばれました</div>
            </div>
          </div>
        )}

        <textarea
          className="comment-textarea"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="例：食器を洗ってくれた、弟に優しくしてくれた…"
        />
        <button className="btn btn--primary" onClick={() => handleSubmit(false)} disabled={loading || !childId}>
          {loading ? '記録中...' : '記録する ✓'}
        </button>
        <button className="btn btn--ghost" onClick={() => handleSubmit(true)} disabled={loading || !childId}>
          コメントなしで記録
        </button>
      </div>
    </>
  )
}

export default function CommentPage() {
  return (
    <Suspense fallback={<div className="loading">読み込み中...</div>}>
      <CommentForm />
    </Suspense>
  )
}