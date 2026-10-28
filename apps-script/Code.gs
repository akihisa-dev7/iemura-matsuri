/**
 * 家村祭 参加申請 受付 API（Google Apps Script）
 *
 * 使い方（README の「申請フォームのセットアップ」を参照）
 *  1. 新しい Google スプレッドシートを作成 → 拡張機能 → Apps Script
 *  2. このファイルの中身を貼り付け、ADMIN_KEY を自分だけのパスワードに変更して保存
 *  3. デプロイ → 新しいデプロイ → 種類「ウェブアプリ」
 *       次のユーザーとして実行: 自分
 *       アクセスできるユーザー: 全員
 *  4. 表示された URL（…/exec）を config.js に設定
 */

// ▼ 管理画面のパスワード。必ず変更してください（他人に推測されない長めの文字列）
const ADMIN_KEY = 'CHANGE-ME-iemura-2026';

const SHEET_NAME = '申請一覧';
const HEADERS = ['受付日時', 'お名前', '参加人数', '大学名'];
const COUNT_OPTIONS = ['1名', '2名', '3名', '4名', '5名', '6名以上'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// スプレッドシートの数式として解釈されないようにする
function safe_(v, max) {
  let s = String(v == null ? '' : v).trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // ボット対策（見えない入力欄に値が入っていたら保存しない）
    if (d.website) return json_({ ok: true });

    const name = safe_(d.name, 100);
    const count = String(d.count || '').trim();
    const university = safe_(d.university, 100);

    if (!name || !university) return json_({ ok: false, error: '未入力の項目があります' });
    if (COUNT_OPTIONS.indexOf(count) === -1) return json_({ ok: false, error: '参加人数を選択してください' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet_().appendRow([new Date(), name, count, university]);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'サーバーエラーが発生しました' });
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action !== 'list') return json_({ ok: true, service: 'iemura-matsuri' });
  if (p.key !== ADMIN_KEY) return json_({ ok: false, error: 'unauthorized' });

  const values = getSheet_().getDataRange().getValues();
  const rows = values.slice(1).filter(function (r) { return r[1] !== ''; }).map(function (r) {
    const at = r[0] instanceof Date
      ? Utilities.formatDate(r[0], 'Asia/Tokyo', 'yyyy/MM/dd HH:mm')
      : String(r[0]);
    return {
      at: at,
      name: String(r[1]).replace(/^'/, ''),
      count: String(r[2]),
      university: String(r[3]).replace(/^'/, ''),
    };
  });
  return json_({ ok: true, rows: rows });
}
