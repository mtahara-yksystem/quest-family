'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useChild, useChildSkills } from '@/hooks'
import { DEFAULT_CATEGORIES, GAME_CONFIG } from '@/constants'

// レーダーチャートの6頂点座標（中心90,85 半径65）
const RADAR_CENTER = { x: 90, y: 85 }
const RADAR_RADIUS = 65

function radarPoint(index: number, total: number, ratio: number) {
  // 真上から時計回り
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  return {
    x: RADAR_CENTER.x + RADAR_RADIUS * ratio * Math.cos(angle),
    y: RADAR_CENTER.y + RADAR_RADIUS * ratio * Math.sin(angle),
  }
}

function labelPoint(index: number, total: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const r = RADAR_RADIUS + 18
  return {
    x: RADAR_CENTER.x + r * Math.cos(angle),
    y: RADAR_CENTER.y + r * Math.sin(angle),
  }
}

function gridPolygon(ratio: number, total: number) {
  return Array.from({ length: total }, (_, i) => {
    const p = radarPoint(i, total, ratio)
    return `${p.x},${p.y}`
  }).join(' ')
}

type RadarChartProps = {
  skills: { name: string; icon: string; exp: number }[]
}

function RadarChart({ skills }: RadarChartProps) {
  const total = skills.length
  const maxExp = Math.max(...skills.map(s => s.exp), 1)

  const dataPoints = skills.map((s, i) => radarPoint(i, total, s.exp / maxExp))
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  // グリッドリング（実線1本 + 破線2本）
  const gridRings = [
    { ratio: 1.0, dash: false },
    { ratio: 0.75, dash: true },
    { ratio: 0.5, dash: true },
    { ratio: 0.25, dash: true },
  ]

  // 目盛りラベルを右上軸方向（index=1）に表示
  const tickLabels = [
    { ratio: 0 },
    { ratio: 0.25 },
    { ratio: 0.5 },
    { ratio: 0.75 },
    { ratio: 1.0 },
  ]

  return (
    <svg
      viewBox="0 0 180 200"
      width="100%"
      style={{ maxWidth: 280, display: 'block', margin: '0 auto' }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="スキルレーダーチャート"
    >
      {/* グリッドリング */}
      {gridRings.map(({ ratio, dash }) => (
        <polygon
          key={ratio}
          points={gridPolygon(ratio, total)}
          fill="none"
          stroke={ratio === 1.0 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'}
          strokeWidth={ratio === 1.0 ? '1' : '0.8'}
          strokeDasharray={dash ? '3,3' : undefined}
        />
      ))}

      {/* 軸線（破線） */}
      {skills.map((_, i) => {
        const outer = radarPoint(i, total, 1)
        return (
          <line
            key={i}
            x1={RADAR_CENTER.x} y1={RADAR_CENTER.y}
            x2={outer.x} y2={outer.y}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />
        )
      })}

      {/* 中心点 */}
      <circle cx={RADAR_CENTER.x} cy={RADAR_CENTER.y} r="2" fill="rgba(0,0,0,0.2)" />

      {/* 目盛りラベル（index=1の軸に沿って） */}
      {tickLabels.map(({ ratio }) => {
        const p = radarPoint(1, total, ratio)
        return (
          <text
            key={ratio}
            x={p.x + 4}
            y={p.y + 3}
            fontSize="7"
            fill="rgba(0,0,0,0.35)"
            fontFamily="var(--font-sans)"
          >
          </text>
        )
      })}

      {/* データポリゴン */}
      <polygon
        points={dataPolygon}
        fill="rgba(107,79,187,0.15)"
        stroke="#6B4FBB"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* 頂点ドット */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#6B4FBB" />
      ))}

      {/* カテゴリラベル（絵文字のみ） */}
      {skills.map((s, i) => {
        const lp = labelPoint(i, total)
        return (
          <text
            key={i}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontFamily="var(--font-sans)"
          >
            {s.icon}
          </text>
        )
      })}
    </svg>
  )
}

function GrowthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get('childId') ?? ''

  const { child, loading: childLoading } = useChild(childId || null)
  const { skills, loading: skillsLoading } = useChildSkills(childId || null)

  const loading = childLoading || skillsLoading

  // レーダー用データ（other除く5カテゴリ）
  const radarSkills = DEFAULT_CATEGORIES
    .filter(dc => dc.categoryId !== 'other')
    .map(dc => {
      const skill = skills.find(s => s.category?.name === dc.name)
      return {
        name: dc.name,
        icon: dc.icon,
        exp: skill?.exp ?? 0,
        level: skill?.level ?? 1,
        categoryId: dc.categoryId,
        bgColor: dc.bgColor,
      }
    })

  // 全スキル（other含む、exp降順）
  const allSkills = DEFAULT_CATEGORIES.map(dc => {
    const skill = skills.find(s => s.category?.name === dc.name)
    return {
      name: dc.name,
      icon: dc.icon,
      bgColor: dc.bgColor,
      exp: skill?.exp ?? 0,
      level: skill?.level ?? 1,
    }
  }).sort((a, b) => b.exp - a.exp)

  const maxExp = Math.max(...allSkills.map(s => s.exp), 1)

  if (loading) return <div className="loading">読み込み中...</div>

  return (
    <div className="page growth">
      <button className="back-btn" onClick={() => router.back()}>‹ もどる</button>
      <h1 className="page-title">{child?.name ?? '...'}の冒険スタイル</h1>
      <p className="page-subtitle">積み重ねてきたスキルの形</p>

      {/* レーダーチャート */}
      <div className="growth-radar-card">
        <RadarChart skills={radarSkills} />
        <div className="growth-radar-legend">
          {radarSkills.map(s => (
            <div key={s.categoryId} className="growth-radar-legend__item">
              <span>{s.icon}</span>
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* スキル一覧 */}
      <div className="section-label">スキル詳細</div>
      <div className="growth-skill-list">
        {allSkills.map(skill => {
          const expInLevel = skill.exp % GAME_CONFIG.EXP_PER_LEVEL
          // ★ 現在のレベル内での進捗率（0〜EXP_PER_LEVELの中の位置）に修正
          const pct = Math.round((expInLevel / GAME_CONFIG.EXP_PER_LEVEL) * 100)
          // ★ ジャストレベルアップ直後(expInLevel=0)は「あと10」を表示する
          const remaining = expInLevel === 0 ? GAME_CONFIG.EXP_PER_LEVEL : GAME_CONFIG.EXP_PER_LEVEL - expInLevel

          return (
            <div key={skill.name} className="growth-skill-item">
              <div
                className="growth-skill-item__icon"
                style={{ background: skill.bgColor }}
              >
                {skill.icon}
              </div>
              <div className="growth-skill-item__body">
                <div className="growth-skill-item__name-row">
                  <span className="growth-skill-item__name">{skill.name}</span>
                  <span className="growth-skill-item__lv">Lv {skill.level}</span>
                </div>
                <div className="growth-skill-item__bar-wrap">
                  <div
                    className="growth-skill-item__bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="growth-skill-item__exp">
                  累計 {skill.exp} ポイント
                  {expInLevel > 0 && (
                    <span className="growth-skill-item__next">
                      　次のレベルまであと {remaining}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function GrowthPage() {
  return (
    <Suspense fallback={<div className="loading">読み込み中...</div>}>
      <GrowthContent />
    </Suspense>
  )
}
