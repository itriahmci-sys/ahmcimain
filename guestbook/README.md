# Google Sheets 留言板

純 HTML/CSS/JavaScript 前端，可發布到 GitHub Pages；留言由 Google Apps Script API 寫入 Google Sheets。

## 1. 建立 Google Sheet

1. 新增一份 Google 試算表。
2. 從網址複製試算表 ID：`https://docs.google.com/spreadsheets/d/這一段就是ID/edit`。

## 2. 建立 Apps Script API

1. 在試算表開啟「擴充功能 → Apps Script」。
2. 將 `apps-script/Code.gs` 全部貼到編輯器並儲存。
3. 左側「專案設定 → 指令碼屬性」，新增：
   - 屬性：`SPREADSHEET_ID`
   - 值：前一步的試算表 ID
4. 按「部署 → 新增部署作業 → 網頁應用程式」。
5. 執行身分選「我」，存取權選「所有人」，完成 Google 授權。
6. 複製部署後以 `/exec` 結尾的網址。

## 3. 設定前端

開啟 `config.js`，把 `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` 換成上一步的 `/exec` 網址。

## 4. 發布到 GitHub Pages

1. 在 GitHub 建立新的 repository，例如 `guestbook`。
2. 上傳本專案根目錄內的 `index.html`、`styles.css`、`app.js`、`config.js`（`apps-script` 資料夾可一起保留作備份）。
3. Repository 開啟 `Settings → Pages`。
4. 在 `Build and deployment` 選 `Deploy from a branch`，Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
5. 稍候約 1–2 分鐘，網站會出現在 `https://你的帳號.github.io/guestbook/`。

## 管理留言

試算表會自動建立 `Messages` 工作表。把某列的 `status` 從 `published` 改成其他文字，即可讓該則留言不再顯示；刪除該列則永久移除。

## 上線前注意

- 這是適合小型活動、社群或內部用途的輕量方案，不適合高流量或敏感資料。
- GitHub Pages 與 Apps Script 網址都是公開的，請勿在前端放密碼或 API 金鑰。
- 現有防濫用屬基本等級。公開流量較大時，建議加入 Cloudflare Turnstile、人工審核，或改用具身分驗證的後端。
- Apps Script 更新程式後，須到「管理部署作業」建立新版本，變更才會上線。
