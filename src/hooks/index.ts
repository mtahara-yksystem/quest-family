// ============================================================
// カスタムフック
// ============================================================

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type {
  Child,
  GoodDeedWithCategory,
  GameProgressWithChapter,
  ChildSkillWithCategory,
} from '@/types/database'

// ---- ログイン中の親に紐づく子どものID ----
export function useCurrentChild() {
  const [childId, setChildId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      supabase
        .from('children')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setChildId(data.id)
          setLoading(false)
        })
    })
  }, [])

  return { childId, loading }
}

// ---- 子ども情報 ----
export function useChild(childId: string | null) {
  const [child, setChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!childId) { setLoading(false); return }
    supabase
      .from('children')
      .select('*')
      .eq('id', childId)
      .maybeSingle()
      .then(({ data }) => {
        setChild(data)
        setLoading(false)
      })
  }, [childId])

  return { child, loading }
}

// ---- よかったこと一覧（カテゴリ情報をJOIN）----
export function useGoodDeeds(childId: string | null, limit = 10) {
  const [deeds, setDeeds] = useState<GoodDeedWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!childId) { setLoading(false); return }
    supabase
      .from('good_deeds')
      .select('*, category:categories(*)')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })
      .limit(limit)
      .then(({ data }) => {
        setDeeds((data as GoodDeedWithCategory[]) ?? [])
        setLoading(false)
      })
  }, [childId, limit])

  return { deeds, loading }
}

// ---- スキル一覧（カテゴリ情報をJOIN）----
export function useChildSkills(childId: string | null) {
  const [skills, setSkills] = useState<ChildSkillWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!childId) { setLoading(false); return }
    supabase
      .from('child_skills')
      .select('*, category:categories(*)')
      .eq('child_id', childId)
      .then(({ data }) => {
        setSkills((data as ChildSkillWithCategory[]) ?? [])
        setLoading(false)
      })
  }, [childId])

  return { skills, loading }
}

// ---- ゲーム進行状況（章情報をJOIN）----
export function useGameProgress(childId: string | null) {
  const [progress, setProgress] = useState<GameProgressWithChapter | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!childId) { setLoading(false); return }
    supabase
      .from('game_progress')
      .select('*, chapter:chapters(*)')
      .eq('child_id', childId)
      .maybeSingle()
      .then(({ data }) => {
        setProgress(data as GameProgressWithChapter)
        setLoading(false)
      })
  }, [childId])

  return { progress, loading }
}

// ---- よかったこと登録 ----
export function useRecordGoodDeed() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const record = async (params: {
    childId: string
    categoryId: string
    comment: string | null
    recordedBy: 'parent' | 'child'
  }) => {
    setLoading(true)

    // 1. good_deeds に登録
    const { error } = await supabase.from('good_deeds').insert({
      child_id: params.childId,
      category_id: params.categoryId,
      comment: params.comment,
      recorded_by: params.recordedBy,
    })

    if (error) {
      setLoading(false)
      return { error }
    }

    // 2. スキルEXP +1 → レベルアップ判定
    const { data: skillBefore } = await supabase
      .from('child_skills')
      .select('level, exp')
      .eq('child_id', params.childId)
      .eq('category_id', params.categoryId)
      .single()

    await supabase.rpc('increment_skill_exp', {
      p_child_id: params.childId,
      p_category_id: params.categoryId,
    })

    const { data: skillAfter } = await supabase
      .from('child_skills')
      .select('level, exp')
      .eq('child_id', params.childId)
      .eq('category_id', params.categoryId)
      .single()

    const leveledUp = (skillAfter?.level ?? 1) > (skillBefore?.level ?? 1)

    // 3. ゲーム進行 +1 → ボス討伐・周回判定
    const { data: progressBefore } = await supabase
      .from('game_progress')
      .select('*, chapter:chapters(*)')
      .eq('child_id', params.childId)
      .single()

    await supabase.rpc('increment_game_progress', {
      p_child_id: params.childId,
    })

    const { data: progressAfter } = await supabase
      .from('game_progress')
      .select('*, chapter:chapters(*)')
      .eq('child_id', params.childId)
      .single()

    // 章が変わった = ボス討伐
    const bossDefeated = progressAfter?.chapter_id !== progressBefore?.chapter_id
    // loop_count が増えた = 全章クリア・周回突入
    const looped = (progressAfter?.loop_count ?? 1) > (progressBefore?.loop_count ?? 1)

    // 次の章情報を取得（ボス討伐時）
    let nextChapter = null
    if (bossDefeated && !looped) {
      const { data } = await supabase
        .from('chapters')
        .select('title, chapter_no')
        .eq('id', progressAfter?.chapter_id)
        .single()
      nextChapter = data
    }

    setLoading(false)
    return {
      error: null,
      leveledUp,
      newLevel: skillAfter?.level,
      skillExp: skillAfter?.exp,
      bossDefeated,
      looped,
      newLoopCount: progressAfter?.loop_count,
      nextChapter,
    }
  }

  return { record, loading }
}
