# 健康樂活與智慧醫療照護聯盟活動報名網頁

本專案可部署在 GitHub Pages，表單資料透過 Google Apps Script 寫入 Google Sheet 的 `網頁報名` 分頁。

## 1. 設定 Google Apps Script

1. 開啟「健康樂活與智慧醫療照護聯盟活動報名表 (回覆)」Google Sheet。
2. 選擇「擴充功能」→「Apps Script」。
3. 將 `apps-script/Code.gs` 的內容完整貼入並儲存。
4. 選擇「部署」→「新增部署作業」。
5. 類型選擇「網頁應用程式」。
6. 「執行身分」選擇自己；「誰可以存取」選擇「所有人」。
7. 完成授權後，複製部署網址（通常以 `/exec` 結尾）。
8. 開啟 `config.js`，把 `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` 換成部署網址。

> 若之後修改 `Code.gs`，請在 Apps Script 的「管理部署作業」建立新版本，前端網址通常不需更換。

## 2. 部署到 GitHub Pages

1. 在 GitHub 建立新的 repository。
2. 上傳本資料夾內的 `index.html`、`styles.css`、`app.js`、`config.js`。
3. 進入 repository 的 `Settings` → `Pages`。
4. 在 `Build and deployment` 選擇 `Deploy from a branch`。
5. Branch 選 `main`，資料夾選 `/ (root)`，按 `Save`。
6. 等待約 1–3 分鐘後，GitHub 會顯示公開網址。

## 3. 上線前檢查

- 更新 `index.html` 中個資聲明的「利用期間」。原 Google Form 所載日期為 2026 年 8 月 7 日，已需重新確認。
- 確認 Google Sheet 有名為 `網頁報名` 的分頁，且第 1 列欄位順序為：時間戳記、電子郵件、同意、姓名、電話、服務單位、職稱、得知管道。
- 用測試資料送出一次，確認資料正確寫入第 2 列以後。
- GitHub repository 請勿放入任何報名者資料；本專案只含空白表單與後端程式碼。

## 檔案說明

- `index.html`：報名頁面
- `styles.css`：版面與響應式設計
- `app.js`：驗證及送出邏輯
- `config.js`：Apps Script 部署網址
- `alliance-logo.png`：聯盟 Logo
- `apps-script/Code.gs`：Google Sheet 寫入 API
