import { fetchJSON, postJSON, deleteJSON } from "./index"

export const getGamePictures = (gameId) => fetchJSON(`gamepictures?game=${gameId}`)

export const createGamePicture = (pictureData) => postJSON("gamepictures", pictureData)

export const deleteGamePicture = (pictureId) => deleteJSON(`gamepictures/${pictureId}`)
