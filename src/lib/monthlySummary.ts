// ============================================================
// src/lib/monthlySummary.ts
// 月次まとめの集計ロジック
// good_deeds の実データから「その月時点の状態」を逆算する。
// child_skills / game_progress は「現在値」しか持たないため、
// 過去の任意時点のスナップショットはここで都度計算する。
// ============================================================

import { createClient } from '@/lib/supabase'
import { GAME_CONFIG } from '@/constants'
import type { Chapter, ChildSkillWithCategory, GoodDeedWithCategory } from '@/types/database'

export type MonthlySummaryHighlight = {
  id: string
  comment: string
  categoryName: string
  createdAt: string
}

export type MonthlySkillGrowth = {
  categoryId: string
  categoryName: string
  levelStart: number
  levelEnd: number
  expStart: number
  expEnd: number
}

export type MonthlySummaryData = {
  yearMonth: string
  recordCount: number
  levelUpCount: number
  bossesDefeated: number
  lastDefeatedChapter: Chapter | null
  skillGrowth: MonthlySkillGrowth[]
  highlights: MonthlySummaryHighlight[]
}

// 'YYYY-MM' → 月初・翌月初（exclusive）の Date
function getMonthRange(yearMonth: string) {
  const [y, m] = yearMonth.split('-').map(Number)
  const start = new Date(y, m - 1, 1)
  const end = new Date(y, m, 1) // 翌月1日（exclusive）
  return { start, end }
}

export function shiftYearMonth(yearMonth: string, delta: number) {
  const [y, m] = yearMonth.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function currentYearMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export async function fetchMonthlySummary(
  childId: string,
  yearMonth: string
): Promise<MonthlySummaryData> {
  const supabase = createClient()
  const { start, end } = getMonthRange(yearMonth)

  const [{ data: deedsRaw }, { data: skillsRaw }, { data: chaptersRaw }] = await Promise.all([
    supabase
      .from('good_deeds')
      .select('*, category:categories(*)')
      .eq('child_id', childId)
      .order('created_at', { ascending: true }),
    supabase
      .from('child_skills')
      .select('*, category:categories(*)')
      .eq('child_id', childId),
    supabase
      .from('chapters')
      .select('*')
      .order('chapter_no', { ascending: true }),
  ])

  const deeds = (deedsRaw ?? []) as GoodDeedWithCategory[]
  const skills = (skillsRaw ?? []) as ChildSkillWithCategory[]
  const chapters = (chaptersRaw ?? []) as Chapter[]

  const deedsBefore = deeds.filter(d => new Date(d.created_at) < start)
  const deedsInMonth = deeds.filter(d => {
    const t = new Date(d.created_at)
    return t >= start && t < end
  })
  const deedsUpToMonthEnd = deeds.filter(d => new Date(d.created_at) < end)

  // カテゴリごとの「初期EXP（オンボーディング分）」を、現在値から逆算する。
  // exp は記録のたび+1・削除で-1・カテゴリ変更で±1されるため、
  // 現在のカテゴリ別記録数を差し引けば onboarding 由来の初期値が残る。
  const baselineByCategory = new Map<string, number>()
  for (const skill of skills) {
    const allTimeCount = deeds.filter(d => d.category_id === skill.category_id).length
    baselineByCategory.set(skill.category_id, Math.max(skill.exp - allTimeCount, 0))
  }

  const { data: bossEventsRaw } = await supabase
    .from('chapter_clear_events')
    .select('*, chapter:chapters(*)')
    .eq('child_id', childId)
    .gte('cleared_at', start.toISOString())
    .lt('cleared_at', end.toISOString())
    .order('cleared_at', { ascending: true })

  const bossEvents = bossEventsRaw ?? []
  const bossesDefeated = bossEvents.length
  const lastDefeatedChapter = bossEvents.length > 0
    ? (bossEvents[bossEvents.length - 1].chapter as Chapter)
    : null

  // カテゴリ別スキル成長（月初 → 月末）
  const skillGrowth: MonthlySkillGrowth[] = skills.map(skill => {
    const baseline = baselineByCategory.get(skill.category_id) ?? 0
    const countBefore = deedsBefore.filter(d => d.category_id === skill.category_id).length
    const countUpToEnd = deedsUpToMonthEnd.filter(d => d.category_id === skill.category_id).length
    const expStart = baseline + countBefore
    const expEnd = baseline + countUpToEnd
    return {
      categoryId: skill.category_id,
      categoryName: skill.category?.name ?? '',
      expStart,
      expEnd,
      levelStart: Math.floor(expStart / GAME_CONFIG.EXP_PER_LEVEL) + 1,
      levelEnd: Math.floor(expEnd / GAME_CONFIG.EXP_PER_LEVEL) + 1,
    }
  })

  const levelUpCount = skillGrowth.reduce(
    (sum, s) => sum + Math.max(s.levelEnd - s.levelStart, 0),
    0
  )

  // ハイライト：コメントが長いものを優先し、最大3件
  const highlights: MonthlySummaryHighlight[] = deedsInMonth
    .filter(d => (d.comment ?? '').trim().length > 0)
    .sort((a, b) => (b.comment?.length ?? 0) - (a.comment?.length ?? 0))
    .slice(0, 3)
    .map(d => ({
      id: d.id,
      comment: d.comment ?? '',
      categoryName: d.category?.name ?? '',
      createdAt: d.created_at,
    }))

  // コメント付きが3件に満たない場合は最新の記録で埋める
  if (highlights.length < 3) {
    const usedIds = new Set(highlights.map(h => h.id))
    for (const d of [...deedsInMonth].reverse()) {
      if (highlights.length >= 3) break
      if (usedIds.has(d.id)) continue
      highlights.push({
        id: d.id,
        comment: d.comment ?? d.category?.name ?? 'よかったこと',
        categoryName: d.category?.name ?? '',
        createdAt: d.created_at,
      })
    }
  }

  return {
    yearMonth,
    recordCount: deedsInMonth.length,
    levelUpCount,
    bossesDefeated,
    lastDefeatedChapter,
    skillGrowth,
    highlights,
  }
}