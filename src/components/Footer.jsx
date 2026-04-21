export const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer className="bg-primary-900 text-primary-100 py-8 px-6 mt-auto">
            <div className="max-w-5xl mx-auto flex flex-col items-center gap-2 text-center">
                <p className="text-accent-500 font-bold text-lg tracking-wide">Gamer Rater</p>
                <p className="text-sm text-primary-100 opacity-70">
                    Rate games. Discover new favorites.
                </p>
                <p className="text-xs opacity-50 mt-2">&copy; {year} Gamer Rater</p>
            </div>
        </footer>
    )
}
