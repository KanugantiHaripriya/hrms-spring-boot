import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import HrLogin from "./components/HrLogin";
import VerifyOtp from "./components/VerifyOtp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import HrDashboard from "./components/HrDashboard";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/hr-login" element={<HrLogin />} />

        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/forgot-password"
               element={<ForgotPassword />} />

        <Route path="/reset-password"
               element={<ResetPassword />} />

        <Route path="/dashboard"
               element={<Dashboard />} />

        <Route path="/hr-dashboard"
               element={<HrDashboard />} />

        

      </Routes>

    </BrowserRouter>
  );
}

export default App;