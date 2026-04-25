import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getGameById } from "../../services/gameService"
import { getRatingsByGameId } from "../../services/ratingService"
import {
    Container, PageHeader, Card, CardContent, Badge,
    Button, Alert, LoadingPage, Input, Spinner
} from "../ui"

export const GameDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [game, setGame] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [reviews, setReviews] = useState([])
    const [reviewsLoading, setReviewsLoading] = useState(true)

    // Fetch game details on mount
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

    // Fetch reviews for the game
    useEffect(() => {
        let mounted = true
        getRatingsByGameId(id)
            .then(data => {
                if (!mounted) return
                setReviews(data)
                setReviewsLoading(false)
            })
            .catch(() => {
                if (!mounted) return
                setReviewsLoading(false)
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
                    <div className="flex gap-3">
                        <Button as={Link} to={`/games/${id}/review`}>
                            Review Game
                        </Button>
                        {game.is_owner && (
                            <Button variant="secondary" as={Link} to={`/games/${id}/edit`}>
                                Edit Game Details
                            </Button>
                        )}
                    </div>
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

            <div className="mt-10 max-w-2xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h2>

                <div className="mb-5">
                    <Input
                        placeholder="Search reviews... (coming soon)"
                        disabled
                    />
                </div>

                {reviewsLoading ? (
                    <div className="flex items-center gap-2">
                        <Spinner size="sm" />
                        <span className="text-sm text-gray-500">Loading reviews...</span>
                    </div>
                ) : reviews.length === 0 ? (
                    <Alert variant="info">No reviews yet. Be the first to review this game!</Alert>
                ) : (
                    <div className="flex flex-col gap-4">
                        {reviews.map(r => (
                            <Card key={r.id}>
                                <CardContent>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="blue">{r.rating} / 10</Badge>
                                        <Link
                                            to={`/player/${r.player.id}`}
                                            className="text-sm font-medium text-primary-800 hover:underline"
                                        >
                                            {r.player.first_name} {r.player.last_name}
                                        </Link>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{r.review}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8">
                <Button variant="ghost" onClick={() => navigate("/games")}>
                    ← Back to Games
                </Button>
            </div>
        </Container>
    )
}
