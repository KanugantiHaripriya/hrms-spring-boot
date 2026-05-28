import { useState } from "react";
// import api from "../services/api";
import { Link } from "react-router-dom";
import "../styles/register.css";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        bloodGroup: "",
        city: "",
        gender: "",
        pincode: "",
        designation: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // const response = await api.post("/auth/register", formData, {
            //     headers: { "Content-Type": "application/json" }
            // });
            // console.log(response.data);

            alert("Registration Successful");

            setFormData({
                name: "", email: "", age: "", bloodGroup: "", city: "",
                gender: "", pincode: "", designation: "", password: ""
            });
        } catch (error) {
            console.log("Full Error:", error);
            alert(error.response?.data || error.message || "Registration Failed");
        }
    };

    return (
        <div className="simple-register-container">
            
           

            {/* Right Side: The Form */}
            <div className="register-form-section">
                <div className="form-content wide">
                    <h1>Create Account</h1>
                    <br />
                    <p className="subtext">Join the team and set up your profile.</p>

                    <form onSubmit={handleSubmit} className="simple-form">
                        
                        <div className="form-grid">
                            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="simple-input" />
                            <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="simple-input" />
                            <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required className="simple-input" />
                            <input name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required className="simple-input" />
                            <input name="bloodGroup" placeholder="Blood Group" value={formData.bloodGroup} onChange={handleChange} className="simple-input" />
                            <input name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} required className="simple-input" />
                            <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="simple-input" />
                            <input name="pincode" type="number" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required className="simple-input" />
                            
                            {/* Password spans the full width at the bottom of the grid */}
                            <div className="full-width">
                                <input name="password" type="password" placeholder="Create Password" value={formData.password} onChange={handleChange} required className="simple-input" />
                            </div>
                        </div>

                        <button type="submit" className="simple-btn" style={{ background: "#0f172a", color: "#fff" }}>
                            Complete Registration
                        </button>
                    </form>

                    <div className="simple-footer">
                        <span className="footer-text">Already have an account?</span>
                        <Link to="/" className="footer-link">Back to Login</Link>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Register;