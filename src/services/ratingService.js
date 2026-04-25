import { fetchJSON, postJSON, patchJSON } from "./index"

export const getRatingsByGameId = (gameId) => fetchJSON(`gameratings?game=${gameId}`)

export const createRating = (ratingData) => postJSON("gameratings", ratingData)

export const updateRating = (ratingId, ratingData) => patchJSON(`gameratings/${ratingId}`, ratingData)