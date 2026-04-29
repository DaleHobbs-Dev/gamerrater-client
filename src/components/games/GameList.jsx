import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getGames } from "../../services/gameService"
import { getCategories } from "../../services/categoryService"
import {
    Container, PageHeader, Grid, Card, CardHeader, CardTitle, CardContent,
    Badge, Alert, Button, Pagination, LoadingPage, Input, Spinner, Select
} from "../ui"

const GAMES_PER_PAGE = 10

export const GameList = () => {
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [searching, setSearching] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchText, setSearchText] = useState("")
    const [appliedSearch, setAppliedSearch] = useState("")
    const [orderBy, setOrderBy] = useState("")
    const [direction, setDirection] = useState("asc")
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState("")

    useEffect(() => {
        let mounted = true
        setSearching(true)
        getGames({ q: appliedSearch, orderBy, direction, category })
            .then(data => {
                if (!mounted) return
                setGames(data)
                setLoading(false)
                setSearching(false)
            })
            .catch(err => {
                if (!mounted) return
                setError(err.message)
                setLoading(false)
                setSearching(false)
            })
        return () => { mounted = false }
    }, [appliedSearch, orderBy, direction, category])

    useEffect(() => {
        getCategories().then(setCategories).catch(() => {})
    }, [])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        setCurrentPage(1)
        setAppliedSearch(searchText)
    }

    const handleClearSearch = () => {
        setSearchText("")
        setAppliedSearch("")
        setCurrentPage(1)
    }

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

            <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-3">
                <Input
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    placeholder="Search by title, designer, or description..."
                />
                <Button type="submit">Search</Button>
                {appliedSearch && (
                    <Button type="button" variant="ghost" onClick={handleClearSearch}>
                        Clear
                    </Button>
                )}
            </form>

            <div className="flex gap-4 mb-6">
                <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Category</label>
                    <Select value={category} onChange={e => { setCategory(e.target.value); setCurrentPage(1) }}>
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </Select>
                </div>
                <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Order by</label>
                    <Select value={orderBy} onChange={e => { setOrderBy(e.target.value); setCurrentPage(1) }}>
                        <option value="">Default order</option>
                        <option value="year">Year Released</option>
                        <option value="time">Time to Play</option>
                        <option value="designer">Designer</option>
                        <option value="players">Number of Players</option>
                    </Select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Direction</label>
                    <Select
                        value={direction}
                        onChange={e => { setDirection(e.target.value); setCurrentPage(1) }}
                        disabled={!orderBy}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </Select>
                </div>
            </div>

            {searching ? (
                <div className="flex items-center gap-2 py-8">
                    <Spinner size="sm" />
                    <span className="text-sm text-gray-500">Searching...</span>
                </div>
            ) : games.length === 0 ? (
                <Alert variant="info">
                    {appliedSearch
                        ? `No games found matching "${appliedSearch}".`
                        : "No games have been added yet."}
                </Alert>
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
                                    {game.game_image && (
                                        <img
                                            src={game.game_image}
                                            alt={game.title}
                                            className="w-full h-36 object-cover rounded-md"
                                        />
                                    )}
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
