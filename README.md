# 家村祭 LP

2026.11.21 SAT 京都・河原町

| ページ | URL |
|---|---|
| トップ | https://akihisa-dev7.github.io/iemura-matsuri/ |
| 参加申請フォーム | https://akihisa-dev7.github.io/iemura-matsuri/entry.html |
| 参加者管理画面 | https://akihisa-dev7.github.io/iemura-matsuri/admin.html |

main に push すると GitHub Actions で自動公開されます。

## 申請フォームのセットアップ（最初に1回だけ）

申請データは Google スプレッドシートに保存されます。

1. Google スプレッドシートを新規作成（名前は「家村祭 申請」など）
2. メニューの **拡張機能 → Apps Script** を開く
3. 最初からある `コード.gs` の中身を全部消して、`apps-script/Code.gs` の中身を貼り付ける
4. `ADMIN_KEY` の値を管理画面用のパスワードに変更して保存（💾）
5. 右上の **デプロイ → 新しいデプロイ** → 歯車から種類「**ウェブアプリ**」を選ぶ
   - 次のユーザーとして実行：**自分**
   - アクセスできるユーザー：**全員**
6. 「デプロイ」→ Google アカウントのアクセス許可を承認（「詳細」→「安全ではないページに移動」で進めます）
7. 表示された **ウェブアプリの URL**（`https://script.google.com/macros/s/…/exec`）を `config.js` の `IEMURA_API_URL` に入れて push

`config.js` が空の間は、フォームはメールアプリを開く方式で動きます。

### Apps Script を書き換えたとき

**デプロイ → デプロイを管理 → 鉛筆アイコン → バージョン「新バージョン」→ デプロイ** で更新すると URL が変わりません。

## 管理画面

`admin.html` を開き、`ADMIN_KEY` に設定したパスワードを入力すると、申請一覧・合計人数・大学別人数が表示されます。CSV ダウンロードもできます。
申請の削除・修正はスプレッドシート上で直接行ってください。
