import axios from "axios";

// ================================
// AXIOS INSTANCE
// ================================
const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

// ================================
// ADD JWT TOKEN TO EVERY REQUEST
// ================================
api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ================================
// AUTH APIs
// ================================

// Login User
export const loginUser = (data) => {
    return api.post("/auth/login", data);
};

// Register Employee
export const registerEmployee = (data) => {
    return api.post("/auth/register", data);
};

// ================================
// EMPLOYEE APIs
// ================================

// Submit Leave Request
export const submitLeave = (data) => {
    return api.post("/leave/request", data);
};

// Get Employee Leave Requests
export const getEmployeeLeaves = (employeeId) => {
    return api.get(`/leave/employee/${employeeId}`);
};

// Get Leave Statistics
export const getLeaveStats = (employeeId) => {
    return api.get(`/leave/stats/${employeeId}`);
};

// ================================
// HR APIs
// ================================

// Get All Leave Requests
export const getAllLeaves = () => {
    return api.get("/leave/all");
};

// Approve Leave
export const approveLeave = (leaveId) => {
    return api.put(`/leave/approve/${leaveId}`);
};

// Reject Leave
export const rejectLeave = (leaveId, reason) => {
    return api.put(
        `/leave/reject/${leaveId}?reason=${encodeURIComponent(reason)}`
    );
};

// ================================
// EXPORT DEFAULT API
// ================================
export default api;