import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import "../styles/auth.css"

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const sendOtp = async () => {

        try {

            await api.post(
                `/auth/forgot-password?email=${email}`
            );

            localStorage.setItem(
                "resetEmail",
                email
            );

            alert("OTP Sent To Email");

            navigate("/reset-password");

        } catch (error) {

            alert("Failed To Send OTP");
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h2 className="title">Forgot Password</h2>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button onClick={sendOtp}>
                    Send OTP
                </button>

            </div>

        </div>
    );

   
}

export default ForgotPassword;