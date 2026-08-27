'use client'

// ============================================================
// src/components/features/game/Effects.tsx
// エフェクトコンポーネント群
// ============================================================

import { useEffect, useState, useCallback } from 'react'
import { BossIcon } from '@/components/ui/BossIcons'

// ---- コンフェッティ生成ユーティリティ ----
const CONFETTI_COLORS = [
  '#F5A623', '#6B4FBB', '#4CAF7D',
  '#FF6B6B', '#4A90D9', '#FFB347', '#E91E8C',
]

function Confetti({ count = 40 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.random() * 100}%`,
    fallDuration: `${2 + Math.random() * 1.5}s`,
    fallDelay: `${Math.random() * 0.5}s`,
    swayDuration: `${0.8 + Math.random() * 0.8}s`,
    shape: Math.random() > 0.7 ? 'circle' : Math.random() > 0.5 ? 'strip' : '',
    size: `${8 + Math.random() * 6}px`,
  }))

  return (
    <div className="effect-confetti">
      {pieces.map(p => (
        <div
          key={p.id}
          className={`effect-confetti__piece${p.shape ? ` effect-confetti__piece--${p.shape}` : ''}`}
          style={{
            left: p.left,
            background: p.color,
            width: p.shape === 'strip' ? '4px' : p.size,
            height: p.shape === 'strip' ? '14px' : p.size,
            '--fall-duration': p.fallDuration,
            '--fall-delay': p.fallDelay,
            '--sway-duration': p.swayDuration,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

// ---- スパークル ----
function Sparkles() {
  const stars = ['⭐', '✨', '💫', '⚡', '🌟']
  const items = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    star: stars[i % stars.length],
    top: `${20 + Math.random() * 60}%`,
    left: `${10 + Math.random() * 80}%`,
    delay: `${i * 0.1}s`,
  }))
  return (
    <div className="effect-sparkle">
      {items.map(s => (
        <div
          key={s.id}
          className="effect-sparkle__star"
          style={{ top: s.top, left: s.left, '--sparkle-delay': s.delay } as React.CSSProperties}
        >
          {s.star}
        </div>
      ))}
    </div>
  )
}

// ============================================================
// 1. 記録完了エフェクト
// ============================================================
type RecordEffectProps = {
  stamp: string         // 絵文字
  categoryName: string
  comment: string | null
  questTitle: string
  currentRecords: number
  requiredRecords: number
  onClose: () => void
}

export function RecordEffect({
  stamp, categoryName, comment, questTitle,
  currentRecords, requiredRecords, onClose,
}: RecordEffectProps) {
  const [hiding, setHiding] = useState(false)

  const handleClose = useCallback(() => {
    setHiding(true)
    setTimeout(onClose, 300)
  }, [onClose])

  // 3秒後に自動クローズ
  useEffect(() => {
    const t = setTimeout(handleClose, 3000)
    return () => clearTimeout(t)
  }, [handleClose])

  const pct = Math.min((currentRecords / requiredRecords) * 100, 100)
  const prevPct = Math.max(pct - (1 / requiredRecords) * 100, 0)

  return (
    <div
      className={`effect-record-overlay${hiding ? ' is-hiding' : ''}`}
      onClick={handleClose}
    >
      <Confetti count={50} />
      <Sparkles />

      <div className="effect-record-stamp">{stamp}</div>
      <div className="effect-record-title">よかった！</div>
      {comment && (
        <div className="effect-record-comment">{comment}</div>
      )}
      <div className="effect-record-quest">
        <div className="effect-record-quest__label">クエスト進行中</div>
        <div className="effect-record-quest__title">「{questTitle}」</div>
        <div className="effect-record-quest__bar-track">
          <div
            className="effect-record-quest__bar-fill"
            style={{
              '--from-width': `${prevPct}%`,
              '--to-width': `${pct}%`,
            } as React.CSSProperties}
          />
        </div>
        <div className="effect-record-quest__count">
          {currentRecords} / {requiredRecords} ポイント
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 2. レベルアップエフェクト
// ============================================================
type LevelUpEffectProps = {
  newLevel: number
  categoryName: string
  categoryIcon: string
  skillExp: number
  onClose: () => void
}

export function LevelUpEffect({
  newLevel, categoryName, categoryIcon, skillExp, onClose,
}: LevelUpEffectProps) {
  const [hiding, setHiding] = useState(false)

  const handleClose = useCallback(() => {
    setHiding(true)
    setTimeout(onClose, 300)
  }, [onClose])

  useEffect(() => {
    const t = setTimeout(handleClose, 4000)
    return () => clearTimeout(t)
  }, [handleClose])

  const pct = Math.min((skillExp % 10) * 10, 100)

  return (
    <div
      className={`effect-levelup-overlay${hiding ? ' is-hiding' : ''}`}
      onClick={handleClose}
    >
      <Confetti count={60} />
      <div className="effect-levelup-label">Level Up!</div>
      <div className="effect-levelup-char">{categoryIcon}</div>
      <div className="effect-levelup-text">
        Lv.<span>{newLevel}</span>
      </div>
      <div className="effect-levelup-skills">
        <div className="effect-levelup-skill__row">
          <div className="effect-levelup-skill__label">{categoryName}</div>
          <div className="effect-levelup-skill__track">
            <div
              className="effect-levelup-skill__fill"
              style={{
                '--from-width': '0%',
                '--to-width': `${pct}%`,
                '--skill-delay': '0.9s',
              } as React.CSSProperties}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 2b. 総合(キャラクター)レベルアップエフェクト
// カテゴリ別スキルとは別に、全記録の合計で上がる「キャラ全体」のレベル
// ============================================================
type CharLevelUpEffectProps = {
  newLevel: number
  title: string   // getCharTitle() の結果
  totalExp: number
  onClose: () => void
}

export function CharLevelUpEffect({
  newLevel, title, totalExp, onClose,
}: CharLevelUpEffectProps) {
  const [hiding, setHiding] = useState(false)

  const handleClose = useCallback(() => {
    setHiding(true)
    setTimeout(onClose, 300)
  }, [onClose])

  useEffect(() => {
    const t = setTimeout(handleClose, 4000)
    return () => clearTimeout(t)
  }, [handleClose])

  return (
    <div
      className={`effect-levelup-overlay${hiding ? ' is-hiding' : ''}`}
      onClick={handleClose}
    >
      <Confetti count={60} />
      <div className="effect-levelup-label">Level Up!</div>
      <div className="effect-levelup-char">👑</div>
      <div className="effect-levelup-text">
        Lv.<span>{newLevel}</span>
      </div>
      <div className="effect-levelup-title">{title}</div>
      <div className="effect-levelup-sub">これまでの記録：{totalExp}回</div>
    </div>
  )
}

// ============================================================
// 3. ボス討伐エフェクト（章クリア）
// ============================================================
type BossDefeatedEffectProps = {
  bossName: string
  bossImageUrl: string  // ← bossEmoji: string から変更
  chapterNo: number
  chapterTitle: string
  nextChapterTitle?: string
  onClose: () => void
}

export function BossDefeatedEffect({
  bossName, bossImageUrl, chapterNo, chapterTitle, nextChapterTitle, onClose,
}: BossDefeatedEffectProps) {
  const [phase, setPhase] = useState<'shaking' | 'defeated' | 'banner'>('shaking')
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    // 0.6s: 画面揺れ → 1.2s: ボス消える → 2s: バナー → 5s: 閉じる
    const t1 = setTimeout(() => setPhase('defeated'), 600)
    const t2 = setTimeout(() => setPhase('banner'), 1200)
    const t3 = setTimeout(() => { setHiding(true); setTimeout(onClose, 600) }, 5000)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [onClose])

  // 爆発パーティクル
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 360
    const dist = 80 + Math.random() * 60
    return {
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      tx: `${Math.cos((angle * Math.PI) / 180) * dist}px`,
      ty: `${Math.sin((angle * Math.PI) / 180) * dist}px`,
      delay: `${Math.random() * 0.2}s`,
    }
  })

  return (
    <div className={`effect-boss-overlay${phase === 'shaking' ? ' is-shaking' : ''}${hiding ? ' is-hiding' : ''}`}>
      {phase === 'banner' && <Confetti count={70} />}

      {/* 爆発パーティクル */}
      {phase === 'defeated' && (
        <div className="effect-boss-particles">
          {particles.map(p => (
            <div
              key={p.id}
              className="effect-boss-particles__piece"
              style={{
                background: p.color,
                top: '50%', left: '50%',
                '--tx': p.tx, '--ty': p.ty,
                '--explode-delay': p.delay,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* ★ 絵文字 → BossIcon SVG に変更 */}
      <div className={`effect-boss-monster${phase !== 'shaking' ? ' is-defeated' : ''}`}>
        <BossIcon bossImageUrl={bossImageUrl} width={350} height={220} />
      </div>

      {phase === 'banner' && (
        <>
          <div className="effect-boss-banner">
            <div className="effect-boss-banner__title">
              第{chapterNo}章クリア！
            </div>
            <div className="effect-boss-banner__chapter">
              「{chapterTitle}」制覇！
            </div>
          </div>
          {nextChapterTitle && (
            <div className="effect-boss-next">
              次の冒険：「{nextChapterTitle}」へ
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ============================================================
// 4. ラスボス討伐 / 周回突入エフェクト
// ============================================================
type LoopEffectProps = {
  loopCount: number
  onClose: () => void
}

export function LoopEffect({ loopCount, onClose }: LoopEffectProps) {
  const [hiding, setHiding] = useState(false)

  const handleClose = useCallback(() => {
    setHiding(true)
    setTimeout(onClose, 600)
  }, [onClose])

  useEffect(() => {
    const t = setTimeout(handleClose, 6000)
    return () => clearTimeout(t)
  }, [handleClose])

  return (
    <div
      className={`effect-loop-overlay${hiding ? ' is-hiding' : ''}`}
      onClick={handleClose}
    >
      <Confetti count={80} />
      <div className="effect-loop-crown">👑</div>
      <div className="effect-loop-title">
        全章クリア！<br />新たな冒険へ！
      </div>
      <div className="effect-loop-sub">
        これまでの冒険がさらに輝く<br />強くてニューゲーム開始！
      </div>
      <div className="effect-loop-badge">
        <span>🔄 {loopCount}周目の冒険者</span>
      </div>
    </div>
  )
}