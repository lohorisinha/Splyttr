# Splyttr 🧾
[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-splyttr--live.vercel.app-2d6a4f?style=for-the-badge)](https://splyttr-live.vercel.app)
![Status](https://img.shields.io/badge/status-active-52b788?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-1b4332?style=for-the-badge)
&nbsp;
## 📚 | Introduction
> Tired of the "I think I had the pasta?" conversation at the end of every dinner?

- **Splyttr** turns a photo of your receipt into a fully split bill in seconds — no mental math, no spreadsheets, no awkward silences at the end of dinner.
- Instead of splitting the total equally, Splyttr lets you assign **exactly what each person ordered**, down to the item.
- Google Gemini **automatically categorizes** every item (Food, Drinks, Entertainment) so your spending is always organized — without any extra effort.
- Tesseract.js **reads your receipt photo** via OCR, so you never have to type a single item manually.
- Every split is saved to the cloud, with a full **analytics dashboard** showing spending trends, top split partners, and category breakdowns.
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
