// ============================================================
// アプリレベルの型定義（UIコンポーネント・フック用）
// ============================================================

// オンボーディングのスキル初期値（スライダー値）
export type SkillInitialValues = {
  [categoryId: string]: number  // 0〜10
}

// スタンプ選択画面で使う型
export type StampOption = {
  categoryId: string
  icon: string
  name: string
  bgColor: string
}

// 記録フォームの入力値
export type GoodDeedFormValues = {
  categoryId: string
  comment: string
  recordedBy: 'parent' | 'child'
}

// ホーム画面に必要な集約データ
export type HomeData = {
  child: import('./database').Child
  skills: import('./database').ChildSkillWithCategory[]
  recentDeeds: import('./database').GoodDeedWithCategory[]
  gameProgress: import('./database').GameProgressWithChapter
}
