<!-- Last updated: 2026-04-21 -->
<!-- Last change: Initial roadmap creation -->

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

- [ ] **Step 4: Add search, category filter, and sort to GameList**
  Add a filter bar above the game grid on `/games`. Players can type a search
  term, pick a category, and choose a sort order (year released). These values
  are sent to the backend as query parameters (`?search=&category=&sort=`)
  rather than filtering the local array. Update `gameService.getGames()` to
  accept an options object and append query params to the request URL.

  **User Stories:**

  - As a player, I want to search for a game by name so that I can find it
    quickly without scrolling through the full list.
  - As a player, I want to filter games by category so that I can browse games
    in a genre I enjoy.
  - As a player, I want to sort games by year released so that I can find
    newer or older games.

- [ ] **Step 5: Switch GameList to backend-driven pagination**
  Replace the current client-side pagination (local array slicing) with backend
  pagination. Django will return a paginated response (e.g. `{count, results}`)
  and the client will send a `page` query parameter. The `Pagination` component
  stays, but it is now driven by the API response instead of a local slice.
  This builds directly on step 4 since query params are already in place.

  **User Stories:**

  - As a player, I want the games list to load quickly even as the catalog
    grows, without the app fetching every game at once.

- [ ] **Step 6: Add ratings and reviews**
  Add a ratings and reviews section to the GameDetail page. A logged-in player
  can submit a numeric rating and a written review for a game. Each player can
  only submit one rating per game (enforced by the backend). Display all
  existing reviews below the game details. Add a `ratingService.js` with
  functions for creating and fetching ratings.

  **User Stories:**

  - As a player, I want to rate a game I have played so that others can see
    how I feel about it.
  - As a player, I want to write a review of a game so that I can share my
    experience in more detail.
  - As a player, I want to read other players' reviews of a game so that I
    can decide if I want to play it.

- [ ] **Step 7: Add average rating display**
  Show the average rating for each game on both the GameDetail page and the
  GameList cards. The backend computes this as a custom model property and
  includes it in the game response. This step depends on step 6 so that
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
