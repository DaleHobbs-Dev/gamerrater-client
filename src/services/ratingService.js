import { fetchJSON, postJSON, patchJSON } from "./index"

export const getRatingsByGameId = (gameId, q = "") => {
    const params = new URLSearchParams({ game: gameId })
    if (q) params.set("q", q)
    return fetchJSON(`gameratings?${params.toString()}`)
}

export const createRating = (ratingData) => postJSON("gameratings", ratingData)

export const updateRating = (ratingId, ratingData) => patchJSON(`gameratings/${ratingId}`, ratingData)