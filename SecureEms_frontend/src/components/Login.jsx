import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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

            const response = await api.post(
                "/auth/login",
                data
            );

            localStorage.setItem(
                "token",
                response.data
            );
            
            localStorage.setItem(
                "email",data?.email
                
            );

            alert("Login Success");

            navigate("/dashboard");

        } catch {

            alert("Invalid Credentials");
        }
    };
    return (
        <div className="login-page">

            <div className="login-card">

                <h2 className="title">Employee Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input"
                    onChange={handleChange}
                />

                <button className="btn" onClick={login}>
                    Login
                </button>

                <div className="links">

                    <Link to="/register">Create Account</Link>
                    <Link to="/forgot-password">Forgot Password</Link>
                    <Link to="/hr-login">HR Login</Link>

                </div>

            </div>

        </div>
    );
   
}

export default Login;