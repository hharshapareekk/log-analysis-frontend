# Vulnuris Unified Log RCA Platform (Student Edition)

Frontend template for the BE Project 2025 — Unified Incident Log Analysis & RCA Platform.

> Built for educational use; not a production IR tool.

---

## Setup & Run

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
  app/
    layout.tsx          ← Root layout (sidebar + main area)
    page.tsx            ← Redirects / → /dashboard
    dashboard/page.tsx  ← Overview metrics, source breakdown, recent events
    ingest/page.tsx     ← File upload, bundle metadata, parser log
    timeline/page.tsx   ← Filterable chronological event list
    graph/page.tsx      ← Event graph (DAG), edge table with confidence
    inspector/page.tsx  ← CES normalized fields + raw event view
    rca/page.tsx        ← Full RCA report with export buttons
  components/
    Sidebar.tsx         ← Navigation sidebar
  styles/
    globals.css         ← All design tokens and component styles
```

---

## Wiring in Your Backend

Every page has `TODO` comments where API calls should be added.

| Page | API Endpoint |
|------|-------------|
| Ingest | `POST /ingest` |
| Timeline | `GET /timeline?bundle_id=...` |
| Graph | `GET /graph?bundle_id=...` |
| RCA Report (export) | `POST /report` |
| Inspector | `GET /events/:id` |

Replace the static mock data arrays at the top of each page file with `fetch()` calls to your FastAPI backend.

---

## Tech Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **IBM Plex Mono / Sans** (Google Fonts)
- No UI library — pure CSS with custom design tokens in `globals.css`

---

## Team Members
| Name | Role |
|------|------|
| ...  | ...  |

Contact: [your email]
