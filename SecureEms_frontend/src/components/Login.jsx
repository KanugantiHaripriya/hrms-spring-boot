import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

import "../styles/login.css";

function Login() {
    const navigate = useNavigate();

    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const login = async () => {
        try {
            const response = await api.post("/auth/login", data);
            
            localStorage.setItem("token", response.data);
            localStorage.setItem("email", data?.email);
            
            alert("Login Success");
            navigate("/dashboard");
        } catch {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="simple-login-container">

            {/* --- Right Side: Clean Form --- */}
            <div className="login-form-section">
                <div className="form-content">
                    <h1>Employee Login</h1>
                    <br />
                    <p className="subtext">Please enter your details to sign in.</p>

                    <div className="simple-form">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            className="simple-input"
                            onChange={handleChange}
                            value={data.email}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="simple-input"
                            onChange={handleChange}
                            value={data.password}
                        />

                        <button className="simple-btn" onClick={login} style={{ background: "#0f172a", color: "#fff" }}>
                            Login
                        </button>

                        <div className="simple-footer">
                            <Link to="/forgot-password" className="footer-link">Forgot Password?</Link>
                            <span className="footer-text"> | </span>
                            <Link to="/register" className="footer-link">Create Account</Link>
                            <span className="footer-text"> | </span>
                            <Link to="/hr-login" className="footer-link">HR Login</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Login;