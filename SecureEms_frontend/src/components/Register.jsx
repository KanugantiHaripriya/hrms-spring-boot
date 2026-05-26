import { useState } from "react";
import api from "../services/api";

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

            const response = await api.post(
                "/auth/register",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log(response.data);

            alert("Registration Successful");

            setFormData({
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

        } catch (error) {

            console.log("Full Error:", error);

            console.log("Response:", error.response);

            alert(
                error.response?.data ||
                error.message ||
                "Registration Failed"
            );
        }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                <h2 className="title">Create Account</h2>

                <form onSubmit={handleSubmit} className="form">

                    <div className="grid">

                        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                        <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
                        <input name="bloodGroup" placeholder="Blood Group" value={formData.bloodGroup} onChange={handleChange} />
                        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                        <input name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} />
                        <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
                        <input name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} />
                        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />

                    </div>

                    <button type="submit">Register</button>
                    <a href="/">Back to Login</a>
                </form>

            </div>

        </div>
    );
}

export default Register;

