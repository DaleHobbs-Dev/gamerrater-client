export const API_BASE_URL = "http://localhost:8000/"
export const TOKEN_KEY = "gamer_rater_token"

const getAuthHeader = () => {
    const token = JSON.parse(localStorage.getItem(TOKEN_KEY))?.token
    return token ? { "Authorization": `Token ${token}` } : {}
}

export const fetchJSON = async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: getAuthHeader()
    })
    if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`)
    }
    return response.json()
}

export const postJSON = async (endpoint, body) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        throw new Error(`Failed to post to ${endpoint}: ${response.statusText}`)
    }
    return response.json()
}

export const patchJSON = async (endpoint, body) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PATCH",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        throw new Error(`Failed to patch ${endpoint}: ${response.statusText}`)
    }
    return response.status !== 204 ? response.json() : null
}

export const deleteJSON = async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: getAuthHeader()
    })
    if (!response.ok) {
        throw new Error(`Failed to delete ${endpoint}: ${response.statusText}`)
    }
    return response.status !== 204 ? response.json() : null
}