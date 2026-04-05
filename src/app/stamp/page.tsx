'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { DEFAULT_CATEGORIES } from '@/constants'
import type { Category } from '@/types/database'

function StampForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get('childId') ?? ''
  const [categories, setCategories] = useState<Category[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('categories').select('*')
      .then(({ data }) => { if (data) setCategories(data) })
  }, [])

  const handleSelect = (categoryId: string) => {
    setSelected(categoryId)
    setTimeout(() => {
      router.push(`/stamp/comment?categoryId=${categoryId}&childId=${childId}`)
    }, 200)
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={() => router.back()}>‹ もどる</button>
      <h1 className="page-title">カテゴリを選んで</h1>
      <p className="page-subtitle">何をがんばった？</p>
      <div className="stamp-grid">
        {categories.map(cat => {
          const defaultCat = DEFAULT_CATEGORIES.find(dc => dc.name === cat.name)
          return (
            <button
              key={cat.id}
              className={`stamp-item${selected === cat.id ? ' stamp-item--selected' : ''}`}
              onClick={() => handleSelect(cat.id)}
            >
              <span className="stamp-item__emoji">{defaultCat?.icon ?? '✨'}</span>
              <span className="stamp-item__label">{cat.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function StampPage() {
  return (
    <Suspense fallback={<div className="loading">読み込み中...</div>}>
      <StampForm />
    </Suspense>
  )
}