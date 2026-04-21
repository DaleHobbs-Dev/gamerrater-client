import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createGame, getGameById, updateGame } from "../../services/gameService"
import { getCategories } from "../../services/categoryService"
import {
    Container, PageHeader, Card, CardContent, FormField,
    Input, Textarea, Button, Spinner, Alert, LoadingPage
} from "../ui"

export const GameForm = () => {
    const { id } = useParams()
    const isEditMode = Boolean(id)
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    const [loadingGame, setLoadingGame] = useState(isEditMode)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [designer, setDesigner] = useState("")
    const [yearReleased, setYearReleased] = useState("")
    const [numPlayers, setNumPlayers] = useState("")
    const [timeToPlay, setTimeToPlay] = useState("")
    const [ageRecommendation, setAgeRecommendation] = useState("")
    const [selectedCategories, setSelectedCategories] = useState([])

    useEffect(() => {
        let mounted = true

        const loadData = async () => {
            try {
                const promises = [getCategories()]
                if (isEditMode) promises.push(getGameById(id))

                const results = await Promise.all(promises)
                if (!mounted) return

                setCategories(results[0])
                setLoadingCategories(false)

                if (isEditMode) {
                    const game = results[1]
                    setTitle(game.title)
                    setDescription(game.description)
                    setDesigner(game.designer)
                    setYearReleased(String(game.year_released))
                    setNumPlayers(String(game.num_players))
                    setTimeToPlay(String(game.time_to_play))
                    setAgeRecommendation(String(game.age_recommendation))
                    setSelectedCategories(game.categories.map(c => c.id))
                    setLoadingGame(false)
                }
            } catch (err) {
                if (!mounted) return
                setError(err.message)
                setLoadingCategories(false)
                setLoadingGame(false)
            }
        }

        loadData()
        return () => { mounted = false }
    }, [id])

    const toggleCategory = (catId) => {
        setSelectedCategories(prev =>
            prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        const gameData = {
            title,
            description,
            designer,
            year_released: parseInt(yearReleased),
            num_players: parseInt(numPlayers),
            time_to_play: parseInt(timeToPlay),
            age_recommendation: parseInt(ageRecommendation),
            categories: selectedCategories,
        }

        const request = isEditMode ? updateGame(id, gameData) : createGame(gameData)

        request
            .then(() => navigate(isEditMode ? `/games/${id}` : "/games"))
            .catch(err => {
                setError(err.message)
                setSubmitting(false)
            })
    }

    if (loadingGame) return <LoadingPage />

    return (
        <Container>
            <PageHeader
                title={isEditMode ? "Edit Game Details" : "Register New Game"}
                subtitle={isEditMode ? "Update the information for this game" : "Add a game to the Gamer Rater database"}
            />

            <Card className="max-w-2xl">
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {error && <Alert variant="error">{error}</Alert>}

                        <FormField label="Title" htmlFor="title">
                            <Input
                                id="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Game title"
                                required
                            />
                        </FormField>

                        <FormField label="Description" htmlFor="description">
                            <Textarea
                                id="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Brief description of the game"
                                rows={3}
                                required
                            />
                        </FormField>

                        <FormField label="Designer" htmlFor="designer">
                            <Input
                                id="designer"
                                value={designer}
                                onChange={e => setDesigner(e.target.value)}
                                placeholder="Designer's full name"
                                required
                            />
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Year Released" htmlFor="yearReleased">
                                <Input
                                    id="yearReleased"
                                    type="number"
                                    value={yearReleased}
                                    onChange={e => setYearReleased(e.target.value)}
                                    placeholder="e.g. 2019"
                                    required
                                />
                            </FormField>

                            <FormField label="Number of Players" htmlFor="numPlayers">
                                <Input
                                    id="numPlayers"
                                    type="number"
                                    value={numPlayers}
                                    onChange={e => setNumPlayers(e.target.value)}
                                    placeholder="e.g. 4"
                                    required
                                />
                            </FormField>

                            <FormField label="Time to Play (min)" htmlFor="timeToPlay">
                                <Input
                                    id="timeToPlay"
                                    type="number"
                                    value={timeToPlay}
                                    onChange={e => setTimeToPlay(e.target.value)}
                                    placeholder="e.g. 60"
                                    required
                                />
                            </FormField>

                            <FormField label="Age Recommendation" htmlFor="ageRec">
                                <Input
                                    id="ageRec"
                                    type="number"
                                    value={ageRecommendation}
                                    onChange={e => setAgeRecommendation(e.target.value)}
                                    placeholder="e.g. 10"
                                    required
                                />
                            </FormField>
                        </div>

                        <FormField label="Categories">
                            {loadingCategories ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <Spinner size="sm" />
                                    <span className="text-sm text-gray-500">Loading categories...</span>
                                </div>
                            ) : categories.length === 0 ? (
                                <Alert variant="warning">No categories found.</Alert>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1 p-3 border border-gray-200 rounded-md">
                                    {categories.map(cat => (
                                        <label
                                            key={cat.id}
                                            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-primary-800"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat.id)}
                                                onChange={() => toggleCategory(cat.id)}
                                                className="accent-primary-800 w-4 h-4"
                                            />
                                            {cat.name}
                                        </label>
                                    ))}
                                </div>
                            )}
                            {selectedCategories.length > 0 && (
                                <p className="text-xs text-primary-800 mt-1">
                                    {selectedCategories.length} categor{selectedCategories.length === 1 ? "y" : "ies"} selected
                                </p>
                            )}
                        </FormField>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Saving..." : isEditMode ? "Save Changes" : "Save Game"}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate(isEditMode ? `/games/${id}` : "/games")}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Container>
    )
}
