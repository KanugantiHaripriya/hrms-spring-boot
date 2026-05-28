import { useState } from "react";
// import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSendOtp = async (e) => {
        e.preventDefault(); // Prevents page reload on form submit

        try {
            // await api.post(`/auth/forgot-password?email=${email}`);
            
            localStorage.setItem("resetEmail", email);
            alert("OTP Sent To Email");
            navigate("/reset-password");

        } catch (error) {
            alert("Failed To Send OTP");
        }
    };

    return (
        <div className="simple-auth-container">
            
            

            {/* Right Side: The Form */}
            <div className="auth-form-section">
                <div className="form-content">
                    <h1>Reset Password</h1>
                    <br />
                    <p className="subtext">Enter your email address and we'll send you a One-Time Password to restore access.</p>

                    <form onSubmit={handleSendOtp} className="simple-form">
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="simple-input"
                            required
                        />

                        <button type="submit" className="simple-btn" style={{ background: "#0f172a", color: "#fff" }}>
                            Send OTP
                        </button>
                    </form>

                    <div className="simple-footer">
                        <span className="footer-text">Remember your password?</span>
                        <Link to="/" className="footer-link">Back to Login</Link>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ForgotPassword;