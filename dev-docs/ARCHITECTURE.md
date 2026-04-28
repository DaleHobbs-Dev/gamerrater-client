<!-- Last updated: 2026-04-27 -->
<!-- Last change: Update API table, current state, and target state to reflect steps 1-5 complete -->

# GamerRater Client - Technical Architecture

## System Overview

GamerRater is a single-page React application that communicates with a Django
REST API backend (separate repository). Users register and log in to get an
auth token, then use that token to browse, add, and rate board/card games.

The client is responsible for rendering the UI, managing local state, and
making authenticated requests to the backend. All business logic and data
validation lives in Django.

---

## Codebase Map

```text
src/
  main.jsx                  App entry point
  index.css                 Global styles (Tailwind base)

  components/
    ApplicationViews.jsx    Router and full route tree
    Authorized.jsx          Auth guard + layout shell (NavBar, Outlet, Footer)
    Navbar.jsx              Top navigation bar
    Footer.jsx              Footer

    games/
      GameList.jsx          Browse all games with client-side pagination
      GameDetail.jsx        Single game view, conditional edit button via is_owner
      GameForm.jsx          Dual-mode create/edit form (mode detected via URL param)

    ui/
      index.js              Barrel export for all UI components
      Alert, Badge, Button, Card, Container, FormField,
      Grid, Input, LoadingPage, PageHeader, Pagination,
      Select, Spinner, Table, Textarea

  pages/
    Home.jsx                Landing page for authenticated users
    Login.jsx               Login form (legacy CSS, not yet on UI library)
    Register.jsx            Register form (legacy CSS, not yet on UI library)

  services/
    api.config.js           Base fetch helpers + auth header injection
    gameService.js          Game CRUD functions
    categoryService.js      Category fetch
    index.js                Re-exports from api.config
```

---

## Entry Points

`main.jsx` renders `ApplicationViews` inside React StrictMode.

`ApplicationViews` declares the full route tree. Login and Register are outside
the `Authorized` wrapper and are always accessible. All other routes are wrapped
in `Authorized`, which checks for a token in localStorage and redirects to
`/login` if none is found.

Request flow for a protected page:

```text
Browser loads /games
  → ApplicationViews renders route tree
  → Authorized checks localStorage for token
    → No token: redirect to /login
    → Token present: render NavBar + GameList + Footer
      → GameList calls getGames()
        → getGames calls fetchJSON("games")
          → fetchJSON attaches Authorization header from localStorage
          → Django returns game list as JSON
        → GameList sets state and renders cards
```

---

## Component Breakdown

| Component         | Role                                                              |
|-------------------|-------------------------------------------------------------------|
| ApplicationViews  | Declares all routes                                               |
| Authorized        | Token check gate + layout shell                                   |
| GameList          | Fetches all games, paginates client-side, renders a card grid     |
| GameDetail        | Fetches single game, shows edit button only if `is_owner` is true |
| GameForm          | Create and edit in one component, mode set by presence of `:id`   |
| UI library        | Shared, styled primitives used across all game components         |

`GameForm` detects its mode with `const isEditMode = Boolean(useParams().id)`.
In edit mode it fetches the existing game and pre-fills the form. In create mode
it starts with empty state. Both submit to the same handler with a ternary.

---

## Data Model

See [ERD.dbml](ERD.dbml) for the full schema.

Key things to understand from the client's perspective:

- `GameRatings` holds both the numeric rating AND the review text. They are not
  separate tables. One row per player per game (enforced by a unique index).
- `GamePictures` handles both URL-based and file-uploaded images. When a file is
  uploaded, Django stores it in `/static` and saves that path in the `url` field.
  The client never needs to distinguish between the two after saving.
- `is_owner` is not a column. The backend computes it as a custom property when
  serializing a game, comparing the requesting player to `created_by_player_id`.

---

## API Design

### Currently Used

| Method | Endpoint              | Purpose                              |
|--------|-----------------------|--------------------------------------|
| POST   | /login                | Auth, returns token                  |
| GET    | /me                   | Fetch current user profile           |
| GET    | /games                | Fetch all games                      |
| GET    | /games/:id            | Fetch single game                    |
| POST   | /games                | Create a game                        |
| PATCH  | /games/:id            | Update a game                        |
| GET    | /categories           | Fetch all categories                 |
| GET    | /gameratings?game=:id | Fetch all ratings/reviews for a game |
| POST   | /gameratings          | Submit a rating and review           |
| GET    | /gamepictures?game=:id| Fetch all action pictures for a game |
| POST   | /gamepictures         | Upload an action picture (base64)    |
| DELETE | /gamepictures/:id     | Delete an action picture             |

### Planned

| Method | Endpoint                       | Purpose                          |
|--------|--------------------------------|----------------------------------|
| GET    | /games?search=&category=&sort= | Filtered/sorted game list        |
| POST   | /categories                    | Create category (admin only)     |
| PATCH  | /categories/:id                | Update category (admin only)     |
| GET    | /players/:id                   | Fetch public profile for a player|

All requests attach an `Authorization: Token <token>` header, read from
localStorage via `getAuthHeader()` in `api.config.js`.

---

## Infrastructure and Deployment

- **Frontend dev:** `npm run dev` via Vite (default port 5173)
- **Backend dev:** Django `runserver` at `http://localhost:8000`
- `API_BASE_URL` is hardcoded to `http://localhost:8000/` in `api.config.js`
- No production deployment configured yet

---

## Key Technical Decisions

- **Token stored in localStorage:** simple and works for a bootcamp project.
  Not suitable for production (XSS risk), but acceptable here.
- **Services layer:** API calls are isolated in `src/services/` rather than
  written inline in components. This keeps components focused on rendering.
- **Shared UI library:** all game views use components from `src/components/ui/`
  for visual consistency without repeating Tailwind class strings everywhere.
- **Dual-mode GameForm:** one component handles both create and edit instead of
  two separate components. The trade-off is slightly more conditional logic in
  exchange for one less file to maintain.
- **Backend-driven filtering:** search, category filter, and sort will be sent
  as query parameters to Django rather than filtering on the client. This is
  more realistic and avoids loading all games just to filter locally.

---

## Current State (What Is Built)

- Auth: Login, Register, Logout -- full auth lifecycle complete
- `Authorized` route guard with NavBar/Footer layout shell
- User context (`UserContext`) with `/me` integration -- `is_staff` available app-wide
- Full game CRUD: list, detail, create, edit
- Average rating and current user's rating displayed on GameList cards and GameDetail
- Ratings and reviews: `ReviewForm` at `/games/:id/review`, review list on `GameDetail`
- Action picture gallery on `GameDetail`: upload (base64), thumbnail grid, full preview modal, delete with confirmation (owner or admin only)
- Placeholder `PlayerDetail` component and `/player/:id` route
- Shared UI component library (16 components, including `Modal`)
- Services layer: `gameService`, `categoryService`, `ratingService`, `pictureService`

---

## Target State (What Still Needs Building)

Listed roughly in dependency order:

1. Add search, category filter, and sort to GameList (query params)
2. Switch GameList to backend-driven pagination
3. Add picture upload to GameForm (game's main image, URL or file)
4. Build player profile page -- requires `GET /players/:id` backend endpoint
5. Add category management pages (create/edit), protected for admin users

---

## Project Conventions

- Components use named exports (`export const GameList = ...`)
- All API calls go through the helpers in `services/api.config.js`
- UI primitives come from `src/components/ui/` -- do not write one-off styled
  elements in component files when a UI component already covers it
- Styling is Tailwind v4 utility classes (Login and Register are exceptions
  pending migration)
- New service functions follow the pattern in `gameService.js`:
  thin wrappers that call `fetchJSON`, `postJSON`, or `patchJSON`

---

## Admin Protection

A `GET /me` request returns the current user's profile including `is_staff`:

```json
{
  "id": 4,
  "username": "erin_telfer@example.com",
  "first_name": "Erin",
  "last_name": "Telfer",
  "is_staff": false
}
```

The client will fetch `/me` after login and make the result available
application-wide (likely via React context). Components that need to show or
hide admin-only UI (category management nav links, protected routes) will read
`is_staff` from that context.

The backend enforces permissions server-side regardless. The client check is
only for hiding UI -- a 403 from the backend is the real enforcement.

## Pagination

GameList currently paginates client-side by slicing a local array. Once
backend filtering is added, this will move to backend pagination. Django will
return a paginated response (e.g. `{count, results}`) and the client will pass
`page` as a query parameter. The `Pagination` component stays; the local slice
logic is replaced by re-fetching when the page changes.
