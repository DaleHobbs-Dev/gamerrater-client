<!-- Last updated: 2026-04-21 -->
<!-- Last change: Initial PRD creation -->

# GamerRater - Product Requirements Document

## Problem Statement

Board and card game players have no dedicated place to catalog the games they
have played, rate them, write reviews, and see how others have rated them.
GamerRater gives players a shared platform to do exactly that.

This repository is the client-side React application for the Nashville Software
School Software Development bootcamp GamerRater project. It communicates with
a separate Django REST API backend.

## Target Users

Players who want to:
- Add board/card games they have played to a shared catalog
- Rate and review games
- Browse the catalog and discover how other players rate games

## Core Requirements

### Authentication
- Users can register and log in
- Users can log out
- Protected routes restrict certain actions to authorized users
- Category management (add/edit) is restricted to authorized users only

### Games
- Players can create new game entries
- The system prevents duplicate game entries (enforced by the backend)
- Players can view a list of all games
- Players can view a game detail page with full info, reviews, and average rating
- Only the player who created a game can edit it (determined by `is_owner` returned from the backend)

### Pictures
- Players can attach a picture to a game via a URL or by uploading an image file
- Uploaded image files are stored in the Django backend's /static directory

### Ratings and Reviews
- Players can rate a game
- Players can write a review of a game
- Each game displays its average rating (computed as a custom property on the backend)

### Search and Filtering
- Players can search games by name
- Players can filter games by category
- Players can sort games by year of release
- All filtering and sorting is handled by the backend via query parameters

### Categories
- Authorized users can add and edit categories

## Technical Stack

### Stack Decisions

| Layer     | Choice            | Reason                                              |
|-----------|-------------------|-----------------------------------------------------|
| Frontend  | React 19 + Vite   | Already in use; fast dev server                     |
| Routing   | React Router v7   | Already in use                                      |
| Styling   | Tailwind CSS v4   | Already in use; utility-first, no extra build step  |
| Backend   | Django REST API   | Separate NSS bootcamp project                       |
| Auth      | Token-based       | Standard DRF token auth                             |

## Scope

### In Scope (v1)
- Auth: register, login, logout, protected routes
- Full game CRUD (edit restricted to game creator)
- Picture upload via URL and file upload
- Ratings and reviews
- Search, category filter, and sort by year (backend-driven)
- Average rating display
- Category management (protected route)

### Out of Scope
- Following other users or social features
- Notifications
- External game database integration (e.g. BoardGameGeek API)
- Mobile-specific design

## Success Criteria

- All features from the bootcamp project description are functional
- No duplicate game entries can be created
- Protected routes correctly restrict access
- Only the game creator can edit a game entry
- Search and filtering return accurate results from the backend
- Picture upload works for both URL input and file upload

## Learning Goals

- Connecting a React frontend to a Django REST API
- Implementing token-based auth with protected routes in React
- Backend-driven filtering via query parameters
- Handling file uploads from the client side
- Building a full CRUD interface with a shared UI component library
