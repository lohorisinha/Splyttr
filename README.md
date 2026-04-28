<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0,1a3a2a,2d6a4f&height=200&section=header&text=Splyttr&fontSize=80&fontColor=b7e4c7&fontAlignY=38&desc=Split%20bills,%20not%20friendships.&descAlignY=58&descColor=95d5b2&animation=fadeIn" width="100%"/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-splyttr--live.vercel.app-2d6a4f?style=for-the-badge&logoColor=white)](https://splyttr-live.vercel.app)
![Status](https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-95d5b2?style=for-the-badge)

</div>

---

## 🧾 What is Splyttr?

> Tired of the "I think I had the pasta?" conversation at the end of every dinner?

**Splyttr** turns a photo of your receipt into a fully split bill in seconds. Snap, assign, done.

No mental math. No awkward moments. No more fighting over who had the extra guac.

---

## ✨ Features

### 📸 Core

| Feature | Description |
|---|---|
| **Receipt OCR** | Upload a photo → Splyttr reads every item & price using Tesseract.js |
| **Smart Splitting** | Assign specific items to specific people, or split between multiple |
| **Who Paid Tracking** | Mark who fronted the bill — everyone sees exactly what they owe |
| **Split History** | All splits saved to the cloud, accessible anytime |
| **PDF Export** | Download any split as a clean, shareable PDF |

### 📊 Analytics

| Feature | Description |
|---|---|
| **Auto-categorization** | Gemini AI tags every item (Food, Drinks, Clothing, etc.) |
| **Visual Dashboard** | Donut, area, bar & radar charts for your spending habits |
| **Dark / Light Mode** | Full theme support across every single page |

---

## 🔄 How It Works

```
📸 Snap  ──►  👀 Review  ──►  👥 Assign  ──►  💳 Who Paid  ──►  🧮 Split  ──►  💾 Save  ──►  📊 Analyze
```

```
┌─────────────────────────────────────────────────────────────────┐
│                        SPLYTTR FLOW                             │
├──────────┬──────────┬──────────┬──────────┬──────────┬─────────┤
│  1.SCAN  │ 2.REVIEW │ 3.ASSIGN │ 4.WHOPAID│ 5.SPLIT  │ 6.SAVE  │
│          │          │          │          │          │         │
│ Upload   │ Check    │ Drag &   │ Select   │ App does │ Stored  │
│ receipt  │ items,   │ drop     │ the payer│ the math │ to      │
│ photo →  │ remove   │ items to │ → tracks │ instantly│ MongoDB │
│ OCR runs │ noise    │ people   │ who owes │          │ + AI    │
│          │          │          │ who      │          │ tags it │
└──────────┴──────────┴──────────┴──────────┴──────────┴─────────┘
```

---

## 🏗️ Architecture

```
                        ┌─────────────────┐
                        │   USER BROWSER  │
                        └────────┬────────┘
                                 │ HTTPS
                        ┌────────▼────────┐
                        │  React Frontend │
                        │  Vercel (CDN)   │
                        │  Tailwind CSS   │
                        │  Chart.js       │
                        └────────┬────────┘
                                 │ REST API
                        ┌────────▼────────┐
                        │ Express Backend │
                        │ Render.com      │
                        │ Node.js + JWT   │
                        └──┬─────────┬───┘
                           │         │
              ┌────────────▼──┐  ┌───▼────────────┐
              │ MongoDB Atlas │  │  Google Gemini │
              │  (Database)   │  │   (AI tagging) │
              └───────────────┘  └────────────────┘
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| 🎨 **Frontend** | React 18, React Router, Tailwind CSS, Chart.js |
| ⚙️ **Backend** | Node.js, Express.js |
| 🗄️ **Database** | MongoDB Atlas (Mongoose) |
| 👁️ **OCR** | Tesseract.js |
| 🤖 **AI** | Google Gemini API |
| 🔐 **Auth** | JWT |
| 🚀 **Deployment** | Vercel + Render |

</div>

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/lohorisinha/Splyttr.git
cd Splyttr

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

**Create `server/.env`:**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

**Create `client/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Run backend (from /server)
npm start

# Run frontend (from /client)
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 👩‍💻 Author

<div align="center">

Built with 💚 by **[Lohori Sinha](https://github.com/lohorisinha)**

Open to feedback, collabs, and internship opportunities! &lt;3

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=0,2d6a4f,1a3a2a&height=100&section=footer" width="100%"/>

</div>
