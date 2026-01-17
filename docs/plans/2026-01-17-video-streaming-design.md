# Video Streaming App Design

## Overview

Movies & TV Shows aggregator using TMDB for metadata and vidsrc for playback embeds.

**MVP Features:**
- Search & Browse (genres, trending, popular)
- User accounts (server-side auth with Firebase Admin)
- Video player (iframe embed + custom UI chrome)
- Recommendations (TMDB similar + user behavior signals)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Tanstack Router, BaseUI, tv() |
| API | Hono on Vercel serverless |
| Auth | Firebase Admin SDK, HTTP-only session cookies |
| Data | TMDB (metadata), Firestore (user data) |
| Styling | Tailwind v4, design tokens |

---

## Monorepo Structure

```
miko/
├── src/
│   ├── features/
│   │   ├── auth/           # Login, profile, session
│   │   ├── browse/         # Search, genres, trending
│   │   ├── library/        # Watchlist, continue watching
│   │   ├── stream/         # Video player, embeds
│   │   └── recommend/      # Similar content, personalized picks
│   ├── routes/             # Tanstack file-based routes
│   ├── styles/             # Design tokens
│   └── ui/                 # Shared components
├── server/
│   ├── routes/             # API endpoints
│   ├── middleware/         # Session validation
│   └── lib/                # Firebase, TMDB clients
└── packages/               # Added only when needed (3+ usages)
```

---

## API Design

### Routes

| Endpoint | Purpose |
|----------|---------|
| `GET /api/tmdb/:type/:endpoint` | Proxy TMDB requests (hides API key) |
| `POST /api/auth/login` | Create session from ID token |
| `GET /api/auth/me` | Get current user |
| `POST /api/auth/logout` | Clear session |
| `GET /api/user/library` | Get watchlist + continue watching |
| `POST /api/user/library` | Add/update library item |
| `DELETE /api/user/library/:id` | Remove from library |
| `GET /api/recommend/:mediaType/:mediaId` | Get recommendations |

### User Data Model (Firestore)

```typescript
// users/{uid}/library/{mediaId}
type LibraryItem = {
  mediaId: string;
  mediaType: "movie" | "tv";
  status: "watchlist" | "watching" | "completed";
  progress?: {
    season?: number;
    episode?: number;
    timestamp: number;
  };
  addedAt: Timestamp;
  updatedAt: Timestamp;
};
```

---

## Auth Flow (Server-Side)

1. Client gets ID token via Google Identity Services or Firebase REST API
2. `POST /api/auth/login` with ID token
3. Server creates session cookie via `adminAuth.createSessionCookie()`
4. HTTP-only cookie sent with all subsequent requests
5. Session middleware validates cookie on protected routes

```typescript
// server/routes/auth.ts
app.post("/auth/login", async (c) => {
  const { idToken } = await c.req.json();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

  setCookie(c, "session", sessionCookie, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: expiresIn / 1000,
  });

  return c.json({ ok: true });
});

// server/middleware/session.ts
export const sessionMiddleware = async (c, next) => {
  const session = getCookie(c, "session");
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const decoded = await adminAuth.verifySessionCookie(session, true);
  c.set("uid", decoded.uid);
  await next();
};
```

---

## Video Player

### Hybrid Approach

Iframe owns playback; custom UI provides chrome and navigation.

```
┌─────────────────────────────────────────┐
│  Title: Breaking Bad S1E1      [✕] [⛶] │  ← Custom header
├─────────────────────────────────────────┤
│                                         │
│         vidsrc iframe (100%)            │  ← Embed controls playback
│                                         │
├─────────────────────────────────────────┤
│  ◀ Prev   [Episodes ▾]   Next ▶         │  ← Custom navigation
└─────────────────────────────────────────┘
```

### What We Control
- Fullscreen (Fullscreen API on container)
- Episode navigation
- UI chrome (title, back button)
- Watch progress tracking (time-based estimation)

### What Iframe Owns
- Play/pause, seeking, volume
- Quality selection
- Subtitles

### Embed URLs

```typescript
// src/features/stream/stream-lib.ts
export const streamer = {
  url: {
    movie: (id: string) => `https://vidsrc.xyz/embed/movie/${id}`,
    series: (id: string, season: number, episode: number) =>
      `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`,
  },
};
```

---

## Browse & Search

### Routes

```
src/routes/
├── index.tsx                    # Home - trending, continue watching
├── search.tsx                   # Search results
├── movie/$id.tsx                # Movie detail + player
├── tv/$id.tsx                   # Show detail (seasons overview)
├── tv/$id.$season.$episode.tsx  # Episode player
├── browse/movies.tsx            # All movies (filterable)
├── browse/tv.tsx                # All TV shows (filterable)
└── library.tsx                  # User's watchlist + history
```

### Home Page Sections

| Section | TMDB Endpoint |
|---------|---------------|
| Continue Watching | Firestore (local) |
| Trending Today | `/trending/all/day` |
| Popular Movies | `/movie/popular` |
| Top Rated TV | `/tv/top_rated` |
| By Genre | `/discover/movie?with_genres={id}` |

### Search
- Debounce 300ms
- `/search/multi` endpoint
- Filter tabs: All / Movies / TV Shows

---

## Recommendations

### Sources

1. **TMDB Similar** - `/movie/{id}/recommendations`
2. **User History** - Extract genres from watched items
3. **Trending** - Fallback for cold start

### Scoring

```typescript
function calculateScore(item, userGenres: number[]) {
  let score = item.vote_average;

  const genreOverlap = item.genre_ids.filter(g => userGenres.includes(g));
  score += genreOverlap.length * 0.5;

  const year = new Date(item.release_date).getFullYear();
  if (year >= 2023) score += 0.3;

  return score;
}
```

---

## UI Components

### Design Tokens

```css
/* src/styles/theme.css */
@theme {
  --color-surface: #0a0a0a;
  --color-surface-raised: #141414;
  --color-accent: #e50914;
  --color-accent-hover: #f40612;
  --color-primary: #ffffff;
  --color-muted: #808080;

  --radius-card: 0.5rem;
  --radius-button: 0.25rem;
}
```

### Usage

```tsx
<div className="bg-surface text-primary">
  <button className="bg-accent hover:bg-accent-hover rounded-button">
    Watch Now
  </button>
  <p className="text-muted">Released 2024</p>
</div>
```

### Tailwind Variants

```typescript
import { tv } from "tailwind-variants";

const button = tv({
  base: "inline-flex items-center justify-center font-medium transition-colors",
  variants: {
    variant: {
      primary: "bg-accent text-primary hover:bg-accent-hover",
      secondary: "bg-surface-raised text-primary",
      ghost: "bg-transparent hover:bg-surface-raised",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
```

### Shared Components

```
src/ui/
├── Button.tsx
├── Card.tsx
├── Dialog.tsx
├── Input.tsx
├── Tabs.tsx
├── Menu.tsx
└── Skeleton.tsx
```

---

## File Checklist

### Frontend

```
src/features/auth/
├── components/AuthGuard.tsx
├── components/LoginForm.tsx
├── components/UserMenu.tsx
└── hooks/useAuth.ts

src/features/browse/
├── components/MediaCard.tsx
├── components/MediaGrid.tsx
├── components/MediaRow.tsx
├── components/SearchInput.tsx
└── hooks/useTmdb.ts

src/features/library/
├── components/WatchlistButton.tsx
├── components/ContinueWatching.tsx
├── hooks/useLibrary.ts
└── hooks/useLibraryMutation.ts

src/features/stream/
├── components/Player.tsx
├── components/PlayerHeader.tsx
├── components/EpisodeSelector.tsx
└── hooks/useWatchProgress.ts

src/features/recommend/
├── components/SimilarRow.tsx
└── hooks/useRecommendations.ts
```

### Backend

```
server/routes/
├── auth.ts
├── tmdb.ts
├── user.ts
└── recommend.ts

server/middleware/
└── session.ts

server/lib/
├── firebase.ts (existing)
├── tmdb.ts
└── session.ts
```

---

## Dependencies to Add

```bash
pnpm add tailwind-variants
pnpm add @tanstack/react-query
```
