import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/verifyOtp.css";

function VerifyOtp() {

    const navigate = useNavigate();
    const [otp, setOtp] = useState("");

    const verifyOtp = async () => {

        try {

            const email = localStorage.getItem("hrEmail");

            const response = await api.post(
                `/auth/verify-hr-otp?email=${email}&otp=${otp}`
            );

            localStorage.setItem("token", response.data);

            alert("HR Login Success");

            navigate("/hr-dashboard");

        } catch {
            alert("Invalid OTP");
        }
    };

    return (
        <div className="verify-otp-page">

            <div className="verify-otp-card">

                <h2 className="verify-otp-title">
                    Verify OTP
                </h2>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                />

                <button
                    className="verify-otp-btn"
                    onClick={verifyOtp}
                >
                    Verify
                </button>

            </div>

        </div>
    );
}

export default VerifyOtp;

