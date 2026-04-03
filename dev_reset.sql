-- ============================================================
-- 開発用リセットSQL
-- Supabase SQL Editor にペーストして実行する
-- ============================================================


-- ============================================================
-- 【1】自分のメールアドレスでユーザーIDを確認する
-- ============================================================
select id, email, created_at
from auth.users
where email = 'あなたのメールアドレス@example.com';
-- → 表示された id をコピーして以下の '...' に貼り付ける


-- ============================================================
-- 【2】自分のデータだけ削除（他のユーザーのデータは消えない）
-- children を消すと cascade で以下も全部消える：
--   child_skills / good_deeds / game_progress
-- ============================================================
delete from public.children
where user_id = '確認したUUIDをここに貼り付ける';


-- ============================================================
-- 【3】ワンライナー版（メールアドレスを直接指定してまとめて削除）
-- 毎回使うならこちらが便利
-- ============================================================
delete from public.children
where user_id = (
  select id from auth.users
  where email = 'あなたのメールアドレス@example.com'
);


-- ============================================================
-- 【4】確認用：削除後に何も残っていないかチェック
-- ============================================================
select
  (select count(*) from public.children     where user_id = (select id from auth.users where email = 'あなたのメールアドレス@example.com')) as children,
  (select count(*) from public.child_skills where child_id in (select id from public.children where user_id = (select id from auth.users where email = 'あなたのメールアドレス@example.com'))) as skills,
  (select count(*) from public.good_deeds   where child_id in (select id from public.children where user_id = (select id from auth.users where email = 'あなたのメールアドレス@example.com'))) as deeds,
  (select count(*) from public.game_progress where child_id in (select id from public.children where user_id = (select id from auth.users where email = 'あなたのメールアドレス@example.com'))) as progress;
-- すべて 0 になっていればOK


-- ============================================================
-- 【5】全データ完全リセット（開発初期・全部やり直したいとき）
-- ⚠️ 全ユーザーのデータが消えるので注意
-- ============================================================
-- truncate public.good_deeds   restart identity cascade;
-- truncate public.child_skills restart identity cascade;
-- truncate public.game_progress restart identity cascade;
-- truncate public.children     restart identity cascade;
