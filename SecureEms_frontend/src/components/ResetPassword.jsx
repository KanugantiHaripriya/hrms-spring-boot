import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function ResetPassword() {

    const navigate = useNavigate();

    const [otp, setOtp] = useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const resetPassword = async () => {

        try {

            const email =
                localStorage.getItem("resetEmail");

            await api.post(
                `/auth/reset-password?email=${email}&otp=${otp}&newPassword=${newPassword}`
            );

            alert("Password Reset Successful");

            navigate("/");

        } catch {

            alert("Invalid OTP");
        }
    };

    return (

        <div className="container mt-5">

            <h2>Reset Password</h2>

            <input
                type="text"
                placeholder="Enter OTP"
                className="form-control mb-2"
                onChange={(e) =>
                    setOtp(e.target.value)
                }
            />

            <input
                type="password"
                placeholder="New Password"
                className="form-control mb-2"
                onChange={(e) =>
                    setNewPassword(e.target.value)
                }
            />

            <button
                className="btn btn-success"
                onClick={resetPassword}
            >
                Reset Password
            </button>

        </div>
    );
}

export default ResetPassword;