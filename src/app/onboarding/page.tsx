'use client'

// 1. Suspense をインポートに追加
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { DEFAULT_CATEGORIES, SLIDER_LABELS, GAME_CONFIG } from '@/constants'
import type { SkillInitialValues } from '@/types'

interface ChildData {
  name: string
  age: string
  skillValues: SkillInitialValues
}

// 2. メインのロジックは名前を「OnboardingContainer」に変更
function OnboardingContainer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAddMode = searchParams?.get('add') === '1'
  const supabase = createClient()

  // ステップ管理: 1=情報入力, 2=スキル設定, 3=追加確認, 4=追加の子情報, 5=追加の子スキル
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [loading, setLoading] = useState(false)

  // 子どもデータの配列（複数人対応）
  const [children, setChildren] = useState<ChildData[]>([
    {
      name: '',
      age: '',
      skillValues: Object.fromEntries(DEFAULT_CATEGORIES.map(c => [c.categoryId, 0]))
    }
  ])

  // 現在編集中の子どものインデックス
  const [currentChildIndex, setCurrentChildIndex] = useState(0)

  const currentChild = children[currentChildIndex]

  // Step 1: 子どもの情報入力
  const handleStepOne = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentChild.name.trim()) return
    setStep(2)
  }

  // Step 2完了後
  const handleStepTwoComplete = () => {
    if (!isAddMode && currentChildIndex === 0) {
      setStep(3)
    } else {
      handleFinalComplete()
    }
  }

  // Step 3: さらに子どもを追加するか確認
  const handleAddAnother = () => {
    setChildren([
      ...children,
      {
        name: '',
        age: '',
        skillValues: Object.fromEntries(DEFAULT_CATEGORIES.map(c => [c.categoryId, 0]))
      }
    ])
    setCurrentChildIndex(children.length)
    setStep(4)
  }

  // Step 4: 追加の子どもの情報入力完了
  const handleAdditionalChildInfo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentChild.name.trim()) return
    setStep(5)
  }

  // Step 5完了後
  const handleAdditionalChildSkills = () => {
    setStep(3)
  }

  // 最終登録処理
  const handleFinalComplete = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: categories } = await supabase.from('categories').select('*')
    if (!categories) {
      setLoading(false)
      return
    }

    const { data: firstChapter } = await supabase
      .from('chapters')
      .select('id, required_records')
      .eq('chapter_no', 1)
      .single()

    if (!firstChapter) {
      setLoading(false)
      return
    }

    for (const childData of children) {
      if (!childData.name.trim()) continue

      const { data: child, error: childError } = await supabase
        .from('children')
        .insert({
          user_id: user.id,
          name: childData.name.trim(),
          age: parseInt(childData.age) || 0
        })
        .select()
        .single()

      if (childError || !child) continue

      const skillRows = categories.map(cat => {
        const defaultCat = DEFAULT_CATEGORIES.find(dc => dc.name === cat.name)
        const initialExp = !defaultCat ? 0 : (childData.skillValues[defaultCat.categoryId] ?? 0)
        return {
          child_id: child.id,
          category_id: cat.id,
          level: Math.floor(initialExp / GAME_CONFIG.EXP_PER_LEVEL) + 1,
          exp: initialExp,
        }
      })
      await supabase.from('child_skills').insert(skillRows)

      const totalInitialExp = DEFAULT_CATEGORIES.reduce(
        (sum, cat) => sum + (childData.skillValues[cat.categoryId] ?? 0),
        0
      )

      await supabase.from('game_progress').insert({
        child_id: child.id,
        chapter_id: firstChapter.id,
        total_records: Math.min(totalInitialExp, firstChapter.required_records - 1),
        loop_count: 1,
      })
    }

    router.push('/home')
  }

  const updateCurrentChild = (updates: Partial<ChildData>) => {
    const newChildren = [...children]
    newChildren[currentChildIndex] = { ...currentChild, ...updates }
    setChildren(newChildren)
  }

  const totalExp = DEFAULT_CATEGORIES.reduce(
    (s, c) => s + (currentChild.skillValues[c.categoryId] ?? 0),
    0
  )

  return (
    <div className="onboarding">
      {/* ステップインジケーター */}
      <div className="step-indicator">
        {step <= 2 && [1, 2].map(s => (
          <div
            key={s}
            className={`step-indicator__dot${step >= s ? ' step-indicator__dot--active' : ''}`}
          />
        ))}
        {step >= 4 && [4, 5].map(s => (
          <div
            key={s}
            className={`step-indicator__dot${step >= s ? ' step-indicator__dot--active' : ''}`}
          />
        ))}
      </div>

      {/* Step 1: 最初の子どもの情報入力 */}
      {step === 1 && (
        <form onSubmit={handleStepOne} style={{ paddingTop: 24 }}>
          <h1 className="page-title">
            {currentChildIndex === 0 ? '子どもの情報' : `${currentChildIndex + 1}人目の情報`}
          </h1>
          <p className="page-subtitle">冒険者のプロフィールを登録しよう</p>

          <div className="input-group">
            <label className="input-label">名前</label>
            <input
              className="input-field"
              value={currentChild.name}
              onChange={e => updateCurrentChild({ name: e.target.value })}
              placeholder="例：たろう"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">年齢</label>
            <input
              className="input-field"
              type="number"
              value={currentChild.age}
              onChange={e => updateCurrentChild({ age: e.target.value })}
              placeholder="例：6"
              min="0"
              max="18"
            />
          </div>

          <button type="submit" className="btn btn--primary">
            つぎへ →
          </button>
        </form>
      )}

      {/* Step 2 & 5: スキル初期値設定 */}
      {(step === 2 || step === 5) && (
        <div style={{ paddingTop: 24 }}>
          <h1 className="page-title">
            {currentChild.name}の冒険は？
          </h1>
          <p className="page-subtitle">
            今までのがんばりをスタートに反映できるよ（任意）
          </p>

          {totalExp > 0 && (
            <div className="skill-initial-preview">
              <span className="skill-initial-preview__icon">⚔️</span>
              <div>
                <div className="skill-initial-preview__total">
                  初期ポイント合計：{totalExp}
                </div>
                <div className="skill-initial-preview__sub">
                  この分だけクエストが最初から進んだ状態でスタート！
                </div>
              </div>
            </div>
          )}

          {DEFAULT_CATEGORIES.filter(c => c.categoryId !== 'other').map(cat => {
            const val = currentChild.skillValues[cat.categoryId] ?? 0
            return (
              <div key={cat.categoryId} className="skill-slider-card">
                <div className="skill-slider-card__header">
                  <span className="skill-slider-card__icon">{cat.icon}</span>
                  <div className="skill-slider-card__info">
                    <div className="skill-slider-card__name">{cat.name}</div>
                    <div className="skill-slider-card__label">{SLIDER_LABELS[val]}</div>
                  </div>
                  <div className="skill-slider-card__value">
                    {val > 0 ? `+${val}` : ''}
                  </div>
                </div>
                <input
                  className="skill-slider-card__range"
                  type="range"
                  min="0"
                  max="10"
                  value={val}
                  onChange={e => {
                    const newSkillValues = {
                      ...currentChild.skillValues,
                      [cat.categoryId]: parseInt(e.target.value)
                    }
                    updateCurrentChild({ skillValues: newSkillValues })
                  }}
                />
                <div className="skill-slider-card__hints">
                  <span>これからだ！</span>
                  <span>いい調子！</span>
                  <span>もうベテラン！</span>
                </div>
              </div>
            )
          })}

          <button
            onClick={step === 2 ? handleStepTwoComplete : handleAdditionalChildSkills}
            disabled={loading}
            className="btn btn--primary"
          >
            {step === 2 ? 'つぎへ ⚔️' : 'この子の設定完了 ✓'}
          </button>

          <button
            onClick={() => {
              updateCurrentChild({
                skillValues: Object.fromEntries(
                  DEFAULT_CATEGORIES.map(c => [c.categoryId, 0])
                )
              })
              if (step === 2) {
                handleStepTwoComplete()
              } else {
                handleAdditionalChildSkills()
              }
            }}
            disabled={loading}
            className="btn btn--ghost"
          >
            スキップ
          </button>
        </div>
      )}

      {/* Step 3: 追加の子ども登録確認 */}
      {step === 3 && (
        <div style={{ paddingTop: 24 }}>
          <h1 className="page-title">他にも冒険者はいる？</h1>
          <p className="page-subtitle">
            兄弟姉妹がいる場合、まとめて登録できます
          </p>

          <div style={{ marginBottom: 24 }}>
            <div className="section-label">登録済み（{children.length}人）</div>
            {children.map((child, index) => (
              <div key={index} className="child-preview-card">
                <span className="child-preview-card__avatar">👦</span>
                <div className="child-preview-card__info">
                  <div className="child-preview-card__name">{child.name}</div>
                  <div className="child-preview-card__age">
                    {child.age ? `${child.age}歳` : '年齢未設定'}
                  </div>
                </div>
                <div className="child-preview-card__exp">
                  初期EXP: {DEFAULT_CATEGORIES.reduce(
                    (s, c) => s + (child.skillValues[c.categoryId] ?? 0),
                    0
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddAnother}
            className="btn btn--secondary"
            style={{ marginBottom: 12 }}
          >
            ＋ もう1人追加する
          </button>

          <button
            onClick={handleFinalComplete}
            disabled={loading}
            className="btn btn--primary"
          >
            {loading ? '登録中...' : `${children.length}人で冒険をはじめる ⚔️`}
          </button>
        </div>
      )}

      {/* Step 4: 追加の子どもの情報入力 */}
      {step === 4 && (
        <form onSubmit={handleAdditionalChildInfo} style={{ paddingTop: 24 }}>
          <h1 className="page-title">{children.length}人目の冒険者</h1>
          <p className="page-subtitle">プロフィールを登録しよう</p>

          <div className="input-group">
            <label className="input-label">名前</label>
            <input
              className="input-field"
              value={currentChild.name}
              onChange={e => updateCurrentChild({ name: e.target.value })}
              placeholder="例：はなこ"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">年齢</label>
            <input
              className="input-field"
              type="number"
              value={currentChild.age}
              onChange={e => updateCurrentChild({ age: e.target.value })}
              placeholder="例：4"
              min="0"
              max="18"
            />
          </div>

          <button type="submit" className="btn btn--primary">
            つぎへ →
          </button>

          <button
            type="button"
            onClick={() => {
              setChildren(children.slice(0, -1))
              setCurrentChildIndex(0)
              setStep(3)
            }}
            className="btn btn--ghost"
          >
            キャンセル
          </button>
        </form>
      )}
    </div>
  )
}

// 3. 本来のエクスポート用ページコンポーネントで Suspense を適用
export default function OnboardingPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, textAlign: 'center' }}>読み込み中...</div>}>
      <OnboardingContainer />
    </Suspense>
  )
}