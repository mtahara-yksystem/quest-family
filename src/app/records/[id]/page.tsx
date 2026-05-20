'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { DEFAULT_CATEGORIES } from '@/constants'
import type { GoodDeedWithCategory, Category } from '@/types/database'

function RecordDetailContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const recordId = params?.id as string
  const childId = searchParams.get('childId') ?? ''

  const [record, setRecord] = useState<GoodDeedWithCategory | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedComment, setEditedComment] = useState('')
  const [editedCategoryId, setEditedCategoryId] = useState('')
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const supabase = createClient()

  // 記録データ取得
  useEffect(() => {
    const fetchRecord = async () => {
      if (!recordId) return

      const { data } = await supabase
        .from('good_deeds')
        .select('*, category:categories(*)')
        .eq('id', recordId)
        .single()

      if (data) {
        setRecord(data as GoodDeedWithCategory)
        setEditedComment(data.comment || '')
        setEditedCategoryId(data.category_id)
      }
      setLoading(false)
    }

    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*')
      if (data) setCategories(data)
    }

    fetchRecord()
    fetchCategories()
  }, [recordId])

  // 編集保存
  const handleSave = async () => {
    if (!record) return
    setSaving(true)

    const oldCategoryId = record.category_id
    const newCategoryId = editedCategoryId
    const categoryChanged = oldCategoryId !== newCategoryId

    // 1. 記録を更新
    const { error: updateError } = await supabase
      .from('good_deeds')
      .update({
        comment: editedComment.trim() || null,
        category_id: newCategoryId,
      })
      .eq('id', recordId)

    if (updateError) {
      alert('更新に失敗しました')
      setSaving(false)
      return
    }

    // 2. カテゴリが変更された場合、スキルEXPを調整
    if (categoryChanged) {
      // 旧カテゴリのスキルEXPを-1（ただし0未満にはしない）
      await supabase.rpc('decrement_skill_exp', {
        p_child_id: record.child_id,
        p_category_id: oldCategoryId,
      })

      // 新カテゴリのスキルEXPを+1
      await supabase.rpc('increment_skill_exp', {
        p_child_id: record.child_id,
        p_category_id: newCategoryId,
      })
    }

    setSaving(false)
    setIsEditing(false)

    // データ再取得
    const { data } = await supabase
      .from('good_deeds')
      .select('*, category:categories(*)')
      .eq('id', recordId)
      .single()
    if (data) setRecord(data as GoodDeedWithCategory)
  }

  // 削除
  const handleDelete = async () => {
    if (!record) return
    setDeleting(true)

    // 記録を削除
    const { error } = await supabase
      .from('good_deeds')
      .delete()
      .eq('id', recordId)

    if (error) {
      alert('削除に失敗しました')
      setDeleting(false)
      return
    }

    await supabase.rpc('decrement_skill_exp', {
      p_child_id: record.child_id,
      p_category_id: record.category_id,
    })
    await supabase.rpc('decrement_game_progress', {
      p_child_id: record.child_id,
    })

    // 記録一覧に戻る
    router.push(`/records?childId=${childId}`)
  }

  if (loading) return <div className="loading">読み込み中...</div>

  if (!record) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => router.back()}>‹ もどる</button>
        <div className="empty-state">
          <div className="empty-state__icon">📖</div>
          記録が見つかりません
        </div>
      </div>
    )
  }

  const defaultCat = DEFAULT_CATEGORIES.find(c => c.name === record.category?.name)
  const editedCat = categories.find(c => c.id === editedCategoryId)
  const editedDefaultCat = DEFAULT_CATEGORIES.find(c => c.name === editedCat?.name)
  const date = new Date(record.created_at)

  return (
    <div className="page">
      <button className="back-btn" onClick={() => router.back()}>‹ もどる</button>
      <h1 className="page-title">記録の詳細</h1>

      {!isEditing ? (
        // 表示モード
        <>
          <div className="record-detail-card">
            <div className="record-detail-card__header">
              <div className="record-detail-card__stamp" style={{ background: defaultCat?.bgColor ?? '#F3E8FF' }}>
                {defaultCat?.icon ?? '✨'}
              </div>
              <div className="record-detail-card__meta">
                <div className="record-detail-card__category">{record.category?.name}</div>
                <div className="record-detail-card__date">
                  {date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日
                </div>
              </div>
            </div>
            <div className="record-detail-card__comment">
              {record.comment || '（コメントなし）'}
            </div>
          </div>

          <button
            className="btn btn--primary"
            onClick={() => setIsEditing(true)}
          >
            ✏️ 編集する
          </button>

          <button
            className="btn btn--ghost"
            onClick={() => setShowDeleteConfirm(true)}
          >
            🗑️ 削除する
          </button>
        </>
      ) : (
        // 編集モード
        <>
          <div className="edit-section">
            <label className="input-label">カテゴリ</label>
            <div className="category-select-grid">
              {categories.map(cat => {
                const defCat = DEFAULT_CATEGORIES.find(dc => dc.name === cat.name)
                const isSelected = editedCategoryId === cat.id
                return (
                  <button
                    key={cat.id}
                    className={`category-select-item${isSelected ? ' category-select-item--selected' : ''}`}
                    onClick={() => setEditedCategoryId(cat.id)}
                  >
                    <span className="category-select-item__icon">{defCat?.icon ?? '✨'}</span>
                    <span className="category-select-item__name">{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">コメント</label>
            <textarea
              className="input-field input-field--textarea"
              value={editedComment}
              onChange={e => setEditedComment(e.target.value)}
              placeholder="どんなよかったことだった？"
            />
          </div>

          <button
            className="btn btn--primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '保存中...' : '✓ 保存する'}
          </button>

          <button
            className="btn btn--ghost"
            onClick={() => {
              setIsEditing(false)
              setEditedComment(record.comment || '')
              setEditedCategoryId(record.category_id)
            }}
            disabled={saving}
          >
            キャンセル
          </button>
        </>
      )}

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__icon">⚠️</div>
            <div className="modal__title">この記録を削除しますか？</div>
            <div className="modal__body">
              削除した記録は元に戻せません。<br />
              本当に削除してもよろしいですか？
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--primary"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? '削除中...' : '削除する'}
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RecordDetailPage() {
  return (
    <Suspense fallback={<div className="loading">読み込み中...</div>}>
      <RecordDetailContent />
    </Suspense>
  )
}