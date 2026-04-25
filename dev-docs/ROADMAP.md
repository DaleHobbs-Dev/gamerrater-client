<!-- Last updated: 2026-04-25 -->
<!-- Last change: Insert reviewing step before search/filter; add sub-steps to both; remove duplicate ratings step -->

# GamerRater Client - Implementation Roadmap

Generated from: dev-docs/PRD.md

## Steps

- [x] **Step 1: Migrate Login and Register to the UI library**
  The Login and Register pages currently use legacy CSS and raw HTML elements.
  Replace them with components from `src/components/ui/` so the whole app uses
  a consistent visual style. No new functionality -- this is a cleanup step that
  sets a clean baseline for everything that follows.

- [x] **Step 2: Set up user context with the /me endpoint**
  Create a React context (`UserContext`) that fetches `/me` after login and
  stores the current user object (including `is_staff`) app-wide. Components
  will read from this context instead of checking localStorage directly. This
  is foundational: logout, admin-only UI, and category management all depend
  on having the current user accessible throughout the app.

  **User Stories:**

  - As a logged-in player, I want the app to know who I am so that I see
    content and controls appropriate for my account.

- [x] **Step 3: Add logout**
  Add a logout button to the NavBar. On click, clear the token from
  localStorage, clear the user context, and redirect to `/login`. This
  completes the full auth lifecycle (register, login, logout) and depends on
  the user context from step 2.

  **User Stories:**

  - As a player, I want to log out so that my session ends and my account
    is no longer accessible on this device.

- [ ] **Step 4: Add ratings, reviews, and review form**
  When a player views a game, they can submit a numeric rating (1-10) and a
  written review. A "Review Game" button on the GameDetail page links to
  `/games/:id/review`, which renders a `ReviewForm` component. On submit, the
  form POSTs to the `gameratings` endpoint. After saving, the player is
  redirected back to the game. Existing reviews are displayed below the game
  details on the GameDetail page.

  **API:**
  - `POST /gameratings` with `{ game, rating, review }` to create a rating and review
  - `GET /gameratings?game=<id>` to fetch all ratings and reviews for a game

  **Example POST body:**

  ```json
  {
    "game": 6,
    "rating": 9,
    "review": "One of the most elegant games I have ever played. Easy to learn but deeply strategic."
  }
  ```

  **Sub-steps:**
  1. Add `ratingService.js` with `createRating(data)` and `getGameRatings(gameId)`
  2. Build `ReviewForm` component at `src/components/games/ReviewForm.jsx` with a
     rating input (1-10) and a review textarea
  3. Add the `/games/:id/review` route to `ApplicationViews`
  4. Update `GameDetail` to show a "Review Game" button and display the list of
     reviews below the game details

  **User Stories:**

  - As a player, I want to rate a game I have played so that others can see
    how I feel about it.
  - As a player, I want to write a review of a game so that I can share my
    experience in more detail.
  - As a player, I want to read other players' reviews of a game so that I
    can decide if I want to play it.

- [ ] **Step 5: Add search, category filter, and sort to GameList**
  Add a filter bar above the game grid on `/games`. Players can type a search
  term, pick a category, and choose a sort order (year released). These values
  are sent to the backend as query parameters (`?search=&category=&sort=`)
  rather than filtering the local array. Update `gameService.getGames()` to
  accept an options object and append query params to the request URL.

  **Sub-steps:**
  1. Update `gameService.getGames()` to accept a `params` object and build a
     query string using the browser's built-in `URLSearchParams`. Only include
     params that have a value so the URL stays clean.
  2. Add two filter states to `GameList`: `searchText` (the controlled input
     value) and `filters` (an object `{ search, category, sort }` that actually
     drives the fetch). These are separate so search only fires on submit, not
     on every keystroke.
  3. Fetch categories on mount (separate `useEffect` with `[]` dependency) to
     populate the category dropdown.
  4. Update the games `useEffect` to depend on `[filters]` so it re-fetches
     when filters change, and reset `currentPage` to 1 on each change.
  5. Add the filter bar UI above the game grid using `Input`, `Select`, and
     `Button` components.

  **User Stories:**

  - As a player, I want to search for a game by name so that I can find it
    quickly without scrolling through the full list.
  - As a player, I want to filter games by category so that I can browse games
    in a genre I enjoy.
  - As a player, I want to sort games by year released so that I can find
    newer or older games.

- [ ] **Step 6: Switch GameList to backend-driven pagination**
  Replace the current client-side pagination (local array slicing) with backend
  pagination. Django will return a paginated response (e.g. `{count, results}`)
  and the client will send a `page` query parameter. The `Pagination` component
  stays, but it is now driven by the API response instead of a local slice.
  This builds directly on step 5 since query params are already in place.

  **User Stories:**

  - As a player, I want the games list to load quickly even as the catalog
    grows, without the app fetching every game at once.

- [ ] **Step 7: Add average rating display**
  Show the average rating for each game on both the GameDetail page and the
  GameList cards. The backend computes this as a custom model property and
  includes it in the game response. This step depends on step 4 so that
  there is real rating data to display.

  **User Stories:**

  - As a player, I want to see the average rating for a game at a glance so
    that I can quickly gauge how well-regarded it is.

- [ ] **Step 8: Add picture upload to GameForm**
  Add a picture section to the game create and edit form. Players can attach
  a picture by entering an image URL or by uploading an image file from their
  device. Uploaded files are sent to the backend via a multipart form request
  and stored in Django's `/static` directory. This step introduces a different
  request type than the JSON-based requests used everywhere else.

  **User Stories:**

  - As a player, I want to add a picture to a game I registered so that
    others can see what the game looks like.
  - As a player, I want to upload a photo I took of the game rather than
    finding a URL, so that I can use my own images.

- [ ] **Step 9: Build category management pages**
  Add pages for creating and editing categories, accessible only to players
  where `is_staff` is true. Add the routes to `ApplicationViews`, protect
  them with an admin check using the user context from step 2, and add nav
  links visible only to admin users. Add `createCategory` and `updateCategory`
  functions to `categoryService.js`.

  **User Stories:**

  - As an admin, I want to add new categories so that players can assign
    their games to genres that do not exist yet.
  - As an admin, I want to edit a category name so that I can correct or
    improve existing category labels.
