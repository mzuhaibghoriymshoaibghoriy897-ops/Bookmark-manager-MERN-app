# 🔖 Linkly — Bookmark Manager (MERN)

A small full-stack app to save links, tag them, mark favorites, search, edit and delete.
**Stack:** Express + MongoDB (Mongoose) + React (Vite) + Axios.

## Features
- Add / edit / delete bookmarks (title, URL, tag)
- Toggle favorite (⭐) and "Favorites only" filter
- Filter by tag (chips with counts, loaded from the API)
- Debounced search by title
- Loading skeletons, empty state, error + retry state
- Toast notifications, dark / light mode (remembered), responsive layout
- Site favicons, "time ago" labels, validation on both client and server

## Folder structure
```
bookmark-app/
├── backend/   (models, controllers, routes, middleware, server.js, .env)
└── frontend/  (src/components, src/hooks, src/services/api.js, App.jsx)
```

## How to run

### Prerequisites
Node.js 18+ and a MongoDB instance (local or Atlas).

### 1) Backend
```bash
cd backend
npm install
cp .env.example .env      # then edit MONGODB_URI if needed
npm run dev               # http://localhost:5000
```

### 2) Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```
In dev, Vite proxies `/api` to `http://localhost:5000`. For production set `VITE_API_URL`.

## API
All responses look like `{ success, data }` (errors: `{ success: false, message }`).

| Method | Route | Purpose |
|--------|-------|---------|
| POST   | `/api/bookmarks` | Create (201, or 400 if invalid) |
| GET    | `/api/bookmarks` | List newest first. Optional: `?tag=react`, `?search=hooks`, `?favorite=true` |
| GET    | `/api/bookmarks/tags` | Tags with counts |
| PUT    | `/api/bookmarks/:id` | Edit a bookmark |
| PATCH  | `/api/bookmarks/:id/favorite` | Toggle `isFavorite` |
| DELETE | `/api/bookmarks/:id` | Delete (404 if not found) |

### Example
```bash
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"title":"React Docs","url":"https://react.dev","tag":"react"}'
```
