import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getGameById, getRatingsByGameId, getGamePictures, createGamePicture, deleteGamePicture } from "../../services"
import { useUser } from "../../contexts/UserContext"
import {
    Container, PageHeader, Card, CardContent, Badge,
    Button, Alert, LoadingPage, Input, Spinner, Modal, FormField
} from "../ui"

export const GameDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useUser()
    const [game, setGame] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [reviews, setReviews] = useState([])
    const [reviewsLoading, setReviewsLoading] = useState(true)
    const [pictures, setPictures] = useState([])
    const [picturesLoading, setPicturesLoading] = useState(true)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [selectedImageBase64, setSelectedImageBase64] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState(null)
    const [selectedPicture, setSelectedPicture] = useState(null)
    const [confirmingDelete, setConfirmingDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)

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

    useEffect(() => {
        let mounted = true
        getGamePictures(id)
            .then(data => {
                if (!mounted) return
                setPictures(data)
                setPicturesLoading(false)
            })
            .catch(() => {
                if (!mounted) return
                setPicturesLoading(false)
            })
        return () => { mounted = false }
    }, [id])

    const getBase64 = (file, callback) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(file)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        getBase64(file, (base64ImageString) => setSelectedImageBase64(base64ImageString))
    }

    const handleUpload = () => {
        if (!selectedImageBase64) return
        setUploading(true)
        setUploadError(null)
        createGamePicture({ game: parseInt(id), action_pic: selectedImageBase64 })
            .then(() => getGamePictures(id))
            .then(data => {
                setPictures(data)
                setShowUploadModal(false)
                setSelectedImageBase64(null)
                setUploading(false)
            })
            .catch(err => {
                setUploadError(err.message)
                setUploading(false)
            })
    }

    const handleDelete = () => {
        setDeleting(true)
        deleteGamePicture(selectedPicture.id)
            .then(() => getGamePictures(id))
            .then(data => {
                setPictures(data)
                setSelectedPicture(null)
                setConfirmingDelete(false)
                setDeleting(false)
            })
            .catch(() => setDeleting(false))
    }

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
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Average Rating</p>
                            <p className="text-gray-900 font-medium">
                                {game.average_rating != null ? `${game.average_rating} / 10` : "No ratings yet"}
                            </p>
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

            <div className="mt-8 max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Action Pictures</h2>
                    <Button onClick={() => setShowUploadModal(true)}>
                        Upload Action Picture
                    </Button>
                </div>
                {picturesLoading ? (
                    <div className="flex items-center gap-2">
                        <Spinner size="sm" />
                        <span className="text-sm text-gray-500">Loading pictures...</span>
                    </div>
                ) : pictures.length === 0 ? (
                    <Alert variant="info">No pictures yet. Be the first to upload one!</Alert>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {pictures.map(pic => (
                            <div key={pic.id} className="flex flex-col">
                                <img
                                    src={pic.action_pic}
                                    alt={`${game.title} action shot`}
                                    className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => setSelectedPicture(pic)}
                                />
                                <p className="text-xs text-gray-500 mt-1 text-center">
                                    Uploaded by {pic.player.first_name} {pic.player.last_name}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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

            <Modal
                isOpen={showUploadModal}
                onClose={() => {
                    setShowUploadModal(false)
                    setSelectedImageBase64(null)
                    setUploadError(null)
                }}
                title="Upload Action Picture"
            >
                {uploadError && <Alert variant="error" className="mb-4">{uploadError}</Alert>}
                <div className="flex flex-col gap-4">
                    <FormField label="Choose an image" htmlFor="actionPic">
                        <Input
                            id="actionPic"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </FormField>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedImageBase64 || uploading}
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowUploadModal(false)
                                setSelectedImageBase64(null)
                                setUploadError(null)
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={Boolean(selectedPicture)}
                onClose={() => {
                    setSelectedPicture(null)
                    setConfirmingDelete(false)
                }}
                title={confirmingDelete ? "Confirm Delete" : `${game.title} — Action Shot`}
            >
                {confirmingDelete ? (
                    <div className="flex flex-col gap-4">
                        <p className="text-gray-700">
                            Are you sure you want to delete this image for <strong>{game.title}</strong>?
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setConfirmingDelete(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <img
                            src={selectedPicture?.action_pic}
                            alt={`${game.title} action shot`}
                            className="w-full rounded-md object-cover"
                        />
                        <p className="text-xs text-gray-500 text-center">
                            Uploaded by {selectedPicture?.player.first_name} {selectedPicture?.player.last_name}
                        </p>
                        {(selectedPicture?.is_owner || user?.is_staff) && (
                            <div className="flex justify-end">
                                <Button
                                    variant="danger"
                                    onClick={() => setConfirmingDelete(true)}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </Container>
    )
}
