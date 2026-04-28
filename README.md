# Splyttr 🧾

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-splyttr--live.vercel.app-2d6a4f?style=for-the-badge)](https://splyttr-live.vercel.app)
![Status](https://img.shields.io/badge/status-active-52b788?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-1b4332?style=for-the-badge)

## An AI-powered receipt splitting app.

&nbsp;

## 📚 | Introduction

- **Splyttr** turns a photo of your receipt into a fully split bill in seconds — no mental math, no spreadsheets, no awkward silences at the end of dinner.
- Instead of splitting the total equally, Splyttr lets you assign **exactly what each person ordered**, down to the item.
- Google Gemini **automatically categorizes** every item (Food, Drinks, Entertainment) so your spending is always organized — without any extra effort.
- Tesseract.js **reads your receipt photo** via OCR, so you never have to type a single item manually.
- Every split is saved to the cloud, with a full **analytics dashboard** showing spending trends, top split partners, and category breakdowns.

&nbsp;

## ✨ | Features

**Core**
- 📸 Upload a receipt photo → OCR extracts every item and price automatically
- 👥 Assign specific items to specific people, or split one item between many
- 💰 Track who paid the bill — everyone sees exactly what they owe
- 💾 All splits saved to the cloud and accessible anytime
- 📄 Export any split as a clean, shareable PDF

**Analytics**
- 🏷️ Every item auto-categorized by Gemini AI — no manual tagging needed
- 📊 Donut, area, bar & radar charts for spending by category and time
- 📅 Monthly trends and day-of-week spending breakdowns
- 🤝 See your most frequent split partners over time
- 🌙 Full dark / light mode across every page

&nbsp;

## 🔄 | How It Works

```mermaid
flowchart LR
    A[📸 Snap\nReceipt] --> B[👀 Review\nItems]
    B --> C[👥 Assign\nto People]
    C --> D[💳 Who\nPaid?]
    D --> E[🧮 Auto\nSplit]
    E --> F[💾 Save\nto Cloud]
    F --> G[📊 Analyze\nSpending]

    style A fill:#1b4332,color:#d8f3dc,stroke:#52b788
    style B fill:#2d6a4f,color:#d8f3dc,stroke:#52b788
    style C fill:#40916c,color:#ffffff,stroke:#52b788
    style D fill:#52b788,color:#1b4332,stroke:#2d6a4f
    style E fill:#74c69d,color:#1b4332,stroke:#2d6a4f
    style F fill:#95d5b2,color:#1b4332,stroke:#2d6a4f
    style G fill:#b7e4c7,color:#1b4332,stroke:#2d6a4f
```

&nbsp;

## 🏗️ | Architecture

```mermaid
graph TD
    U[🌐 User Browser] --> F
    F["🎨 React Frontend\nVercel · Tailwind CSS · Chart.js"] -->|REST API| B
    B["⚙️ Express Backend\nRender.com · Node.js · JWT"] --> DB & AI
    DB["🗄️ MongoDB Atlas\nMongoose ODM"]
    AI["🤖 Google Gemini\nAI Categorization"]

    style U fill:#1b4332,color:#d8f3dc,stroke:#52b788
    style F fill:#2d6a4f,color:#ffffff,stroke:#52b788
    style B fill:#40916c,color:#ffffff,stroke:#74c69d
    style DB fill:#52b788,color:#1b4332,stroke:#2d6a4f
    style AI fill:#74c69d,color:#1b4332,stroke:#2d6a4f
```

&nbsp;

## 🛠️ | Tech Stack

| Layer | Technology |
|---|---|
| 🎨 Frontend | React 18, React Router, Tailwind CSS, Chart.js |
| ⚙️ Backend | Node.js, Express.js |
| 🗄️ Database | MongoDB Atlas (Mongoose) |
| 👁️ OCR | Tesseract.js |
| 🤖 AI | Google Gemini API |
| 🔐 Auth | JWT |
| 🚀 Deployment | Vercel + Render |

&nbsp;

Built with 💚 by **[Lohori Sinha](https://github.com/lohorisinha)**

Open to feedback, collabs, and internship opportunities! &lt;3

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0,1b4332,2d6a4f,52b788&height=220&section=header&text=Splyttr%20🧾&fontSize=72&fontColor=ffffff&fontAlignY=40&desc=Split%20bills,%20not%20friendships.&descAlignY=62&descColor=d8f3dc&animation=fadeIn" width="100%"/>

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-splyttr--live.vercel.app-2d6a4f?style=for-the-badge)](https://splyttr-live.vercel.app)
&nbsp;
![Status](https://img.shields.io/badge/status-active-52b788?style=for-the-badge)
&nbsp;
![License](https://img.shields.io/badge/license-MIT-1b4332?style=for-the-badge)

</div>

---

<div align="center">

## 🌿 What is Splyttr?

</div>

Splyttr is an **AI-powered bill splitting app** that turns a photo of your receipt into a fully calculated split — in seconds. No mental math, no spreadsheets, no awkward silences at the end of dinner.

What makes Splyttr different from just splitting the total equally:

- 🎯 **Item-level precision** — assign exactly what each person ordered, not a rough guess
- 🤖 **AI categorization** — Google Gemini automatically tags every item (Food, Drinks, Entertainment) so your spending is organized without any effort
- 📊 **Spending analytics** — see trends over time, your top split partners, and where your money actually goes
- 🧾 **Receipt OCR** — Tesseract.js reads your receipt photo so you never have to type a single item manually
- 📄 **PDF receipts** — download a clean summary of any split to share with friends

---

<div align="center">

## ✨ Features

</div>

**Core**

- 📸 Upload a receipt photo → OCR extracts every item and price automatically
- 👥 Assign specific items to specific people, or split one item between many
- 💰 Track who actually paid the bill — everyone sees exactly what they owe
- 💾 Every split is saved to the cloud and accessible anytime
- 📄 Export any split as a clean downloadable PDF

**Analytics**

- 🏷️ Every item auto-categorized by Gemini AI — no manual tagging
- 📊 Visual dashboard with donut, area, bar & radar charts
- 📅 Monthly spending trends and day-of-week breakdowns
- 🤝 See your top split partners over time
- 🌙 Full dark / light mode across every page

---

<div align="center">

## 🔄 How It Works

```mermaid
flowchart LR
    A[📸 Snap\nReceipt] --> B[👀 Review\nItems]
    B --> C[👥 Assign\nto People]
    C --> D[💳 Who\nPaid?]
    D --> E[🧮 Auto\nSplit]
    E --> F[💾 Save\nto Cloud]
    F --> G[📊 Analyze\nSpending]

    style A fill:#1b4332,color:#d8f3dc,stroke:#52b788
    style B fill:#2d6a4f,color:#d8f3dc,stroke:#52b788
    style C fill:#40916c,color:#ffffff,stroke:#52b788
    style D fill:#52b788,color:#1b4332,stroke:#2d6a4f
    style E fill:#74c69d,color:#1b4332,stroke:#2d6a4f
    style F fill:#95d5b2,color:#1b4332,stroke:#2d6a4f
    style G fill:#b7e4c7,color:#1b4332,stroke:#2d6a4f
```

</div>

---

<div align="center">

## 🏗️ Architecture

```mermaid
graph TD
    U[🌐 User Browser] --> F

    F["🎨 React Frontend\nVercel · Tailwind CSS · Chart.js"]
    F -->|REST API| B

    B["⚙️ Express Backend\nRender.com · Node.js · JWT Auth"]
    B --> DB
    B --> AI

    DB["🗄️ MongoDB Atlas\nMongoose ODM"]
    AI["🤖 Google Gemini\nAI Categorization"]

    style U fill:#1b4332,color:#d8f3dc,stroke:#52b788
    style F fill:#2d6a4f,color:#ffffff,stroke:#52b788
    style B fill:#40916c,color:#ffffff,stroke:#74c69d
    style DB fill:#52b788,color:#1b4332,stroke:#2d6a4f
    style AI fill:#74c69d,color:#1b4332,stroke:#2d6a4f
```

</div>

---

<div align="center">

## 🛠️ Tech Stack

</div>

- 🎨 **Frontend** — React 18, React Router, Tailwind CSS, Chart.js
- ⚙️ **Backend** — Node.js, Express.js
- 🗄️ **Database** — MongoDB Atlas (Mongoose)
- 👁️ **OCR** — Tesseract.js
- 🤖 **AI** — Google Gemini API
- 🔐 **Auth** — JWT
- 🚀 **Deployment** — Vercel + Render

---

<div align="center">

## 👩‍💻 Author

Built with 💚 by **[Lohori Sinha](https://github.com/lohorisinha)**

Open to feedback, collabs, and internship opportunities &lt;3

<img src="https://capsule-render.vercel.app/api?type=waving&color=0,52b788,2d6a4f,1b4332&height=120&section=footer" width="100%"/>

</div>










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



---

<img src="https://capsule-render.vercel.app/api?type=waving&color=0,2d6a4f,1a3a2a&height=100&section=footer" width="100%"/>

</div>
