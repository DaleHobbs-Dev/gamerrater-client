import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, TOKEN_KEY } from "../services";
import "./Login.css"

const PASSWORD_REQUIREMENTS = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "Not entirely numeric", test: (p) => !/^\d+$/.test(p) },
    { label: "At least one uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "At least one lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "At least one number", test: (p) => /\d/.test(p) },
    { label: "At least one symbol", test: (p) => /[!@#$%^&*()\-_=+[\]{}|;:'",.<>?/`~\\]/.test(p) },
]

export const Register = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [backendErrors, setBackendErrors] = useState([])
    const existDialog = useRef()
    const navigate = useNavigate()

    const allRequirementsMet = PASSWORD_REQUIREMENTS.every(req => req.test(password))
    const passwordsMatch = password === confirmPassword && confirmPassword !== ""

    const handleRegister = (e) => {
        e.preventDefault()
        if (!allRequirementsMet || !passwordsMatch) return
        setBackendErrors([])
        fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            body: JSON.stringify({
                username: email,
                password,
                first_name: firstName,
                last_name: lastName
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(authInfo => {
                if (authInfo && authInfo.token) {
                    localStorage.setItem(TOKEN_KEY, JSON.stringify(authInfo))
                    navigate("/")
                } else if (authInfo && authInfo.password) {
                    setBackendErrors(authInfo.password)
                } else {
                    existDialog.current.showModal()
                }
            })
    }

    return (
        <main className="container--login">
            <dialog className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl p-8 w-80 text-center backdrop:bg-black/40" ref={existDialog}>
                <p className="text-red-600 text-lg font-semibold mb-2">Registration Failed</p>
                <p className="text-gray-600 text-sm mb-6">An account with that email already exists.</p>
                <button
                    className="px-4 py-2 bg-blue-800 text-white text-sm rounded-md hover:bg-blue-700"
                    onClick={() => existDialog.current.close()}>
                    Close
                </button>
            </dialog>

            <section>
                <form className="form--login" onSubmit={handleRegister}>
                    <h1 className="text-4xl mt-7 mb-3">Gamer Rater</h1>
                    <h2 className="text-xl mb-10">Register new account</h2>
                    <fieldset className="mb-4">
                        <label htmlFor="firstName"> First name </label>
                        <input type="text" id="firstName"
                            value={firstName}
                            onChange={evt => setFirstName(evt.target.value)}
                            className="form-control"
                            placeholder=""
                            required autoFocus />
                    </fieldset>
                    <fieldset className="mb-4">
                        <label htmlFor="lastName"> Last name </label>
                        <input type="text" id="lastName"
                            value={lastName}
                            onChange={evt => setLastName(evt.target.value)}
                            className="form-control"
                            placeholder=""
                            required />
                    </fieldset>
                    <fieldset className="mb-4">
                        <label htmlFor="inputEmail"> Email address </label>
                        <input type="email" id="inputEmail"
                            value={email}
                            onChange={evt => setEmail(evt.target.value)}
                            className="form-control"
                            placeholder="Email address"
                            required />
                    </fieldset>
                    <fieldset className="mb-2">
                        <label htmlFor="inputPassword"> Password </label>
                        <input type="password" id="inputPassword"
                            value={password}
                            onChange={evt => setPassword(evt.target.value)}
                            className="form-control"
                            placeholder="Password"
                        />
                        <ul className="mt-2 text-sm">
                            {PASSWORD_REQUIREMENTS.map((req, i) => {
                                const met = req.test(password)
                                return (
                                    <li key={i} className={met ? "text-green-600" : "text-red-600"}>
                                        {met ? "✓ " : ""}{req.label}
                                    </li>
                                )
                            })}
                        </ul>
                        {backendErrors.length > 0 && (
                            <ul className="mt-2 text-sm text-red-600">
                                {backendErrors.map((err, i) => <li key={i}>{err}</li>)}
                            </ul>
                        )}
                    </fieldset>
                    <fieldset className="mb-4">
                        <label htmlFor="confirmPassword"> Re-enter password </label>
                        <input type="password" id="confirmPassword"
                            value={confirmPassword}
                            onChange={evt => setConfirmPassword(evt.target.value)}
                            className="form-control"
                            placeholder="Re-enter password"
                        />
                        {confirmPassword && (
                            <p className={`mt-1 text-sm ${passwordsMatch ? "text-green-600" : "text-red-600"}`}>
                                {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
                            </p>
                        )}
                    </fieldset>
                    <fieldset>
                        <button
                            type="submit"
                            disabled={!allRequirementsMet || !passwordsMatch}
                            className="button p-3 rounded-md bg-blue-800 text-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Register
                        </button>
                    </fieldset>
                </form>
            </section>
            <div className="loginLinks">
                <section className="link--register">
                    <Link className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" to="/login">Already have an account?</Link>
                </section>
            </div>
        </main>
    )
}
