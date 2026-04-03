# QuestFamily — セットアップガイド

子どもの「よかったこと」を記録して、親子で冒険を進めるRPGアプリ。

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 14 (App Router / TypeScript) |
| バックエンド | Next.js API Routes |
| DB・認証・同期 | Supabase |
| ホスティング | Vercel |

---

## セットアップ手順

### 1. Supabaseプロジェクトを作成

1. [supabase.com](https://supabase.com) でアカウント作成
2. 新しいプロジェクトを作成
3. ダッシュボード > SQL Editor を開く
4. `supabase_schema.sql` の内容をすべてコピーして実行

### 2. 環境変数を設定

```bash
cp .env.local.example .env.local
```

`.env.local` を開いて以下を入力：
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase ダッシュボード > Settings > API > Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — 同ページの anon/public キー

### 3. 依存パッケージをインストール

```bash
npm install
```

### 4. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く。

---

## ディレクトリ構成

```
src/
  app/
    login/          # ログイン画面（Magic Link）
    onboarding/     # アカウント作成・スキル初期設定
    home/           # ホーム画面（メイン）
    stamp/          # スタンプ選択
    stamp/comment/  # コメント入力
    records/        # 記録一覧
    quest/          # クエスト詳細
  components/
    ui/             # 汎用UIコンポーネント
    features/       # 機能単位のコンポーネント
  hooks/            # カスタムフック（Supabaseとのやりとり）
  lib/              # Supabaseクライアント
  types/            # 型定義
  constants/        # 定数（カテゴリ・ゲーム設定）
```

---

## 開発の流れ（MVP）

```
ログイン → オンボーディング → ホーム → スタンプ選択 → コメント入力 → ホーム
                                ↓              ↑
                          クエスト確認    記録一覧
```

---

## 注意事項

- `MOCK_CHILD_ID` が各ページにあります。認証・子ども選択の仕組みができたら実際のIDに差し替えてください
- Supabaseの RLS（Row Level Security）が有効になっているため、ログインしていないと自分のデータにアクセスできません
- 章の画像（`map_image_url`・`boss_image_url`）はMVPでは未設定（null）。`src/constants/index.ts` の `DEFAULT_CHAPTERS` で絵文字で代替しています

---

## Vercelへのデプロイ

1. GitHubにプッシュ
2. [vercel.com](https://vercel.com) でリポジトリを連携
3. 環境変数（`NEXT_PUBLIC_SUPABASE_URL`・`NEXT_PUBLIC_SUPABASE_ANON_KEY`）をVercelのダッシュボードで設定
4. デプロイ完了！
# quest-family
