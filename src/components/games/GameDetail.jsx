import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getGameById } from "../../services/gameService"
import { Container, PageHeader, Card, CardContent, Badge, Button, Alert, LoadingPage } from "../ui"

export const GameDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [game, setGame] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let mounted = true
        getGameById(id)
            .then(data => {
                if (!mounted) return
                setGame(data)
                setLoading(false)
            })
            .catch(err => {
                if (!mounted) return
                setError(err.message)
                setLoading(false)
            })
        return () => { mounted = false }
    }, [id])

    if (loading) return <LoadingPage />

    if (error) {
        return (
            <Container>
                <Alert variant="error">Failed to load game: {error}</Alert>
            </Container>
        )
    }

    return (
        <Container>
            <PageHeader
                title={game.title}
                subtitle={`Designed by ${game.designer} · ${game.year_released}`}
                action={
                    game.is_owner && (
                        <Button as={Link} to={`/games/${id}/edit`}>
                            Edit Game Details
                        </Button>
                    )
                }
            />

            <Card className="max-w-2xl">
                <CardContent>
                    <p className="text-gray-700 leading-relaxed">{game.description}</p>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-6 pt-4 border-t border-gray-100">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Players</p>
                            <p className="text-gray-900 font-medium">{game.num_players}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Time to Play</p>
                            <p className="text-gray-900 font-medium">~{game.time_to_play} min</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Age Recommendation</p>
                            <p className="text-gray-900 font-medium">{game.age_recommendation}+</p>
                        </div>
                    </div>

                    {game.categories?.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Categories</p>
                            <div className="flex flex-wrap gap-2">
                                {game.categories.map(cat => (
                                    <Badge key={cat.id} variant="blue">{cat.name}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="mt-6">
                <Button variant="ghost" onClick={() => navigate("/games")}>
                    ← Back to Games
                </Button>
            </div>
        </Container>
    )
}
