'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type {
  Child,
  GoodDeedWithCategory,
  GameProgressWithChapter,
  ChildSkillWithCategory,
} from '@/types/database'

// ---- 親に紐づく全子ども一覧 ----
export function useChildren() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetch = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { data } = await supabase
      .from('children')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    setChildren(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])
  return { children, loading, refetch: fetch }
}

// ---- 後方互換：最初の子どもIDを返す ----
export function useCurrentChild() {
  const [childId, setChildId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      supabase.from('children').select('id').eq('user_id', user.id)
        .order('created_at', { ascending: true }).limit(1).maybeSingle()
        .then(({ data }) => { setChildId(data?.id ?? null); setLoading(false) })
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
    supabase.from('children').select('*').eq('id', childId).single()
      .then(({ data }) => { setChild(data); setLoading(false) })
  }, [childId])

  return { child, loading }
}

// ---- よかったこと一覧 ----
export function useGoodDeeds(childId: string | null, limit = 10) {
  const [deeds, setDeeds] = useState<GoodDeedWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!childId) { setLoading(false); return }
    supabase.from('good_deeds').select('*, category:categories(*)')
      .eq('child_id', childId).order('created_at', { ascending: false }).limit(limit)
      .then(({ data }) => { setDeeds((data as GoodDeedWithCategory[]) ?? []); setLoading(false) })
  }, [childId, limit])

  return { deeds, loading }
}

// ---- スキル一覧（exp降順＝上位スキルが先頭）----
export function useChildSkills(childId: string | null) {
  const [skills, setSkills] = useState<ChildSkillWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!childId) { setLoading(false); return }
    supabase.from('child_skills').select('*, category:categories(*)')
      .eq('child_id', childId).order('exp', { ascending: false })
      .then(({ data }) => { setSkills((data as ChildSkillWithCategory[]) ?? []); setLoading(false) })
  }, [childId])

  return { skills, loading }
}

// ---- ゲーム進行状況 ----
export function useGameProgress(childId: string | null) {
  const [progress, setProgress] = useState<GameProgressWithChapter | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetch = useCallback(async () => {
    if (!childId) { setLoading(false); return }
    const { data } = await supabase.from('game_progress')
      .select('*, chapter:chapters(*)').eq('child_id', childId).single()
    setProgress(data as GameProgressWithChapter)
    setLoading(false)
  }, [childId])

  useEffect(() => { fetch() }, [fetch])
  return { progress, loading, refetch: fetch }
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

    const { error } = await supabase.from('good_deeds').insert({
      child_id: params.childId,
      category_id: params.categoryId,
      comment: params.comment,
      recorded_by: params.recordedBy,
    })
    if (error) { setLoading(false); return { error } }

    const { data: skillBefore } = await supabase.from('child_skills')
      .select('level, exp').eq('child_id', params.childId)
      .eq('category_id', params.categoryId).single()

    await supabase.rpc('increment_skill_exp', {
      p_child_id: params.childId, p_category_id: params.categoryId,
    })

    const { data: skillAfter } = await supabase.from('child_skills')
      .select('level, exp').eq('child_id', params.childId)
      .eq('category_id', params.categoryId).single()

    const leveledUp = (skillAfter?.level ?? 1) > (skillBefore?.level ?? 1)

    const { data: progressBefore } = await supabase.from('game_progress')
      .select('*, chapter:chapters(*)').eq('child_id', params.childId).single()

    await supabase.rpc('increment_game_progress', { p_child_id: params.childId })

    const { data: progressAfter } = await supabase.from('game_progress')
      .select('*, chapter:chapters(*)').eq('child_id', params.childId).single()

    const bossDefeated = progressAfter?.chapter_id !== progressBefore?.chapter_id
    const looped = (progressAfter?.loop_count ?? 1) > (progressBefore?.loop_count ?? 1)

    let nextChapter = null
    if (bossDefeated && !looped) {
      const { data } = await supabase.from('chapters')
        .select('title, chapter_no').eq('id', progressAfter?.chapter_id).single()
      nextChapter = data
    }

    setLoading(false)
    return {
      error: null, leveledUp,
      newLevel: skillAfter?.level, skillExp: skillAfter?.exp,
      bossDefeated, looped, newLoopCount: progressAfter?.loop_count, nextChapter,
    }
  }

  return { record, loading }
}