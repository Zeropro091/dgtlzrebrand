<div align="center">

# ⚡ DGTLZ Remake & Command Deck Ecosystem

**System Architecture & Environment Synchronization Specification**

[![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

</div>

---

## 📐 1. System Overview & Architecture

Repository ini berisi **DGT.LZ Digital Brutalism Web Application** beserta **DGTLZ Command Deck Server** (Internal Ops API, Auth, PayGate Gateway, & Content CMS).

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT BROWSER                       │
│        React 19 + Vite 6 (Port 3000)                   │
└───────────────────────────┬────────────────────────────┘
                            │
              Vite Proxy (/api -> :4000)
                            │
┌───────────────────────────▼────────────────────────────┐
│              DGTLZ COMMAND DECK API                    │
│      Node.js Express + JSON Storage Engine (Port 4000) │
└───────────────────────────┬────────────────────────────┘
                            │
                 ┌──────────┴──────────┐
                 │ Data Auto-Creation  │
                 │  server/data/       │
                 │  ├── db.json        │
                 │  └── secret.key     │
                 └─────────────────────┘
```

---

## 🛠️ 2. Environment Prerequisites

Pastikan runtime & environment server Anda memenuhi requirement berikut:

| Resource | Minimum Requirement | Recommended |
| :--- | :--- | :--- |
| **Node.js** | `v20.0.0+` | `v22.x LTS` |
| **npm** | `v10.0.0+` | `v10.x` |
| **Process Manager** | Native CLI / PM2 | `PM2` (Production Server) |
| **Network Ports** | `3000` (Frontend), `4000` (Backend API) | Custom via `.env` |

---

## ⚙️ 3. Environment Variables Configuration

Copy file `.env.example` ke `.env` di root directory:

```bash
cp .env.example .env
```

### 📄 `.env` Schema Reference

```env
# -----------------------------------------------------------------------------
# Frontend & AI Services
# -----------------------------------------------------------------------------
# Required for Gemini AI API calls & Assistant features
GEMINI_API_KEY="your_gemini_api_key_here"

# Canonical URL of the application (Used for self-referential links & callbacks)
APP_URL="http://localhost:3000"

# Set true in production / CI to disable HMR & file watching
DISABLE_HMR="false"

# -----------------------------------------------------------------------------
# Backend Command Deck API (Express Server)
# -----------------------------------------------------------------------------
# Port for the Node.js backend server (default: 4000)
PORT="4000"
```

---

## 🚀 4. Local Development Environment Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Running Services

#### **Option A: Single Command (Frontend + Backend concurrently)**
```bash
npm run dev:all
```
* Menjalankan Express API pada `http://localhost:4000` dan Vite Dev Server pada `http://localhost:3000` (dengan proxy `/api` otomatis terhubung).

#### **Option B: Independent Service Run**
* **Backend API Server Only:**
  ```bash
  npm run server
  ```
* **Frontend Vite App Only:**
  ```bash
  npm run dev
  ```

---

## 🛡️ 5. Production & Server Environment Synchronization

### Security Notice: Runtime Data Isolation
Folder `server/data/` secara otomatis di-exclude dari Git repository (`.gitignore`) untuk mencegah kebocoran data sensitif (password hash, secret signing keys, file upload).

Saat baru pertama kali men-deploy ke server baru:
1. Express Server akan **otomatis membuat directory `server/data/`**.
2. File `server/data/secret.key` akan **otomatis di-generate** secara acak (Cryptographic 32-byte key) untuk signature HMAC token.
3. Database `server/data/db.json` akan **otomatis di-seed** dengan skema bawaan saat server pertama kali dinyalakan.

### Deploy dengan PM2 (Production Daemon)

```bash
# 1. Build Static Asset Frontend
npm run build

# 2. Start Backend API Daemon
pm2 start server/index.mjs --name "dgtlz-backend" --watch --ignore-watch="server/data server.log"

# 3. Serve Frontend Build via Nginx/Caddy atau Vite Preview
npm run preview
```

### Nginx Reverse Proxy Configuration Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend Static App
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Command Deck API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

---

## 🗂️ 6. Repository Project Structure

```
dgt-remake/
├── .agents/             # Agent & Tooling Skill specifications
├── .claude/             # Claude Agent Skill definitions
├── docs/                # Architecture specifications & Brand manuals
├── public/              # Static public assets (Favicons, Posters, Stickers)
├── scripts/             # Visual build & verification scripts (TS/MJS/Python)
├── server/              # DGTLZ Command Deck Backend
│   ├── index.mjs        # Express API Server (Auth, Gateway, CMS Engine)
│   └── data/            # [Git Ignored] Auto-created runtime DB & secret keys
├── src/                 # React 19 Frontend Codebase
│   ├── components/      # UI Components (Brutalist cards, Modals, Nav)
│   ├── pages/           # Application views (Dashboard, Route, PayGate, etc)
│   ├── App.tsx          # Main App Router & layout
│   └── index.css        # Tailwind v4 & custom brutalist animations
├── .env.example         # Environment template
├── package.json         # Package configuration & scripts
├── README.md            # Environment & Setup documentation
└── vite.config.ts       # Vite build & proxy settings (with HMR watch exclusions)
```

---

## ⚡ 7. Troubleshooting & Maintenance

* **Dashboard Auto-Refresh Loop:** Vite dev server telah dikonfigurasi di `vite.config.ts` untuk mengabaikan perubahan di folder `server/` dan `server.log`. Jika halaman me-refresh terus saat ada penulisan data, pastikan `DISABLE_HMR=true` atau rule `watch.ignored` aktif.
* **PORT Conflict:** Port `3000` (Vite) dan `4000` (Express) dapat diubah melalui variabel lingkungan `PORT` di `.env` atau parameter `--port` pada `package.json`.

---

<div align="center">
  <sub>Engineered by <b>DGT.LZ Infrastructure</b> — Modern Digital Brutalism Platform</sub>
</div>
