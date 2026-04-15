import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services";
import "./Login.css"

export const Login = () => {
    const [email, setEmail] = useState("steve@brownlee.com")
    const [password, setPassword] = useState("brownlee")
    const existDialog = useRef()
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            body: JSON.stringify({ username: email, password }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(authInfo => {
                if (authInfo.token) {
                    localStorage.setItem("gamer_rater_token", JSON.stringify(authInfo))
                    navigate("/")
                } else {
                    existDialog.current.showModal()
                }
            })
    }

    return (
        <main className="container--login">
            <dialog className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl p-8 w-80 text-center backdrop:bg-black/40" ref={existDialog}>
                <p className="text-red-600 text-lg font-semibold mb-2">Login Failed</p>
                <p className="text-gray-600 text-sm mb-6">No account found with those credentials.</p>
                <button
                    className="px-4 py-2 bg-blue-800 text-white text-sm rounded-md hover:bg-blue-700"
                    onClick={() => existDialog.current.close()}>
                    Close
                </button>
            </dialog>

            <section>
                <form className="form--login" onSubmit={handleLogin}>
                    <h1 className="text-4xl mt-7 mb-3">Gamer Rater</h1>
                    <h2 className="text-xl mb-10">Please sign in</h2>
                    <fieldset className="mb-4">
                        <label htmlFor="inputEmail"> Email address </label>
                        <input type="email" id="inputEmail"
                            value={email}
                            onChange={evt => setEmail(evt.target.value)}
                            className="form-control"
                            placeholder="Email address"
                            required autoFocus />
                    </fieldset>
                    <fieldset className="mb-4">
                        <label htmlFor="inputPassword"> Password </label>
                        <input type="password" id="inputPassword"
                            value={password}
                            onChange={evt => setPassword(evt.target.value)}
                            className="form-control"
                            placeholder="Password"
                        />
                    </fieldset>
                    <fieldset>
                        <button type="submit" className="button p-3 rounded-md bg-blue-800 text-blue-100">
                            Sign in
                        </button>
                    </fieldset>
                </form>
            </section>
            <div className="loginLinks">
                <section className="link--register">
                    <Link className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" to="/register">Not a member yet?</Link>
                </section>
            </div>
        </main>
    )
}
