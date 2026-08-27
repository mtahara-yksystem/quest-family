// ============================================================
// 定数定義
// ============================================================

import type { StampOption } from '@/types'

// デフォルトカテゴリ（DBのcategoriesテーブルのシード用も兼ねる）
export const DEFAULT_CATEGORIES: StampOption[] = [
  { categoryId: 'otetsudai', icon: '🧹', name: 'お手伝い',  bgColor: '#FFF3CD' },
  { categoryId: 'yasashisa', icon: '💛', name: 'やさしさ',  bgColor: '#FFF9E8' },
  { categoryId: 'challenge', icon: '🔥', name: 'チャレンジ', bgColor: '#FFE8E8' },
  { categoryId: 'study',     icon: '📚', name: '勉強・学び', bgColor: '#E8F0FF' },
  { categoryId: 'sport',     icon: '⚽', name: '元気・運動', bgColor: '#E8F7EE' },
  { categoryId: 'other',     icon: '✨', name: 'その他',     bgColor: '#F3E8FF' },
]

// オンボーディング スライダー文言（0〜10）
export const SLIDER_LABELS: Record<number, string> = {
  0:  'これからはじまる冒険だ！',
  1:  'じわじわ積み上げてる！',
  2:  'じわじわ積み上げてる！',
  3:  'いい調子で育ってる！',
  4:  'いい調子で育ってる！',
  5:  'なかなかのベテランだ！',
  6:  'なかなかのベテランだ！',
  7:  'すごくがんばってきた！',
  8:  'すごくがんばってきた！',
  9:  'もうベテラン冒険者！',
  10: 'もうベテラン冒険者！',
}

// ゲームパラメータ
export const GAME_CONFIG = {
  // 1章あたりの必要記録数（デフォルト値）
  RECORDS_PER_CHAPTER: 20,
  // カテゴリ別スキルのレベルアップに必要なEXP
  EXP_PER_LEVEL: 10,
  // スキルEXPのスライダー最大値（初期値上限）
  SKILL_SLIDER_MAX: 10,
  // ★ 総合レベル（キャラクター全体）に必要なEXP。
  // 全カテゴリ合計の記録数がベース。カテゴリ別(10)より小さくして
  // 「記録するたびに何か育つ」体感速度を作る。様子を見て調整する。
  CHAR_EXP_PER_LEVEL: 4,
} as const

// 総合レベル帯ごとの称号（低い順に並べる）
export const CHAR_LEVEL_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 1,  title: '冒険者のたまご' },
  { minLevel: 3,  title: 'かけだし冒険者' },
  { minLevel: 6,  title: 'たのもしい冒険者' },
  { minLevel: 10, title: 'ベテラン冒険者' },
  { minLevel: 15, title: '伝説の冒険者' },
]

export function getCharTitle(level: number): string {
  const matched = [...CHAR_LEVEL_TITLES].reverse().find(t => level >= t.minLevel)
  return matched?.title ?? CHAR_LEVEL_TITLES[0].title
}

// 総合EXP（全カテゴリのexp合計）からキャラクターレベルを算出
export function calcCharLevel(totalExp: number): number {
  return Math.floor(totalExp / GAME_CONFIG.CHAR_EXP_PER_LEVEL) + 1
}

// MVPの章データ（chaptersテーブルにシードする or コードで管理）
// map_image_url・boss_image_url は将来的にDBから読む
export const DEFAULT_CHAPTERS = [
  {
    chapter_no: 1,
    title: '村を守れ！',
    required_records: 20,
    boss_name: 'スライムキング',
    map_image_url: null,
    boss_image_url: null,
  },
  {
    chapter_no: 2,
    title: '森の奥へ',
    required_records: 20,
    boss_name: 'フォレストゴーレム',
    map_image_url: null,
    boss_image_url: null,
  },
  {
    chapter_no: 3,
    title: '山を越えろ',
    required_records: 20,
    boss_name: 'ロックドラゴン',
    map_image_url: null,
    boss_image_url: null,
  },
] as const
