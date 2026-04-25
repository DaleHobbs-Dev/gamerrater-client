import { useParams } from "react-router-dom"
import { Container, PageHeader } from "../ui"

export const PlayerDetail = () => {
    const { id } = useParams()

    return (
        <Container>
            <PageHeader
                title="Player Profile"
                subtitle={`Player #${id}`}
            />
            <p className="text-gray-500 text-sm">
                Player details coming soon. This page will show public info such as reviews left,
                games played, and favorites.
            </p>
        </Container>
    )
}
