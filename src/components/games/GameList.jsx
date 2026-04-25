import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getGames } from "../../services/gameService"
import {
    Container, PageHeader, Grid, Card, CardHeader, CardTitle, CardContent,
    Badge, Alert, Button, Pagination, LoadingPage
} from "../ui"

const GAMES_PER_PAGE = 10

export const GameList = () => {
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        let mounted = true
        getGames()
            .then(data => {
                if (!mounted) return
                setGames(data)
                setLoading(false)
            })
            .catch(err => {
                if (!mounted) return
                setError(err.message)
                setLoading(false)
            })
        return () => { mounted = false }
    }, [])

    const totalPages = Math.ceil(games.length / GAMES_PER_PAGE)
    const paginatedGames = games.slice(
        (currentPage - 1) * GAMES_PER_PAGE,
        currentPage * GAMES_PER_PAGE
    )

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    if (loading) return <LoadingPage />

    if (error) {
        return (
            <Container>
                <Alert variant="error">Failed to load games: {error}</Alert>
            </Container>
        )
    }

    return (
        <Container>
            <PageHeader
                title="Games"
                subtitle={`${games.length} game${games.length !== 1 ? "s" : ""} in the database`}
                action={
                    <Button as={Link} to="/games/new">
                        Register New Game
                    </Button>
                }
            />

            {games.length === 0 ? (
                <Alert variant="info">No games have been added yet.</Alert>
            ) : (
                <>
                    <Grid cols={2}>
                        {paginatedGames.map(game => (
                            <Card key={game.id}>
                                <CardHeader>
                                    <CardTitle>
                                        <Link
                                            to={`/games/${game.id}`}
                                            className="text-primary-800 hover:underline"
                                        >
                                            {game.title}
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500">
                                        Designed by {game.designer} &middot; {game.year_released}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {game.num_players} players &middot; ~{game.time_to_play} min &middot; Ages {game.age_recommendation}+
                                    </p>
                                    {game.categories?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {game.categories.map(cat => (
                                                <Badge key={cat.id} variant="blue">{cat.name}</Badge>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-6 mt-3 pt-3 border-t border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Average Rating</p>
                                            <p className="text-sm text-gray-900 font-medium">
                                                {game.average_rating != null ? `${game.average_rating} / 10` : "—"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Your Rating</p>
                                            <p className="text-sm text-gray-900 font-medium">
                                                {game.my_rating != null ? `${game.my_rating} / 10` : "—"}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>

                    <div className="flex justify-center mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}
        </Container>
    )
}
