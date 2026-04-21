import { fetchJSON, postJSON, patchJSON } from "./index"

export const getGames = () => fetchJSON("games")

export const getGameById = (id) => fetchJSON(`games/${id}`)

export const createGame = (gameData) => postJSON("games", gameData)

export const updateGame = (id, gameData) => patchJSON(`games/${id}`, gameData)
