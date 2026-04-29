import { fetchJSON, postJSON, patchJSON } from "./index"

export const getGames = ({ q = "", orderBy = "", direction = "asc", category = "" } = {}) => {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (orderBy) {
        params.set("orderby", orderBy)
        params.set("direction", direction)
    }
    if (category) params.set("category", category)
    const qs = params.toString()
    return fetchJSON(qs ? `games?${qs}` : "games")
}

export const getGameById = (id) => fetchJSON(`games/${id}`)

export const createGame = (gameData) => postJSON("games", gameData)

export const updateGame = (id, gameData) => patchJSON(`games/${id}`, gameData)
