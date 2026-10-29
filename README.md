# 家村祭 LP

2026.11.21 SAT 京都・河原町

| ページ | URL |
|---|---|
| トップ | https://akihisa-dev7.github.io/iemura-matsuri/ |
| 参加申請フォーム | https://akihisa-dev7.github.io/iemura-matsuri/entry.html |
| 参加者管理画面 | https://akihisa-dev7.github.io/iemura-matsuri/admin.html |

main に push すると GitHub Actions で自動公開されます。

## 申請フォームのセットアップ（最初に1回だけ）

申請データは Supabase（Postgres）に保存されます。

1. https://supabase.com でプロジェクトを作成（リージョンは Tokyo がおすすめ）
2. **SQL Editor** を開き、`supabase/schema.sql` の中身を貼り付けて **Run**
3. **Authentication → Sign In / Providers** で「Allow new users to sign up」を **オフ**
4. **Authentication → Users → Add user → Create new user** で管理者のメールアドレスとパスワードを作成（Auto Confirm にチェック）
5. SQL Editor で管理者を登録して Run
   ```sql
   insert into public.admins (email) values ('管理者のメールアドレス');
   ```
6. **Project Settings → API Keys** の **Project URL** と **Publishable key**（または anon key）を `config.js` に入れて push
   - `secret` / `service_role` キーは絶対に入れないこと

`config.js` が空の間は、フォームはメールアプリを開く方式で動きます。

## 権限

| | 申請の追加 | 一覧の閲覧 | 修正・削除 |
|---|---|---|---|
| 誰でも（フォーム） | ○ | × | × |
| `admins` に登録したユーザー（管理画面） | ○ | ○ | × |
| Supabase のダッシュボード | ○ | ○ | ○（Table Editor） |

管理者を増やすときは、手順4・5を繰り返してください。

## 管理画面

`admin.html` を開き、管理者のメールアドレスとパスワードでログインすると、申請一覧・合計人数・職業別人数が表示されます。CSV ダウンロードもできます。
申請の削除・修正は Supabase の **Table Editor → entries** で直接行ってください。

## 注意

Supabase の無料プランは、1週間アクセスがないとプロジェクトが一時停止します。ダッシュボードから再開できます（データは消えません）。
