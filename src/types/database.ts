// ============================================================
// DB型定義 — Supabase テーブル構造に対応
// テーブル名: users, children, categories, good_deeds,
//             child_skills, chapters, game_progress
// ============================================================

export type User = {
  id: string
  email: string
  provider: string
  created_at: string
}

export type Child = {
  id: string
  user_id: string
  name: string
  age: number
  created_at: string
}

export type Category = {
  id: string
  name: string
  icon: string        // 絵文字 e.g. "🧹"
  is_default: boolean
}

export type GoodDeed = {
  id: string
  child_id: string
  category_id: string
  comment: string | null
  created_at: string
}

// カテゴリ情報をJOINした拡張型（一覧表示用）
export type GoodDeedWithCategory = GoodDeed & {
  category: Category
}

export type ChildSkill = {
  id: string
  child_id: string
  category_id: string
  level: number
  exp: number         // スライダー初期値 + 記録ごとに+1
}

// カテゴリ情報をJOINした拡張型
export type ChildSkillWithCategory = ChildSkill & {
  category: Category
}

export type Chapter = {
  id: string
  chapter_no: number
  title: string
  required_records: number
  // nullable — MVPではコードでデフォルト画像をマッピング
  map_image_url: string | null
  boss_image_url: string | null
  boss_name: string | null
}

export type GameProgress = {
  id: string
  child_id: string
  chapter_id: string
  total_records: number
  loop_count: number    // 何周目か (1始まり)
  updated_at: string
}

// ゲーム進行状況（章情報をJOINした拡張型）
export type GameProgressWithChapter = GameProgress & {
  chapter: Chapter
}
