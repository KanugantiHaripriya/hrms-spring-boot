// import { useState } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";

// import "../styles/hrlogin.css"

// function HrLogin() {

//     const navigate = useNavigate();

//     const [data, setData] = useState({
//         email: "",
//         password: ""
//     });

//     const handleChange = (e) => {

//         setData({
//             ...data,
//             [e.target.name]: e.target.value
//         });
//     };

//     const login = async () => {

//         try {

//             await api.post("/auth/hr-login", data);

//             localStorage.setItem(
//                 "hrEmail",
//                 data.email
//             );

//             alert("OTP Sent");

//             navigate("/verify-otp");

//         } catch {

//             alert("Login Failed");
//         }
//     };

//     return (
//         <div className="auth-page">

//             <div className="auth-card">

//                 <h2 className="title">HR Login</h2>

//                 <input
//                     type="email"
//                     name="email"
//                     placeholder="Email"
//                     onChange={handleChange}
//                 />

//                 <input
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     onChange={handleChange}
//                 />

//                 <button className="danger-btn" onClick={login}>
//                     Send OTP
//                 </button>

//             </div>

//         </div>
//     );
    
// }

// export default HrLogin;

import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

import "../styles/hrlogin.css";

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

        <div className="simple-login-container">

            <div className="login-form-section">

                <div className="form-content">

                    <h1>HR Login</h1>

                    <p className="subtext">
                        Please enter your HR credentials.
                    </p>

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

                        <button
                            className="simple-btn"
                            onClick={login}
                            style={{ background: "#0f172a", color: "#fff" }}
                        >
                            Send OTP
                        </button>

                        <div className="simple-footer">

                            <Link
                                to="/"
                                className="footer-link"
                            >
                                Employee Login
                            </Link>

                            <span className="footer-text"> | </span>

                            <Link
                                to="/register"
                                className="footer-link"
                            >
                                Create Account
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default HrLogin;