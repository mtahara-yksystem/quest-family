-- ============================================================
-- QuestFamily — Supabase SQL スキーマ
-- Supabaseのダッシュボード > SQL Editor で実行する
-- ============================================================

-- ---- users ----
-- Supabaseのauth.usersと連動。追加情報が必要な場合はここに追加。
create table if not exists public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  provider   text not null default 'email',
  created_at timestamptz not null default now()
);

-- ---- children ----
create table if not exists public.children (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  age        int not null default 0,
  created_at timestamptz not null default now()
);

-- ---- categories ----
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  icon       text not null,
  is_default boolean not null default true
);

-- デフォルトカテゴリをシード
insert into public.categories (name, icon, is_default) values
  ('お手伝い',  '🧹', true),
  ('やさしさ',  '💛', true),
  ('チャレンジ', '🔥', true),
  ('勉強・学び', '📚', true),
  ('元気・運動', '⚽', true),
  ('その他',    '✨', true)
on conflict do nothing;

-- ---- good_deeds ----
create table if not exists public.good_deeds (
  id          uuid primary key default gen_random_uuid(),
  child_id    uuid not null references public.children(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  comment     text,
  recorded_by text not null check (recorded_by in ('parent', 'child')),
  created_at  timestamptz not null default now()
);

-- ---- child_skills ----
create table if not exists public.child_skills (
  id          uuid primary key default gen_random_uuid(),
  child_id    uuid not null references public.children(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  level       int not null default 1,
  exp         int not null default 0,
  unique (child_id, category_id)
);

-- ---- chapters ----
create table if not exists public.chapters (
  id               uuid primary key default gen_random_uuid(),
  chapter_no       int not null unique,
  title            text not null,
  required_records int not null default 20,
  -- nullable: MVPではコードでデフォルト画像をマッピング
  map_image_url    text,
  boss_image_url   text,
  boss_name        text
);

-- 章データをシード
insert into public.chapters (chapter_no, title, required_records, boss_name) values
  (1, '村を守れ！',   5, 'スライムキング'),
  (2, '森の奥へ',     5, 'フォレストゴーレム'),
  (3, '山を越えろ',   10, 'ロックドラゴン'),
  (4, '砂漠の宝',     10, 'デザートスコーピオン'),
  (5, '海を渡れ',     15, 'シーサーペント'),
  (6, '空の城へ',     15, 'クラウドジャイアント'),
  (7, '魔王の城',     20, 'ダークロード'),
  (8, '伝説の冒険者', 20, 'ラスボス・シャドウキング')
on conflict do nothing;

-- ---- game_progress ----
create table if not exists public.game_progress (
  id            uuid primary key default gen_random_uuid(),
  child_id      uuid not null references public.children(id) on delete cascade,
  chapter_id    uuid not null references public.chapters(id),
  total_records int not null default 0,
  loop_count    int not null default 1,
  updated_at    timestamptz not null default now(),
  unique (child_id)
);

-- ============================================================
-- RPC関数
-- ============================================================

-- スキルEXP +1（スキルが存在しない場合はINSERT）
create or replace function increment_skill_exp(
  p_child_id    uuid,
  p_category_id uuid
) returns void language plpgsql as $$
begin
  insert into public.child_skills (child_id, category_id, exp, level)
  values (p_child_id, p_category_id, 1, 1)
  on conflict (child_id, category_id)
  do update set
    exp   = child_skills.exp + 1,
    level = (child_skills.exp + 1) / 10 + 1; -- 10EXPでレベルアップ
end;
$$;

-- ゲーム進行 total_records +1（章クリア判定も行う）
create or replace function increment_game_progress(
  p_child_id uuid
) returns void language plpgsql as $$
declare
  v_progress     public.game_progress%rowtype;
  v_chapter      public.chapters%rowtype;
  v_next_chapter public.chapters%rowtype;
begin
  -- 現在の進行状況を取得
  select * into v_progress
  from public.game_progress
  where child_id = p_child_id;

  -- total_records +1
  update public.game_progress
  set total_records = total_records + 1,
      updated_at    = now()
  where child_id = p_child_id;

  -- 現在の章を取得
  select * into v_chapter
  from public.chapters
  where id = v_progress.chapter_id;

  -- 章クリア判定
  if (v_progress.total_records + 1) >= v_chapter.required_records then
    -- 次の章を取得
    select * into v_next_chapter
    from public.chapters
    where chapter_no = v_chapter.chapter_no + 1;

    if v_next_chapter.id is not null then
      -- 次の章へ進む
      update public.game_progress
      set chapter_id    = v_next_chapter.id,
          total_records = 0,
          updated_at    = now()
      where child_id = p_child_id;
    else
      -- 最終章クリア → 2周目へ
      select * into v_next_chapter
      from public.chapters
      where chapter_no = 1;

      update public.game_progress
      set chapter_id    = v_next_chapter.id,
          total_records = 0,
          loop_count    = loop_count + 1,
          updated_at    = now()
      where child_id = p_child_id;
    end if;
  end if;
end;
$$;

-- ============================================================
-- Row Level Security (RLS)
-- 自分のデータしか見えない・操作できないように設定
-- ============================================================

alter table public.children     enable row level security;
alter table public.good_deeds   enable row level security;
alter table public.child_skills enable row level security;
alter table public.game_progress enable row level security;

-- children: 自分が登録した子どものみ
create policy "users can manage own children"
  on public.children for all
  using (user_id = auth.uid());

-- good_deeds: 自分の子どもの記録のみ
create policy "users can manage own good_deeds"
  on public.good_deeds for all
  using (child_id in (select id from public.children where user_id = auth.uid()));

-- child_skills: 自分の子どものスキルのみ
create policy "users can manage own child_skills"
  on public.child_skills for all
  using (child_id in (select id from public.children where user_id = auth.uid()));

-- game_progress: 自分の子どもの進行状況のみ
create policy "users can manage own game_progress"
  on public.game_progress for all
  using (child_id in (select id from public.children where user_id = auth.uid()));

-- categories・chapters は全員が読める（書き込みは管理者のみ）
alter table public.categories enable row level security;
alter table public.chapters   enable row level security;
create policy "categories are public" on public.categories for select using (true);
create policy "chapters are public"   on public.chapters   for select using (true);
