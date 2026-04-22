import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_BASE_URL, TOKEN_KEY } from "../services"
import { AuthCard, FormField, Input, Button, Alert } from "../components/ui"

const PASSWORD_REQUIREMENTS = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "Not entirely numeric", test: (p) => !/^\d+$/.test(p) },
    { label: "At least one uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "At least one lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "At least one number", test: (p) => /\d/.test(p) },
    { label: "At least one symbol", test: (p) => /[!@#$%^&*()\-_=+[\]{}|;:'",.<>?/`~\\]/.test(p) },
]

export const Register = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState(null)
    const [backendErrors, setBackendErrors] = useState([])
    const navigate = useNavigate()

    const hasTypedPassword = password.length > 0
    const allRequirementsMet = PASSWORD_REQUIREMENTS.every(req => req.test(password))
    const passwordsMatch = password === confirmPassword && confirmPassword !== ""

    const handleRegister = (e) => {
        e.preventDefault()
        if (!allRequirementsMet || !passwordsMatch) return
        setError(null)
        setBackendErrors([])
        fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            body: JSON.stringify({
                username: email,
                password,
                first_name: firstName,
                last_name: lastName
            }),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(authInfo => {
                if (authInfo && authInfo.token) {
                    localStorage.setItem(TOKEN_KEY, JSON.stringify(authInfo))
                    navigate("/")
                } else if (authInfo && authInfo.password) {
                    setBackendErrors(authInfo.password)
                } else {
                    setError("An account with that email already exists.")
                }
            })
            .catch(() => setError("Something went wrong. Please try again."))
    }

    return (
        <AuthCard
            subtitle="Create your account"
            footer={
                <Link className="underline text-primary-800 hover:text-primary-700" to="/login">
                    Already have an account?
                </Link>
            }
        >
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
                {error && <Alert variant="error">{error}</Alert>}

                <div className="grid grid-cols-2 gap-4">
                    <FormField label="First name" htmlFor="firstName">
                        <Input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                            autoFocus
                        />
                    </FormField>

                    <FormField label="Last name" htmlFor="lastName">
                        <Input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                        />
                    </FormField>
                </div>

                <FormField label="Email address" htmlFor="inputEmail">
                    <Input
                        type="email"
                        id="inputEmail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email address"
                        required
                    />
                </FormField>

                <FormField label="Password" htmlFor="inputPassword">
                    <Input
                        type="password"
                        id="inputPassword"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <ul className="mt-2 space-y-1">
                        {PASSWORD_REQUIREMENTS.map((req, i) => {
                            const met = req.test(password)
                            const color = met
                                ? "text-green-600"
                                : hasTypedPassword ? "text-red-500" : "text-gray-400"
                            return (
                                <li key={i} className={`text-xs ${color}`}>
                                    {met ? "✓" : "·"} {req.label}
                                </li>
                            )
                        })}
                    </ul>
                    {backendErrors.length > 0 && (
                        <Alert variant="error" className="mt-2">
                            <ul className="space-y-1">
                                {backendErrors.map((err, i) => <li key={i}>{err}</li>)}
                            </ul>
                        </Alert>
                    )}
                </FormField>

                <FormField label="Re-enter password" htmlFor="confirmPassword">
                    <Input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                    />
                    {confirmPassword && (
                        <p className={`mt-1 text-xs ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
                            {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
                        </p>
                    )}
                </FormField>

                <Button
                    type="submit"
                    disabled={!allRequirementsMet || !passwordsMatch}
                >
                    Register
                </Button>
            </form>
        </AuthCard>
    )
}
