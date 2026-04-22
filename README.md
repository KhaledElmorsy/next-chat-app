# 💬 NextChat: Real-Time Messaging Architecture

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Raw_SQL-336791?logo=postgresql)](https://www.postgresql.org/)
[![Pusher](https://img.shields.io/badge/Pusher-WebSockets-purple?logo=pusher)](https://pusher.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-Responsive-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

> A responsive, desktop-grade messaging ecosystem built to demonstrate event-driven real-time architecture, complex state synchronization, and high-performance database querying.

This repository houses a full-stack real-time chat application built on the Next.js App Router. It moves beyond standard CRUD operations to tackle the complexities of live data: **async typing notifications, instant cache invalidation, group chat logic, and read receipts**. Just like my other enterprise-grade projects, it prioritizes end-to-end type safety and deterministic testing infrastructure.

## ✨ Engineering Highlights

This codebase solves several complex UI and architectural challenges inherent to real-time applications:

### 1. Event-Driven Sync & Hybrid Invalidation
* **Real-Time WebSockets:** Integrates `Pusher` for bidirectional communication via authenticated private channels.
* **Server Action Revalidation:** Instead of managing complex global client-side state (like Redux), the app uses a hybrid approach (`Revalidator.tsx`). It listens for Pusher mutation events and triggers Next.js Server Actions (`revalidatePath`) to seamlessly sync the server-rendered React components (like the live sidebar) with the database in real-time.

### 2. Debounced Typing Indicators
* Real-time typing indicators are notoriously noisy and can exhaust WebSocket quotas. Engineered a custom `useSendTyping` hook that utilizes **debounced event triggers**. 
* It intercepts keystrokes, aggregates them, and triggers `client-typing-started` / `client-typing-stopped` events optimally, ensuring a buttery-smooth UI without network spam.

### 3. Raw SQL + Build-Time Type Safety (`PgTyped`)
* Instead of relying on a heavy ORM that abstracts away performance, this app uses raw `.sql` files parsed by `PgTyped`.
* This allowed me to write highly optimized, complex SQL queries—like using `DISTINCT ON` and `ANY()` arrays to efficiently calculate the exact last message and read-receipt status across all active conversations in a single network round-trip.
* `PgTyped` compiles these raw queries into strict TypeScript interfaces, guaranteeing end-to-end type safety at build time.

### 4. Deterministic Database Integration Testing
* Engineered a custom programmatic Docker orchestrator (`PgContainer.ts`) that spins up isolated, ephemeral PostgreSQL containers on dynamic ports for the Vitest test suite.
* This ensures that complex database queries (like resolving group chat memberships and cascading message deletes) are tested against a real Postgres engine without relying on mocked database drivers or flaky local state.

### 5. Desktop-Grade UX & Auth
* **Responsive Split-Pane UI:** Implements a fluid, context-aware layout using Tailwind CSS. It functions as a single-column app on mobile and a desktop-class split-pane view on larger screens.
* **OAuth & Protection:** Utilizes NextAuth.js (v5 Beta) paired with `@auth/pg-adapter` and Google OAuth to secure routes, API endpoints, and WebSocket channel handshakes.

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router, Server Actions)
* **Language:** TypeScript (Strict Mode)
* **Real-Time:** Pusher Server / Pusher-JS
* **Database:** PostgreSQL, `pg` (node-postgres), `@pgtyped/cli`
* **Authentication:** NextAuth.js, Google OAuth
* **Styling:** Tailwind CSS, `clsx`
* **Testing:** Vitest, Docker Compose (Ephemeral DBs)

## 📂 Architecture & Directory Structure

```text
app/
├── (protected)/             # OAuth-secured route group
│   ├── chat/                # Split-pane UI, Dynamic Conversation Views
│   ├── components/          # Reusable UI (Sidebar, MultiUserPicker, Dialogs)
│   └── lib/                 # Server Actions, Pusher Clients, Utility transformers
├── api/                     # NextAuth configuration and Pusher Handshake Auth
├── lib/
│   ├── db/                  # Raw SQL, PgTyped generated interfaces, Connection Pooling
│   │   ├── __tests__/       # Vitest DB Integration suites
│   │   └── test-utils/      # Ephemeral Docker setup and seeding
│   └── validation/          # Zod schemas for user payloads
└── docker/                  # Programmatic Postgres container classes for testing
```

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Yarn
* Docker (Desktop/Engine running locally for DB testing)
* Pusher Account & Google OAuth Credentials

### Local Environment Setup

1. **Clone & Install:**
   ```bash
   git clone <repo-url>
   cd next-chat-app
   yarn install
   ```

2. **Environment Variables:**
   Rename `.env.example` to `.env` and populate it with your Pusher and NextAuth/Google OAuth keys.

3. **Spin up the Development Database:**
   This project uses a custom script to programmatically build and expose a local Postgres database pre-seeded with the project's schemas.
   ```bash
   yarn dev-pg
   ```
   *(Note: This command automatically starts the Next.js dev server alongside the Docker container, and cleans up the container gracefully on exit).*

4. **Watch SQL Queries (Optional):**
   If modifying raw `.sql` files, run PgTyped in watch mode to automatically regenerate TypeScript types.
   ```bash
   yarn pgtyped
   ```

## 🧪 Testing

The testing suite utilizes `Vitest` to test complex SQL logic against a live database.

To run the database integration tests (automatically spins up a temporary Docker container):
```bash
yarn test-queries
```
