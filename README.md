# Layr เลเยอร์ 🧱

**Build your life, layer by layer.**

Layr is a modular personal growth platform designed to help you build a strong foundation across every dimension of your life. Start with the layers that matter most to you — and stack more as you grow.

## 🧱 The Layer Philosophy

Life isn't one-dimensional. Layr lets you build and track progress across multiple **layers** of personal development:

| Layer | What it covers |
|-------|---------------|
| 💰 **Financial** | Expense tracking, budgets, income/spending analysis, bank statement import |
| 📚 **Knowledge & Skills** | Learning goals, skill tracking, course progress *(coming soon)* |
| 💪 **Health** | Fitness, nutrition, wellness habits *(coming soon)* |
| 🤝 **Relationships** | Connections, networking, social health *(coming soon)* |
| ➕ **Custom Layers** | Add whatever matters to you *(coming soon)* |

> Start with **Financial** — the first layer. More layers are on the way.

## ✨ Features (Financial Layer)

- **📊 Interactive Dashboard**
  - Financial overview: income vs. expenses over the last 6 months
  - Spending analysis: category-based pie chart with custom icons
  - Calendar view: daily income, expenses, and net balance

- **💰 Transaction Management**
  - Add, edit, and delete income/expense transactions
  - Custom categories with icons and colors
  - Link transactions to accounts (Bank, Cash, Wallet, etc.)

- **📂 Statement Import**
  - Import bank statements (PDF/CSV) to auto-populate transactions
  - AI-powered parsing with Google Gemini
  - Demo mode for testing with realistic data

- **🌐 Multi-language**
  - English & Thai (ไทย) with Kanit font support
  - Expandable i18n architecture

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Components | [Lucide React](https://lucide.dev/) icons |
| State | [Zustand](https://github.com/pmndrs/zustand) |
| Data Fetching | [TanStack Query](https://tanstack.com/query/latest) |
| Charts | [Recharts](https://recharts.org/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Backend/Auth | [Supabase](https://supabase.com/) |
| AI | [Google Gemini](https://ai.google.dev/) (statement parsing) |
| PDF Parsing | `pdfjs-dist` |

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm, yarn, or pnpm

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Gemini API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see Layr.

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.
