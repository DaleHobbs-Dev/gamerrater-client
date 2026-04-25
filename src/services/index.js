// Index file to re-export all service functions for easier imports in components

// API Configurations and utility functions
export { API_BASE_URL, TOKEN_KEY, fetchJSON, postJSON, patchJSON } from "./api.config"

// User service
export { getUserProfile } from "./userService"

// Game Rating service
export { getRatingsByGameId, createRating, updateRating } from "./ratingService"