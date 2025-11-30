# Falling In Verb 專案全方位詳解指南 📘

歡迎！這份指南是專為從 **Google AI Studio** 下載本專案的開發者所設計的「終極手冊」。我們將不厭其煩地解釋每一個步驟的「為什麼」與「怎麼做」，確保你能夠完全掌握這個專案。

---

## 1. 專案架構深度解析 (Architecture Deep Dive)

在開始輸入指令之前，我們先來理解這個專案的特殊之處。

### 核心概念：No-Build Firebase Strategy
你可能會疑惑：「為什麼我看不到 `server.js` 或 `app.py` 這樣的後端檔案？」

這是因為我們採用了 **"Client-Side BaaS" (Backend-as-a-Service)** 架構。

*   **前端 (Frontend)**: 使用 **React 19** 和 **TypeScript** 構建。這部分負責所有的畫面顯示和使用者互動邏輯。
*   **後端 (Backend)**: 我們沒有自己寫後端伺服器，而是直接使用 **Firebase** 提供的服務。
    *   **Auth**: 處理使用者登入。
    *   **Firestore**: 處理資料庫存取。
*   **連結方式**: 關鍵在於 `index.html` 檔案。我們引入了 Google 提供的 CDN 腳本 (Gstatic)，這讓瀏覽器可以直接與 Firebase 溝通，而不需要經過中間的伺服器。

**這對開發者意味著什麼？**
1.  **極簡化**: 你不需要擔心伺服器當機，因為根本沒有伺服器。
2.  **安全性**: 雖然程式碼在前端，但 Firebase 的安全性是由「安全性規則 (Security Rules)」在雲端控制的，所以是安全的。

---

## 2. 環境準備與檢查 (Prerequisites)

請打開你的終端機 (Terminal)，依序檢查以下工具。

### 1. Node.js (必備)
這是執行 JavaScript 開發環境的基礎。
```bash
node -v
# 預期輸出: v18.x.x 或更高 (例如 v20.11.0)
```
*如果顯示 "command not found"，請去 Node.js 官網下載安裝。*

### 2. Git (必備)
用於版本控制。
```bash
git --version
# 預期輸出: git version 2.x.x
```

### 3. Docker (選用 - Cloud Run 部署需要)
如果你想用 Docker 部署，請確保 Docker Desktop 正在執行。
```bash
docker --version
# 預期輸出: Docker version 24.x.x
```

### 4. Google Cloud CLI (選用 - Cloud Run 部署需要)
用於與 Google Cloud 溝通。
```bash
gcloud --version
# 預期輸出: Google Cloud SDK 4xx.x.x
```

---

## 3. 本地開發流程 (Local Development)

這是你每天開發會用到的流程。

### 步驟 A: 設定環境變數 (API Key)
由於資安考量，API Key 絕對不能上傳到 Git，所以下載的專案裡不會有這個 Key。你需要手動告訴程式你的 Key 是什麼。

1.  在專案根目錄 (跟 `package.json` 放在一起) 建立一個新檔案，檔名叫做 `.env.local`。
2.  用文字編輯器打開它，貼上以下內容：
    ```env
    VITE_API_KEY=你的_GEMINI_API_KEY
    ```
    *(請將 `你的_GEMINI_API_KEY` 替換成你真實的 Key)*

**原理說明**: Vite (我們的打包工具) 會自動讀取 `.env.local` 檔案，並將 `VITE_` 開頭的變數注入到程式碼中。

### 步驟 B: 安裝依賴套件
剛下載的專案只有程式碼，沒有「零件」。我們需要下載所有需要的套件。

```bash
npm install
```
*   **發生了什麼事？**: npm 會讀取 `package.json`，去網路上把 React, TypeScript, Firebase 等套件下載到 `node_modules` 資料夾中。這個步驟只需要做一次 (或當你新增套件時)。

### 步驟 C: 啟動開發伺服器
現在我們可以讓網站在本地跑起來了。

```bash
npm run dev
```
*   **發生了什麼事？**: 這會啟動 Vite 開發伺服器。
*   **接下來？**: 終端機會顯示一個網址 (通常是 `http://localhost:5173`)。按住 Command (Mac) 或 Ctrl (Windows) 點擊該連結，瀏覽器就會打開你的網站。

---

## 4. 部署方案詳解 (Deployment)

當你寫好程式碼，想讓全世界看到時，你有兩個選擇。

| **推薦指數** | ✅ **首選推薦** | 🔄 若需延續 AI Studio 環境則選此 |

### 深度分析：為什麼對這個專案來說 Firebase Hosting 更好？

你可能會擔心 Firebase Hosting 有什麼「壞處」。事實上，對於 **Falling In Verb** 這種架構的專案來說，Firebase Hosting 幾乎沒有壞處，反而是最佳選擇。

**原因如下：**

1.  **架構匹配度 (Architecture Fit)**:
    *   你的專案是 **SPA (單頁應用)**，所有的邏輯都在瀏覽器端執行 (React + Firebase SDK)。
    *   你**沒有**後端伺服器程式碼 (如 Python, Node.js API) 需要執行。
    *   **Firebase Hosting** 專門就是為了這種靜態檔案 (HTML/CSS/JS) 設計的，它會把你的檔案推送到全球 CDN，速度極快。
    *   **Cloud Run** 是為了「跑容器」設計的。如果你用 Cloud Run，你其實是「為了送出靜態檔案而特地跑一個 Nginx 伺服器」，這有點殺雞焉用牛刀。

2.  **冷啟動 (Cold Starts)**:
    *   **Cloud Run**: 如果一段時間沒人訪問，容器會休眠。下一個使用者訪問時，需要幾秒鐘啟動容器 (Cold Start)，這會導致第一次載入變慢。
    *   **Firebase Hosting**: 永遠在線，沒有冷啟動問題，秒開。

3.  **成本 (Cost)**:
    *   兩者都有免費額度。但 Cloud Run 是按「CPU/記憶體使用時間」計費，如果流量大，跑伺服器的成本通常高於單純的流量傳輸 (Hosting)。

**結論**: 除非你未來打算加入「一定要在伺服器端執行的程式碼」(例如需要隱藏 API Key 的後端代理，或是複雜的 Python 運算)，否則 **Firebase Hosting 是絕對的贏家**。

---

### 方案 A: Firebase Hosting (推薦給初學者)
**特點**: 速度快、免費額度高、設定最簡單。

1.  **安裝 Firebase 工具**:
    ```bash
    npm install -g firebase-tools
    ```
    *(參數 `-g` 表示安裝到全域環境，這樣你在任何資料夾都能用 `firebase` 指令)*

2.  **登入**:
    ```bash
    firebase login
    ```
    *這會跳出瀏覽器視窗，請登入你的 Google 帳號。*

3.  **部署**:
    ```bash
    npm run deploy
    ```
    *   **發生了什麼事？**
        1.  先執行 `npm run build`: 把你的 TypeScript 程式碼編譯、壓縮成瀏覽器看得懂的 HTML/CSS/JS，放在 `dist` 資料夾。
        2.  再執行 `firebase deploy`: 把 `dist` 資料夾的內容上傳到 Firebase 的伺服器。

---

### 方案 B: Google Cloud Run (推薦給進階者 / AI Studio 用戶)
**特點**: 使用 Docker 容器技術，環境完全隔離，與 AI Studio 的部署方式一致。

#### 1. 本地構建 Docker 映像檔 (測試用)
我們先在本地把程式碼「打包」成一個 Docker Image。

```bash
docker build -t falling-in-verb .
```
*   **指令解析**:
    *   `build`: 構建指令。
    *   `-t falling-in-verb`: 給這個映像檔取個名字 (Tag) 叫 `falling-in-verb`。
    *   `.`: 告訴 Docker `Dockerfile` 就在當前目錄。

#### 2. 本地執行容器
打包好了，我們來跑跑看。

```bash
docker run -p 8080:80 falling-in-verb
```
*   **指令解析**:
    *   `run`: 執行指令。
    *   `-p 8080:80`: 把你電腦的 `8080` port 連接到容器內部的 `80` port (Nginx 預設 port)。
    *   現在打開 `http://localhost:8080` 應該能看到網站。

#### 3. 部署到 Google Cloud Run
確認沒問題後，我們把它推上雲端。

```bash
# 1. 設定專案 ID (如果還沒設定過)
gcloud config set project 你的_PROJECT_ID

# 2. 部署
gcloud run deploy falling-in-verb \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated
```
*   **指令解析**:
    *   `--source .`: 直接上傳當前目錄的程式碼，Google 會幫你執行 Docker build。
    *   `--platform managed`: 使用全託管模式 (最省事)。
    *   `--region asia-east1`: 部署到台灣機房 (速度快)。
    *   `--allow-unauthenticated`: 允許任何人訪問 (公開網站)。

---

## 5. 疑難雜症排解 (Troubleshooting)

**Q1: 為什麼 `npm install` 失敗，出現 EACCES 錯誤？**
*   **原因**: 權限不足。
*   **解法**: 試試看在指令前加 `sudo` (Mac/Linux)，例如 `sudo npm install`。或者檢查你的 Node.js 安裝方式 (建議使用 nvm)。

**Q2: 為什麼 `npm run dev` 後，網頁一片白，Console 說 `VITE_API_KEY` is undefined？**
*   **原因**: 你的 `.env.local` 檔案沒設定好，或者檔名打錯了。
*   **解法**: 確認檔名是 `.env.local` (前面有點)，並且變數名稱是 `VITE_API_KEY`。修改後**必須重新啟動** `npm run dev` 才會生效。

**Q3: 部署到 Cloud Run 後，網頁能開，但無法登入或載入資料？**
*   **原因**: 你的 API Key 沒有被打包進去。
*   **解法**: Docker build 的時候，預設不會讀取 `.env.local`。你需要：
    1.  在 `Dockerfile` 中加入 `ARG VITE_API_KEY` 和 `ENV VITE_API_KEY=$VITE_API_KEY`。
    2.  在 build 指令中加入 `--build-arg VITE_API_KEY=你的Key`。
    3.  **更推薦的做法**: 不要把 Key 打包進 Image。而是在 Cloud Run 的控制台介面中，設定「環境變數」，讓程式在執行時讀取。

**Q4: 為什麼 Firebase 部署後，網址打開是 404 Not Found？**
*   **原因**: `firebase.json` 設定錯誤。
*   **解法**: 確認 `firebase.json` 中有設定 `rewrites`，把所有路徑 (`**`) 都導向 `/index.html`。這是 SPA (單頁應用) 的必要設定。

**Q5: 我想要切換 Firebase 或 Google Cloud 帳號，該怎麼做？**
*   **Firebase**: 執行 `firebase logout` 登出，然後再執行 `firebase login` 登入新帳號。
*   **Google Cloud**: 執行 `gcloud auth revoke --all` 登出，然後再執行 `gcloud auth login` 登入新帳號。

---

希望這份詳解指南能幫助你順利開發！如果有任何問題，歡迎隨時回來查閱。 Falling In Verb 🌸
