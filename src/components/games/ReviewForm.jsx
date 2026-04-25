// Component for writing a review and rating for a game
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createRating } from "../../services/ratingService"
import {
    Container, PageHeader, Card, CardContent, FormField,
    Input, Textarea, Button, Alert
} from "../ui"

export const ReviewForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [rating, setRating] = useState("")
    const [review, setReview] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        createRating({ game: parseInt(id), rating: parseInt(rating), review })
            .then(() => navigate(`/games/${id}`))
            .catch(err => {
                setError(err.message)
                setSubmitting(false)
            })
    }

    return (
        <Container>
            <PageHeader
                title="Write a Review"
                subtitle="Share your experience with this game"
            />

            <Card className="max-w-2xl">
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {error && <Alert variant="error">{error}</Alert>}

                        <FormField label="Rating (1-10)" htmlFor="rating">
                            <Input
                                id="rating"
                                type="number"
                                min="1"
                                max="10"
                                value={rating}
                                onChange={e => setRating(e.target.value)}
                                placeholder="Enter a number from 1 to 10"
                                required
                            />
                        </FormField>

                        <FormField label="Review" htmlFor="review">
                            <Textarea
                                id="review"
                                value={review}
                                onChange={e => setReview(e.target.value)}
                                placeholder="Write your review..."
                                rows={6}
                                required
                            />
                        </FormField>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Saving..." : "Save"}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate(`/games/${id}`)}
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
