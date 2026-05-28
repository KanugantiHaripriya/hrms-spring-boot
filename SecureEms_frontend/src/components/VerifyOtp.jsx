import { useState } from "react";
import api from "../services/api"; // ✅ 1. Uncommented the API import!
import { useNavigate, Link } from "react-router-dom";

// Notice we are just reusing the exact same CSS file!
import "../styles/auth.css";

function VerifyOtp() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault(); // Allows submission via "Enter" key

        try {
            const email = localStorage.getItem("hrEmail");

            // ✅ 2. Uncommented the REAL API call!
            const response = await api.post(`/auth/verify-hr-otp?email=${email}&otp=${otp}`);
            
            // ✅ 3. Extract and save the token 
            // (Checks response.data.token, response.data.jwt, or just response.data)
            const token = response.data.token || response.data.jwt || response.data;
            
            if (token) {
                localStorage.setItem("token", token);
                alert("HR Login Success");
                navigate("/hr-dashboard");
            } else {
                alert("OTP matched, but no token was received from the server.");
            }

        } catch (error) {
            console.error("OTP Error:", error);
            alert(error.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <div className="simple-auth-container">
            

            {/* Right Side: The Form */}
            <div className="auth-form-section">
                <div className="form-content">
                    <h1>Enter OTP</h1>
                    <br />
                    <p className="subtext">
                        We have sent a secure one-time password to your registered HR email address.
                    </p>

                    <form onSubmit={handleVerify} className="simple-form">
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                            className="simple-input"
                            autoComplete="off"
                            required
                        />

                        <button type="submit" className="simple-btn" style={{ background: "#0f172a", color: "#fff" }}>
                            Verify Account
                        </button>
                    </form>

                    <div className="simple-footer">
                        <span className="footer-text">Didn't receive the code?</span>
                        <Link to="/hr-login" className="footer-link">Resend OTP</Link>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default VerifyOtp;