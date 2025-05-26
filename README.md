# AI Marketing Hook Generator

An open-source SaaS application built with Next.js 15, Prisma, SQLite/Postgres, NextAuth, and Groq/OpenAI. It lets users generate marketing hooks (SEO copy, CTAs, social posts) from a simple prompt, streams results in real time, stores chat history per user, and enforces a free-tier quota with upgrade to a PRO subscription.

---

## 📦 Project Description

This app allows authenticated users to:

* Write a product or service description and generate:

  * **SEO bundle** (title, meta description, keywords, OG & Twitter tags)
  * **Marketing copy** (CTAs, X/Tweet thread, LinkedIn post, Facebook post, Instagram caption & hashtags)
* View live streaming tokens as the AI generates JSON
* Persist each generation to a **Chat History** sidebar
* Enforce a **FREE**-tier limit (10 generations/24h) and surface usage
* **Upgrade** to PRO for unlimited access via Stripe Checkout + Webhooks
* Rename or delete saved chats
* Copy any generated text to clipboard with toast feedback

---

## 🛠️ Technologies Used

* **Next.js 15** (App Router, Server & Client Components)
* **React** (hooks, streams, transitions)
* **Prisma** ORM with SQLite (dev) or Postgres (prod)
* **NextAuth.js** (JWT strategy, Credentials provider)
* **Groq/OpenAI** API for chat completions (JSON streaming)
* **Stripe** for payments (Checkout, Webhooks)
* **shadcn/ui** for UI primitives (Button, Input, Tabs, Command, ScrollArea, Badge, Tooltip)
* **Lucide-react** icons
* **Tailwind CSS** for styling

---

## 🚀 Setup & Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/zeewaqar/ai-marketing-hook-generator.git
   cd ai-marketing-hook-generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Copy the environment file**

   ```bash
   cp .env.example .env
   ```

4. **Set environment variables** in `.env`:

   ```ini
   DATABASE_PROVIDER=sqlite   # or postgres
   DATABASE_URL=file:./dev.db
   NEXTAUTH_SECRET=your_random_secret
   AI_PROVIDER=groq           # or openai
   GROQ_API_KEY=...           # if using Groq
   OPENAI_API_KEY=...         # if using OpenAI fallback
   STRIPE_SECRET_KEY=...      # for PRO upgrade
   STRIPE_PUBLIC_KEY=...      # load in client (optional)
   STRIPE_WEBHOOK_SECRET=...  # for webhook signature
   ```

5. **Run database migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Folder Structure

```
src/
├─ app/                    # Next.js App Router
│  ├─ layout.tsx           # Root layout (HTML, body)
│  ├─ page.tsx             # Redirect to `/new`
│  └─ (main)/              # Authenticated shell
│     ├─ layout.tsx        # Sidebar + main content layout
│     ├─ new/page.tsx      # New hook generator page
│     ├─ chat/[id]/page.tsx# Chat history detail page
│     └─ billing/          # Billing & upgrade pages
├─ components/             # UI components (Client & Server)
├─ lib/
│  ├─ db.ts                # Prisma client instance
│  └─ authOptions.ts       # NextAuth configuration
├─ prisma/
│  ├─ schema.prisma        # Database schema
│  └─ migrations/          # Migrations folder
├─ public/                 # Static assets
└─ styles/                 # Global CSS (Tailwind)
```

---

## 🎯 Features

* **Real-time streaming** of AI-generated JSON tokens
* **Persistent chat history** per user (rename/delete) in sidebar
* **Free-tier quota** (10/day) with live usage display
* **PRO subscription** for unlimited usage via Stripe
* **Copy-to-clipboard** on any result with toast feedback
* **Server Actions** for chat renaming & deletion
* **Authentication** with NextAuth Credentials (email/password)

---

## 🔒 Security & Auth

* Passwords are hashed with **bcryptjs**
* Sessions use **JWT** strategy with a `NEXTAUTH_SECRET`
* API routes secure user data via `getServerSession` or `getToken`

---

## 🧪 Testing

* **E2E** with Playwright: `npx playwright test`
* **Unit & Integration** with Jest / Testing Library (to be added)

---

## 💳 Billing & Upgrades

* FREE tier: 10 generations per 24h
* PRO tier: unlimited generations via Stripe Checkout
* Billing pages: `/billing` & `/billing/success`

---

## 📈 Next Steps

* Add OAuth providers (Google, GitHub)
* Team/multi-user accounts & roles
* Analytics dashboard for usage metrics
* Browser extension or CLI integration

---

## 📝 License

Open-source under the MIT License.
