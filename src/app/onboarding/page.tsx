'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { DEFAULT_CATEGORIES, SLIDER_LABELS, GAME_CONFIG } from '@/constants'
import type { SkillInitialValues } from '@/types'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [skillValues, setSkillValues] = useState<SkillInitialValues>(
    Object.fromEntries(DEFAULT_CATEGORIES.map(c => [c.categoryId, 0]))
  )
  const [loading, setLoading] = useState(false)

  const handleStepOne = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setStep(2)
  }

  const handleComplete = async (skip = false) => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: child, error: childError } = await supabase
      .from('children')
      .insert({ user_id: user.id, name: name.trim(), age: parseInt(age) || 0 })
      .select().single()

    if (childError || !child) { setLoading(false); return }

    const { data: categories } = await supabase.from('categories').select('*')
    if (categories) {
      const skillRows = categories.map(cat => {
        const defaultCat = DEFAULT_CATEGORIES.find(dc => dc.name === cat.name)
        const initialExp = skip || !defaultCat ? 0 : (skillValues[defaultCat.categoryId] ?? 0)
        return {
          child_id: child.id, category_id: cat.id,
          level: Math.floor(initialExp / GAME_CONFIG.EXP_PER_LEVEL) + 1,
          exp: initialExp,
        }
      })
      await supabase.from('child_skills').insert(skillRows)
    }

    const totalInitialExp = skip ? 0
      : DEFAULT_CATEGORIES.reduce((sum, cat) => sum + (skillValues[cat.categoryId] ?? 0), 0)

    const { data: firstChapter } = await supabase
      .from('chapters').select('id, required_records').eq('chapter_no', 1).single()

    if (firstChapter) {
      await supabase.from('game_progress').insert({
        child_id: child.id, chapter_id: firstChapter.id,
        total_records: Math.min(totalInitialExp, firstChapter.required_records - 1),
        loop_count: 1,
      })
    }
    router.push('/home')
  }

  const totalExp = DEFAULT_CATEGORIES.reduce((s, c) => s + (skillValues[c.categoryId] ?? 0), 0)

  return (
    <div className="onboarding">
      <div className="step-indicator">
        {[1, 2].map(s => (
          <div key={s} className={`step-indicator__dot${step >= s ? ' step-indicator__dot--active' : ''}`} />
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleStepOne} style={{ paddingTop: 24 }}>
          <h1 className="page-title">子どもの情報</h1>
          <p className="page-subtitle">冒険者のプロフィールを登録しよう</p>
          <div className="input-group">
            <label className="input-label">名前</label>
            <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="例：たろう" required />
          </div>
          <div className="input-group">
            <label className="input-label">年齢</label>
            <input className="input-field" type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="例：6" min="0" max="18" />
          </div>
          <button type="submit" className="btn btn--primary">つぎへ →</button>
        </form>
      )}

      {step === 2 && (
        <div style={{ paddingTop: 24 }}>
          <h1 className="page-title">これまでの冒険は？</h1>
          <p className="page-subtitle">今までのがんばりをスタートに反映できるよ（任意）</p>

          {totalExp > 0 && (
            <div className="skill-initial-preview">
              <span className="skill-initial-preview__icon">⚔️</span>
              <div>
                <div className="skill-initial-preview__total">初期ポイント合計：{totalExp}</div>
                <div className="skill-initial-preview__sub">この分だけクエストが最初から進んだ状態でスタート！</div>
              </div>
            </div>
          )}

          {DEFAULT_CATEGORIES.filter(c => c.categoryId !== 'other').map(cat => {
            const val = skillValues[cat.categoryId] ?? 0
            return (
              <div key={cat.categoryId} className="skill-slider-card">
                <div className="skill-slider-card__header">
                  <span className="skill-slider-card__icon">{cat.icon}</span>
                  <div className="skill-slider-card__info">
                    <div className="skill-slider-card__name">{cat.name}</div>
                    <div className="skill-slider-card__label">{SLIDER_LABELS[val]}</div>
                  </div>
                  <div className="skill-slider-card__value">{val > 0 ? `+${val}` : ''}</div>
                </div>
                <input
                  className="skill-slider-card__range"
                  type="range" min="0" max="10" value={val}
                  onChange={e => setSkillValues(prev => ({ ...prev, [cat.categoryId]: parseInt(e.target.value) }))}
                />
                <div className="skill-slider-card__hints">
                  <span>これからだ！</span><span>いい調子！</span><span>もうベテラン！</span>
                </div>
              </div>
            )
          })}

          <button onClick={() => handleComplete(false)} disabled={loading} className="btn btn--primary">
            {loading ? '登録中...' : '冒険をはじめる ⚔️'}
          </button>
          <button onClick={() => handleComplete(true)} disabled={loading} className="btn btn--ghost">
            スキップしてはじめる
          </button>
        </div>
      )}
    </div>
  )
}
