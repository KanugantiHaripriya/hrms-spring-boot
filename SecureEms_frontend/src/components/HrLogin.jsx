import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import "../styles/hrlogin.css"

function HrLogin() {

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

            await api.post("/auth/hr-login", data);

            localStorage.setItem(
                "hrEmail",
                data.email
            );

            alert("OTP Sent");

            navigate("/verify-otp");

        } catch {

            alert("Login Failed");
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h2 className="title">HR Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button className="danger-btn" onClick={login}>
                    Send OTP
                </button>

            </div>

        </div>
    );
    
}

export default HrLogin;