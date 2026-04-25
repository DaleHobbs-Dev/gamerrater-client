import { fetchJSON } from "./index"

export const getUserProfile = () => fetchJSON("me")
