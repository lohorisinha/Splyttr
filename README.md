# Splyttr 🧾
> Split bills, not friendships.

![Status](https://img.shields.io/badge/status-active-brightgreen) ![Stack](https://img.shields.io/badge/stack-React%20%2B%20Node.js%20%2B%20MongoDB-blue) ![License](https://img.shields.io/badge/license-MIT-green)

**Live Demo → [splyttr-orcin.vercel.app](https://splyttr-orcin.vercel.app)**

---

## What is Splyttr?

Splyttr makes splitting bills effortless. Instead of manually entering every item, just photograph a receipt — Splyttr reads it, lets you assign items to people, and calculates everyone's share instantly.

No more "I think I had the pasta?" arguments. Just scan, assign, done.

---

## Features

### Core
- 📸 **Receipt OCR** — Upload a photo and Splyttr extracts all items and prices automatically using Tesseract.js
- 👥 **Flexible splitting** — Assign specific items to specific people, or split items between multiple people
- 💰 **Who paid tracking** — Specify who actually footed the bill, so everyone knows exactly what they owe
- 💾 **Split history** — All your splits saved to the cloud, accessible anytime
- 📄 **PDF export** — Download any split as a clean PDF receipt

### Analytics
- 🏷️ **Auto-categorization** — Every item is automatically categorized (Food, Drinks, Clothing, etc.)
- 📊 **Visual dashboard** — Donut chart, area chart, bar charts, and radar chart showing spending by category, monthly trends, top split partners, and spending by day of week
- 🌙 **Dark / Light mode** — Full theme support across every page

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router, Tailwind CSS, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| OCR | Tesseract.js |
| AI | Google Gemini API |
| Auth | JWT |
| Deployment | Vercel + Railway |

---

## How It Works
```
📸 Scan → 👀 Review → 👥 Assign → 💳 Who Paid → 🧮 Split → 💾 Save → 📊 Analyze
```

1. **Scan** — Upload a receipt photo → Tesseract.js reads the text → parser extracts item names and prices
2. **Review** — Review extracted items, uncheck anything irrelevant
3. **Assign** — Add people and assign each item to whoever ordered it
4. **Who Paid** — Select who paid the full bill
5. **Split** — App calculates each person's exact share
6. **Save** — Split saved to MongoDB, Gemini API categorizes each item
7. **Analyze** — Analytics page shows spending charts and trends

---

## Author

Built by [Lohori Sinha](https://github.com/lohorisinha) — open to feedback, collabs, and internship opportunities <3