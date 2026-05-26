// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// import api, {
//     getAllLeaves,
//     approveLeave,
//     rejectLeave
// } from "../services/api";

// import AssetsModal from "./AssetsModal";

// import "../styles/hrDashboard.css";

// function HrDashboard() {

//     const navigate = useNavigate();

//     // =========================
//     // BULK UPLOAD STUFF
//     // =========================
//     const fileInputRef = useRef(null);
//     const [isUploading, setIsUploading] = useState(false);

//     // =========================
//     // ASSET STATES
//     // =========================

//     const [selectedEmpId, setSelectedEmpId] =
//         useState(null);

//     const [showAssets, setShowAssets] =
//         useState(false);

//     // =========================
//     // EMPLOYEE STATES
//     // =========================

//     const [employees, setEmployees] =
//         useState([]);

//     const [editingId, setEditingId] =
//         useState(null);

//     // =========================
//     // LEAVE STATES
//     // =========================

//     const [leaveRequests, setLeaveRequests] =
//         useState([]);

//     const [rejectReason, setRejectReason] =
//         useState({});

//     // =========================
//     // SECTION STATE
//     // =========================

//     const [activeSection, setActiveSection] =
//         useState("dashboard");

//     // =========================
//     // PAGINATION STATES
//     // =========================

//     const [currentPage, setCurrentPage] = useState(1);

//     const employeesPerPage = 5;

//     // =========================
//     // EMPLOYEE FORM
//     // =========================

//     const [employee, setEmployee] =
//         useState({
//             name: "",
//             email: "",
//             age: "",
//             bloodGroup: "",
//             city: "",
//             gender: "",
//             pincode: "",
//             designation: "",
//             password: "",
//             active: true
//         });

//     const token =
//         localStorage.getItem("token");

//     // =========================
//     // LOGOUT
//     // =========================

//     const handleLogout = () => {

//         localStorage.removeItem("token");

//         navigate("/");
//     };

//     // =========================
//     // FETCH EMPLOYEES
//     // =========================

//     const fetchEmployees = async () => {

//         try {

//             const response =
//                 await api.get(
//                     "/hr/all",
//                     {
//                         headers: {
//                             Authorization:
//                                 `Bearer ${token}`
//                         }
//                     }
//                 );

//             setEmployees(response.data);

//         } catch (error) {

//             console.log(error);

//             alert("Failed To Fetch Employees");
//         }
//     };

//     // =========================
//     // FETCH LEAVES
//     // =========================

//     const fetchLeaveRequests = async () => {

//         try {

//             const response =
//                 await getAllLeaves();

//             setLeaveRequests(response.data);

//         } catch (error) {

//             console.log(error);

//             alert("Failed To Fetch Leave Requests");
//         }
//     };

//     useEffect(() => {

//         fetchEmployees();

//         fetchLeaveRequests();

//     }, []);

//     // =========================
//     // HANDLE INPUT
//     // =========================

//     const handleChange = (e) => {

//         setEmployee({
//             ...employee,
//             [e.target.name]: e.target.value
//         });
//     };

//     // =========================
//     // EDIT EMPLOYEE
//     // =========================

//     const editEmployee = (emp) => {

//         setEmployee({
//             name: emp.name,
//             email: emp.email,
//             age: emp.age,
//             bloodGroup: emp.bloodGroup,
//             city: emp.city,
//             gender: emp.gender,
//             pincode: emp.pincode,
//             designation: emp.designation,
//             password: "",
//             active: emp.active
//         });

//         setEditingId(emp.id);
//     };

//     // =========================
//     // ADD EMPLOYEE
//     // =========================

//     const addEmployee = async () => {

//         try {

//             await api.post(
//                 "/hr/add",
//                 employee,
//                 {
//                     headers: {
//                         Authorization:
//                             `Bearer ${token}`
//                     }
//                 }
//             );

//             alert("Employee Added");

//             setEmployee({
//                 name: "",
//                 email: "",
//                 age: "",
//                 bloodGroup: "",
//                 city: "",
//                 gender: "",
//                 pincode: "",
//                 designation: "",
//                 password: "",
//                 active: true
//             });

//             fetchEmployees();

//         } catch (error) {

//             console.log(error);

//             alert(
//                 error.response?.data ||
//                 "Failed To Add Employee"
//             );
//         }
//     };

//     // =========================
//     // UPDATE EMPLOYEE
//     // =========================

//     const updateEmployee = async () => {

//         try {

//             await api.put(
//                 `/hr/update/${editingId}`,
//                 employee,
//                 {
//                     headers: {
//                         Authorization:
//                             `Bearer ${token}`
//                     }
//                 }
//             );

//             alert("Employee Updated");

//             setEmployee({
//                 name: "",
//                 email: "",
//                 age: "",
//                 bloodGroup: "",
//                 city: "",
//                 gender: "",
//                 pincode: "",
//                 designation: "",
//                 password: "",
//                 active: true
//             });

//             setEditingId(null);

//             fetchEmployees();

//         } catch (error) {

//             console.log(error);

//             alert("Update Failed");
//         }
//     };

//     // =========================
//     // DELETE EMPLOYEE
//     // =========================

//     const deleteEmployee = async (id) => {

//         try {

//             await api.delete(
//                 `/hr/delete/${id}`,
//                 {
//                     headers: {
//                         Authorization:
//                             `Bearer ${token}`
//                     }
//                 }
//             );

//             alert("Employee Deleted");

//             fetchEmployees();

//         } catch (error) {

//             console.log(error);

//             alert("Delete Failed");
//         }
//     };

//     // =========================
//     // APPROVE LEAVE
//     // =========================

//     const handleApprove = async (id) => {

//         try {

//             await approveLeave(id);

//             alert("Leave Approved");

//             fetchLeaveRequests();

//         } catch (error) {

//             console.log(error);

//             alert("Approval Failed");
//         }
//     };

//     // =========================
//     // REJECT LEAVE
//     // =========================

//     const handleReject = async (id) => {

//         try {

//             await rejectLeave(
//                 id,
//                 rejectReason[id] || "Rejected By HR"
//             );

//             alert("Leave Rejected");

//             fetchLeaveRequests();

//         } catch (error) {

//             console.log(error);

//             alert("Rejection Failed");
//         }
//     };

//     // ==========================================
//     // EXCEL FILE INTERACTION & HANDLERS
//     // ==========================================
    
//     // Triggers hidden input click event to launch device File Explorer window
//     const triggerFileExplorer = () => {
//         fileInputRef.current.click();
//     };

//     const handleBulkUploadFile = async (event) => {
//         const file = event.target.files[0];
//         if (!file) return;

//         // Visual format filtering confirmation rule 
//         const fileExtension = file.name.split('.').pop().toLowerCase();
//         if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
//             alert("Invalid spreadsheet type! Please select a standard .xlsx or .xls layout sheet document.");
//             return;
//         }

//         // Bundle data into specialized multipart boundary stream containers
//         const formData = new FormData();
//         formData.append("file", file);

//         setIsUploading(true);

//         try {
//             // Ships payload directly to bulk parsing endpoint setup
//             const response = await api.post("/api/employees/bulk-upload", formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             alert(response.data || "Bulk upload operation completed successfully!");
            
//             // Refreshes backend table listings visually
//             fetchEmployees();
//         } catch (error) {
//             console.error("Bulk processing execution exception details:", error);
//             alert(error.response?.data || "An error occurred while uploading processing file.");
//         } finally {
//             setIsUploading(false);
//             // Clear the file input value so the same file can be uploaded again if needed
//             event.target.value = "";
//         }
//     };

//     // =========================
//     // PAGINATION LOGIC
//     // =========================

//     const indexOfLastEmployee =
//         currentPage * employeesPerPage;

//     const indexOfFirstEmployee =
//         indexOfLastEmployee - employeesPerPage;

//     const currentEmployees =
//         employees.slice(
//             indexOfFirstEmployee,
//             indexOfLastEmployee
//         );

//     const totalPages =
//         Math.ceil(
//             employees.length / employeesPerPage
//         );

//     const goToNextPage = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     const goToPrevPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     return (

//         <div className="container mt-5">

//             {/* ========================= */}
//             {/* TOP HEADER */}
//             {/* ========================= */}

//             <div className="dashboard-topbar">

//                 <h2>HR Dashboard</h2>

//                 <div className="topbar-buttons">

//                     {/* HIDDEN SYSTEM EXPLORER FILE TRIGGER PORTAL */}
//                     <input 
//                         type="file" 
//                         ref={fileInputRef} 
//                         style={{ display: 'none' }} 
//                         accept=".xlsx, .xls"
//                         onChange={handleBulkUploadFile}
//                     />

//                     {/* BULK UPLOAD ACTION DRIVER */}
//                     <button 
//                         className="small-btn" 
//                         style={{ backgroundColor: '#10b981', color: '#fff', marginRight: '8px' }}
//                         onClick={triggerFileExplorer}
//                         disabled={isUploading}
//                     >
//                         {isUploading ? "Uploading..." : "Bulk Upload"}
//                     </button>

//                     <button
//                         className="small-btn"
//                         onClick={() =>
//                             setActiveSection(
//                                 activeSection === "leave"
//                                     ? "dashboard"
//                                     : "leave"
//                             )
//                         }
//                     >
//                         {
//                             activeSection === "leave"
//                                 ? "Back"
//                                 : "Leave Requests"
//                         }
//                     </button>

//                     <button
//                         className="logout-btn"
//                         onClick={handleLogout}
//                     >
//                         Logout
//                     </button>

//                 </div>

//             </div>

//             {/* ========================= */}
//             {/* DASHBOARD SECTION */}
//             {/* ========================= */}

//             {activeSection === "dashboard" && (

//                 <>

//                     {/* ADD EMPLOYEE */}

//                     {/* ADD EMPLOYEE */}

//                     <div className="employee-form-wrapper">

//                         <h4>Add Employee</h4>

//                         <input
//                             type="text"
//                             name="name"
//                             placeholder="Name"
//                             value={employee.name}
//                             onChange={handleChange}
//                         />

//                         <input
//                             type="email"
//                             name="email"
//                             placeholder="Email"
//                             value={employee.email}
//                             onChange={handleChange}
//                         />

//                         <input
//                             type="number"
//                             name="age"
//                             placeholder="Age"
//                             value={employee.age}
//                             onChange={handleChange}
//                         />

//                         <input
//                             type="text"
//                             name="bloodGroup"
//                             placeholder="Blood Group"
//                             value={employee.bloodGroup}
//                             onChange={handleChange}
//                         />

//                         <input
//                             type="text"
//                             name="city"
//                             placeholder="City"
//                             value={employee.city}
//                             onChange={handleChange}
//                         />

//                         <input
//                             type="text"
//                             name="gender"
//                             placeholder="Gender"
//                             value={employee.gender}
//                             onChange={handleChange}
//                         />

//                         <input
//                             type="text"
//                             name="pincode"
//                             placeholder="Pincode"
//                             value={employee.pincode}
//                             onChange={handleChange}
//                         />

//                         <input
//                             type="text"
//                             name="designation"
//                             placeholder="Designation"
//                             value={employee.designation}
//                             onChange={handleChange}
//                         />

//                         <input
//                             type="password"
//                             name="password"
//                             placeholder="Password"
//                             value={employee.password}
//                             onChange={handleChange}
//                         />

//                         <button
//                             className="employee-submit-btn"
//                             onClick={
//                                 editingId
//                                     ? updateEmployee
//                                     : addEmployee
//                             }
//                         >
//                             {
//                                 editingId
//                                     ? "Update Employee"
//                                     : "Add Employee"
//                             }
//                         </button>

//                     </div>

//                     {/* EMPLOYEE TABLE */}

//                     <h4>All Employees</h4>

//                     <table className="table table-bordered">

//                         <thead>

//                             <tr>

//                                 <th>ID</th>
//                                 <th>Name</th>
//                                 <th>Email</th>
//                                 <th>Age</th>
//                                 <th>Blood Group</th>
//                                 <th>City</th>
//                                 <th>Gender</th>
//                                 <th>Pincode</th>
//                                 <th>Designation</th>
//                                 <th>Action</th>

//                             </tr>

//                         </thead>

//                         <tbody>

//                             {currentEmployees.map((emp) => (

//                                 <tr key={emp.id}>

//                                     <td>{emp.id}</td>

//                                     <td>{emp.name}</td>

//                                     <td>{emp.email}</td>

//                                     <td>{emp.age}</td>

//                                     <td>{emp.bloodGroup}</td>

//                                     <td>{emp.city}</td>

//                                     <td>{emp.gender}</td>

//                                     <td>{emp.pincode}</td>

//                                     <td>{emp.designation}</td>

//                                     <td>

//                                         <button
//                                             className="btn btn-info me-2"
//                                             onClick={() => {
//                                                 setSelectedEmpId(emp.id);
//                                                 setShowAssets(true);
//                                             }}
//                                         >
//                                             Assets
//                                         </button>

//                                         <button
//                                             className="btn btn-danger me-2"
//                                             onClick={() =>
//                                                 deleteEmployee(emp.id)
//                                             }
//                                         >
//                                             Delete
//                                         </button>

//                                         <button
//                                             className="btn btn-warning"
//                                             onClick={() =>
//                                                 editEmployee(emp)
//                                             }
//                                         >
//                                             Update
//                                         </button>

//                                     </td>

//                                 </tr>
//                             ))}

//                         </tbody>

//                     </table>

//                 </>

//             )}

//             {/* ========================= */}
//             {/* LEAVE REQUEST SECTION */}
//             {/* ========================= */}

//             {activeSection === "leave" && (

//                 <>

//                     <h2>Leave Requests</h2>

//                     <table className="table table-bordered">

//                         <thead>

//                             <tr>

//                                 <th>ID</th>
//                                 <th>Employee ID</th>
//                                 <th>Start Date</th>
//                                 <th>End Date</th>
//                                 <th>Leave Type</th>
//                                 <th>Reason</th>
//                                 <th>Status</th>
//                                 <th>Actions</th>

//                             </tr>

//                         </thead>

//                         <tbody>

//                             {leaveRequests.map((leave) => (

//                                 <tr key={leave.id}>

//                                     <td>{leave.id}</td>

//                                     <td>{leave.employeeId}</td>

//                                     <td>{leave.startDate}</td>

//                                     <td>{leave.endDate}</td>

//                                     <td>{leave.leaveType}</td>

//                                     <td>{leave.reason}</td>

//                                     <td>{leave.status}</td>

//                                     <td>

//                                         <button
//                                             className="btn btn-success me-2"
//                                             onClick={() =>
//                                                 handleApprove(leave.id)
//                                             }
//                                         >
//                                             Approve
//                                         </button>

//                                         <input
//                                             type="text"
//                                             placeholder="Reject Reason"
//                                             className="form-control mb-2"
//                                             onChange={(e) =>
//                                                 setRejectReason({
//                                                     ...rejectReason,
//                                                     [leave.id]:
//                                                         e.target.value
//                                                 })
//                                             }
//                                         />

//                                         <button
//                                             className="btn btn-danger"
//                                             onClick={() =>
//                                                 handleReject(leave.id)
//                                             }
//                                         >
//                                             Reject
//                                         </button>

//                                     </td>

//                                 </tr>
//                             ))}

//                         </tbody>

//                     </table>

//                 </>

//             )}

//             {/* ========================= */}
//             {/* ASSETS MODAL */}
//             {/* ========================= */}

//             {showAssets && selectedEmpId && (

//                 <AssetsModal
//                     empId={selectedEmpId}
//                     onClose={() => {
//                         setShowAssets(false);
//                         setSelectedEmpId(null);
//                     }}
//                 />
//             )}

//             {/* ========================= */}
//             {/* PAGINATION */}
//             {/* ========================= */}

//             {activeSection === "dashboard" &&
//             employees.length > 0 && (

//             <div className="pagination-container">

//                 <button
//                     className="pagination-icon-btn"
//                     onClick={goToPrevPage}
//                     disabled={currentPage === 1}
//                 >
//                     ◀
//                 </button>

//                 <span className="pagination-text">
//                     {currentPage} / {totalPages}
//                 </span>

//                 <button
//                     className="pagination-icon-btn"
//                     onClick={goToNextPage}
//                     disabled={currentPage === totalPages}
//                 >
//                     ▶
//                 </button>

//             </div>

//             )}
//         </div>
//     );
// }

// export default HrDashboard;


import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import api, {
    getAllLeaves,
    approveLeave,
    rejectLeave
} from "../services/api";

import AssetsModal from "./AssetsModal";
import "../styles/hrDashboard.css";

function HrDashboard() {

    const navigate = useNavigate();

    // =========================
    // BULK UPLOAD STUFF
    // =========================
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    // =========================
    // PAYROLL STATES
    // =========================
    const [showPayrollModal, setShowPayrollModal] = useState(false);
    const [payrollEmpId, setPayrollEmpId] = useState(null);

    // =========================
    // ASSET STATES
    // =========================
    const [selectedEmpId, setSelectedEmpId] = useState(null);
    const [showAssets, setShowAssets] = useState(false);

    // =========================
    // EMPLOYEE STATES
    // =========================
    const [employees, setEmployees] = useState([]);
    const [editingId, setEditingId] = useState(null);

    // =========================
    // LEAVE STATES
    // =========================
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [rejectReason, setRejectReason] = useState({});

    // =========================
    // SECTION STATE
    // =========================
    const [activeSection, setActiveSection] = useState("dashboard");

    // =========================
    // PAGINATION STATES
    // =========================
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 5;

    // =========================
    // EMPLOYEE FORM
    // =========================
    const [employee, setEmployee] = useState({
        name: "", email: "", age: "", bloodGroup: "",
        city: "", gender: "", pincode: "", designation: "",
        password: "", active: true
    });

    const token = localStorage.getItem("token");

    // =========================
    // LOGOUT
    // =========================
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // =========================
    // FETCH EMPLOYEES
    // =========================
    const fetchEmployees = async () => {
        try {
            const response = await api.get("/hr/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(response.data);
        } catch (error) {
            console.log(error);
            alert("Failed To Fetch Employees");
        }
    };

    // =========================
    // FETCH LEAVES
    // =========================
    const fetchLeaveRequests = async () => {
        try {
            const response = await getAllLeaves();
            setLeaveRequests(response.data);
        } catch (error) {
            console.log(error);
            alert("Failed To Fetch Leave Requests");
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchLeaveRequests();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================
    const handleChange = (e) => {
        setEmployee({
            ...employee,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // EDIT EMPLOYEE
    // =========================
    const editEmployee = (emp) => {
        setEmployee({
            name: emp.name, email: emp.email, age: emp.age,
            bloodGroup: emp.bloodGroup, city: emp.city, gender: emp.gender,
            pincode: emp.pincode, designation: emp.designation,
            password: "", active: emp.active
        });
        setEditingId(emp.id);
    };

    // =========================
    // ADD EMPLOYEE
    // =========================
    // const addEmployee = async () => {
    //     try {
    //         await api.post("/hr/add", employee, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         alert("Employee Added");
    //         setEmployee({
    //             name: "", email: "", age: "", bloodGroup: "",
    //             city: "", gender: "", pincode: "", designation: "",
    //             password: "", active: true
    //         });
    //         fetchEmployees();
    //     } catch (error) {
    //         console.log(error);
    //         alert(error.response?.data || "Failed To Add Employee");
    //     }
    // };

    const addEmployee = async () => {

    // Name validation
    if (employee.name.trim().length < 3) {
        alert("Name must contain minimum 3 characters");
        return;
    }

    // Email validation
    if (!employee.email.includes("@")) {
        alert("Enter valid email");
        return;
    }

    // Age validation
    if (employee.age < 18 || employee.age > 60) {
        alert("Age must be between 18 and 60");
        return;
    }

    // Blood group validation
    if (employee.bloodGroup.trim() === "") {
        alert("Blood group is required");
        return;
    }

    // City validation
    if (employee.city.trim() === "") {
        alert("City is required");
        return;
    }

    // Gender validation
    if (employee.gender.trim() === "") {
        alert("Gender is required");
        return;
    }

    // Pincode validation
    if (!/^\d{6}$/.test(employee.pincode)) {
        alert("Pincode must be 6 digits");
        return;
    }

    // Designation validation
    if (employee.designation.trim() === "") {
        alert("Designation is required");
        return;
    }

    // Password validation
    if (employee.password.length < 6) {
        alert("Password must contain minimum 6 characters");
        return;
    }

    try {

        await api.post("/hr/add", employee, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        alert("Employee Added");

        setEmployee({
            name: "",
            email: "",
            age: "",
            bloodGroup: "",
            city: "",
            gender: "",
            pincode: "",
            designation: "",
            password: "",
            active: true
        });

        fetchEmployees();

    } catch (error) {

        console.log(error);

        alert(
            error.response?.data?.message ||
            "Failed To Add Employee"
        );
    }
};

    // =========================
    // UPDATE EMPLOYEE
    // =========================
    const updateEmployee = async () => {
        try {
            await api.put(`/hr/update/${editingId}`, employee, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Employee Updated");
            setEmployee({
                name: "", email: "", age: "", bloodGroup: "",
                city: "", gender: "", pincode: "", designation: "",
                password: "", active: true
            });
            setEditingId(null);
            fetchEmployees();
        } catch (error) {
            console.log(error);
            alert("Update Failed");
        }
    };

    // =========================
    // DELETE EMPLOYEE
    // =========================
    const deleteEmployee = async (id) => {
        try {
            await api.delete(`/hr/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Employee Deleted");
            fetchEmployees();
        } catch (error) {
            console.log(error);
            alert("Delete Failed");
        }
    };

    // =========================
    // SAVE PAYROLL
    // =========================
    const handleSavePayroll = async (empId, payrollPayload) => {
        try {
            // Updated to include /api/hr to match your controller annotation perfectly!
            const response = await api.put(`/api/hr/payroll/update/${empId}`, payrollPayload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert(response.data || "Payroll record updated successfully!");
            setShowPayrollModal(false);
            fetchEmployees(); // Refresh the table UI
        } catch (error) {
            console.error("Error saving payroll:", error);
            alert(error.response?.data || "Failed to update employee payroll mapping.");
        }
    };

    // =========================
    // LEAVE ACTIONS
    // =========================
    const handleApprove = async (id) => {
        try {
            await approveLeave(id);
            alert("Leave Approved");
            fetchLeaveRequests();
        } catch (error) {
            console.log(error);
            alert("Approval Failed");
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectLeave(id, rejectReason[id] || "Rejected By HR");
            alert("Leave Rejected");
            fetchLeaveRequests();
        } catch (error) {
            console.log(error);
            alert("Rejection Failed");
        }
    };

    // =========================
    // BULK UPLOAD HANDLER
    // =========================
    const triggerFileExplorer = () => {
        fileInputRef.current.click();
    };

    const handleBulkUploadFile = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
            alert("Invalid spreadsheet type! Please select a standard .xlsx or .xls layout sheet document.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);

        try {
            const response = await api.post("/api/employees/bulk-upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            alert(response.data || "Bulk upload operation completed successfully!");
            fetchEmployees();
        } catch (error) {
            console.error("Bulk processing execution exception details:", error);
            alert(error.response?.data || "An error occurred while uploading processing file.");
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    };

    // =========================
    // PAGINATION LOGIC
    // =========================
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
    const totalPages = Math.ceil(employees.length / employeesPerPage);

    const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
    const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

    return (
        <div className="container mt-5">
            <div className="dashboard-topbar">
                <h2>HR Dashboard</h2>
                <div className="topbar-buttons">
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xlsx, .xls" onChange={handleBulkUploadFile} />
                    <button className="small-btn" style={{ backgroundColor: '#10b981', color: '#fff', marginRight: '8px' }} onClick={triggerFileExplorer} disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Bulk Upload"}
                    </button>
                    <button className="small-btn" onClick={() => setActiveSection(activeSection === "leave" ? "dashboard" : "leave")}>
                        {activeSection === "leave" ? "Back" : "Leave Requests"}
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {activeSection === "dashboard" && (
                <>
                    <div className="employee-form-wrapper">
                        <h4>{editingId ? "Update Employee" : "Add Employee"}</h4>
                        <input type="text" name="name" placeholder="Name" value={employee.name} onChange={handleChange} />
                        <input type="email" name="email" placeholder="Email" value={employee.email} onChange={handleChange} />
                        <input type="number" name="age" placeholder="Age" value={employee.age} onChange={handleChange} />
                        <input type="text" name="bloodGroup" placeholder="Blood Group" value={employee.bloodGroup} onChange={handleChange} />
                        <input type="text" name="city" placeholder="City" value={employee.city} onChange={handleChange} />
                        <input type="text" name="gender" placeholder="Gender" value={employee.gender} onChange={handleChange} />
                        <input type="text" name="pincode" placeholder="Pincode" value={employee.pincode} onChange={handleChange} />
                        <input type="text" name="designation" placeholder="Designation" value={employee.designation} onChange={handleChange} />
                        <input type="password" name="password" placeholder="Password" value={employee.password} onChange={handleChange} />
                        <button className="employee-submit-btn" onClick={editingId ? updateEmployee : addEmployee}>
                            {editingId ? "Update Employee" : "Add Employee"}
                        </button>
                    </div>

                    <h4>All Employees</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Email</th><th>Age</th>
                                <th>Blood Group</th><th>City</th><th>Gender</th>
                                <th>Designation</th><th>Net Salary</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEmployees.map((emp) => (
                                <tr key={emp.id}>
                                    <td>{emp.id}</td><td>{emp.name}</td><td>{emp.email}</td><td>{emp.age}</td>
                                    <td>{emp.bloodGroup}</td><td>{emp.city}</td><td>{emp.gender}</td>
                                    <td>{emp.designation}</td>
                                    
                                    {/* NET SALARY DISPLAY */}
                                    <td>
                                        {emp.payroll ? (
                                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>₹{emp.payroll.netSalary}</span>
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '12px' }}>Not Set</span>
                                        )}
                                    </td>

                                    <td>
                                        {/* PAYROLL BUTTON */}
                                        <button className="btn btn-primary me-2" onClick={() => { setPayrollEmpId(emp.id); setShowPayrollModal(true); }}>
                                            Payroll
                                        </button>
                                        <button className="btn btn-info me-2" onClick={() => { setSelectedEmpId(emp.id); setShowAssets(true); }}>Assets</button>
                                        <button className="btn btn-warning me-2" onClick={() => editEmployee(emp)}>Update</button>
                                        <button className="btn btn-danger" onClick={() => deleteEmployee(emp.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {activeSection === "leave" && (
                <>
                    <h2>Leave Requests</h2>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th><th>Employee ID</th><th>Start Date</th><th>End Date</th>
                                <th>Leave Type</th><th>Reason</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveRequests.map((leave) => (
                                <tr key={leave.id}>
                                    <td>{leave.id}</td><td>{leave.employeeId}</td><td>{leave.startDate}</td><td>{leave.endDate}</td>
                                    <td>{leave.leaveType}</td><td>{leave.reason}</td><td>{leave.status}</td>
                                    <td>
                                        <button className="btn btn-success me-2" onClick={() => handleApprove(leave.id)}>Approve</button>
                                        <input type="text" placeholder="Reject Reason" className="form-control mb-2" onChange={(e) => setRejectReason({ ...rejectReason, [leave.id]: e.target.value })} />
                                        <button className="btn btn-danger" onClick={() => handleReject(leave.id)}>Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {showAssets && selectedEmpId && (
                <AssetsModal empId={selectedEmpId} onClose={() => { setShowAssets(false); setSelectedEmpId(null); }} />
            )}

            {/* NEW PAYROLL MODAL COMPONENT RENDER */}
            {showPayrollModal && payrollEmpId && (
                <PayrollManagementModal 
                    empId={payrollEmpId} 
                    employees={employees} 
                    onClose={() => { setShowPayrollModal(false); setPayrollEmpId(null); }} 
                    onSave={handleSavePayroll} 
                />
            )}

            {/* PAGINATION */}
            {activeSection === "dashboard" && employees.length > 0 && (
                <div className="pagination-container">
                    <button className="pagination-icon-btn" onClick={goToPrevPage} disabled={currentPage === 1}>◀</button>
                    <span className="pagination-text">{currentPage} / {totalPages}</span>
                    <button className="pagination-icon-btn" onClick={goToNextPage} disabled={currentPage === totalPages}>▶</button>
                </div>
            )}
        </div>
    );
}

// ==========================================
// PAYROLL CALCULATION MODAL SUB-COMPONENT
// ==========================================
const PayrollManagementModal = ({ empId, employees, onClose, onSave }) => {
    const targetWorker = employees.find(e => e.id === empId);
    
    // Check if payroll already exists to pre-fill the form
    const existingPayroll = targetWorker?.payroll || {};

    const [inputs, setInputs] = useState({ 
        basicSalary: existingPayroll.basicSalary || '', 
        hra: existingPayroll.hra || '' 
    });
    
    const [calculations, setCalculations] = useState({
        gross: 0, pf: 0, esi: 0, pt: 0, insurance: 0, totalDeductions: 0, net: 0
    });

    const handleInputChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const basic = parseFloat(inputs.basicSalary) || 0;
        const hra = parseFloat(inputs.hra) || 0;

        if (basic <= 0) return;

        const allowances = 1250; 
        const grossSalary = basic + hra + allowances;

        const pf = Math.round(basic * 0.12);
        const esi = grossSalary <= 21000 ? Math.round(grossSalary * 0.0075) : 0;
        const pt = basic >= 15000 ? 200 : 150;
        const insurance = 350;

        const totalDeductions = pf + esi + pt + insurance;
        const netSalary = grossSalary - totalDeductions;

        setCalculations({
            gross: grossSalary, pf, esi, pt, insurance, totalDeductions, net: netSalary
        });
    }, [inputs]);

    const handleSubmitPayroll = () => {
        const payload = {
            basicSalary: parseFloat(inputs.basicSalary),
            hra: parseFloat(inputs.hra),
            grossSalary: calculations.gross,
            pf: calculations.pf,
            esi: calculations.esi,
            pt: calculations.pt,
            insurance: calculations.insurance,
            totalDeductions: calculations.totalDeductions,
            netSalary: calculations.net
        };
        onSave(empId, payload);
    };

    return (
        <div style={modalStyles.backdrop}>
            <div style={modalStyles.modal}>
                <h3>Payroll Generation - {targetWorker?.name}</h3>
                <p style={{color: '#64748b'}}>Designation: {targetWorker?.designation}</p>
                
                <div style={modalStyles.inputRow}>
                    <div style={{flex: 1}}>
                        <label style={modalStyles.label}>Basic Salary (₹)</label>
                        <input type="number" name="basicSalary" value={inputs.basicSalary} onChange={handleInputChange} style={modalStyles.input} placeholder="e.g. 25000"/>
                    </div>
                    <div style={{flex: 1}}>
                        <label style={modalStyles.label}>HRA (₹)</label>
                        <input type="number" name="hra" value={inputs.hra} onChange={handleInputChange} style={modalStyles.input} placeholder="e.g. 10000"/>
                    </div>
                </div>

                <div style={modalStyles.calcSummaryContainer}>
                    <h4 style={{marginTop: 0, marginBottom: '10px', fontSize: '14px', color: '#475569'}}>Calculated Components</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                        <div style={modalStyles.flexBetween}><span>Gross Salary:</span> <strong>₹{calculations.gross}</strong></div>
                        <div style={modalStyles.flexBetween}><span>Provident Fund (PF):</span> <strong>₹{calculations.pf}</strong></div>
                        <div style={modalStyles.flexBetween}><span>ESI Contribution:</span> <strong>₹{calculations.esi}</strong></div>
                        <div style={modalStyles.flexBetween}><span>Professional Tax (PT):</span> <strong>₹{calculations.pt}</strong></div>
                        <div style={modalStyles.flexBetween}><span>Insurance:</span> <strong>₹{calculations.insurance}</strong></div>
                        <div style={{...modalStyles.flexBetween, borderTop: '1px solid #cbd5e1', paddingTop: '4px'}}><span>Total Deductions:</span> <strong style={{color: '#ef4444'}}>₹{calculations.totalDeductions}</strong></div>
                        <div style={{...modalStyles.flexBetween, borderTop: '1px solid #cbd5e1', paddingTop: '4px'}}><span>Net Take-home:</span> <strong style={{color: '#10b981', fontSize: '16px'}}>₹{calculations.net}</strong></div>
                    </div>
                </div>

                <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                    <button className="btn btn-primary" onClick={handleSubmitPayroll} disabled={!inputs.basicSalary}>Save & Authorize</button>
                    <button className="btn btn-danger" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const modalStyles = {
    backdrop: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
    modal: { background: '#fff', padding: '30px', borderRadius: '12px', width: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
    inputRow: { display: 'flex', gap: '15px', marginBottom: '20px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' },
    calcSummaryContainer: { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' },
    flexBetween: { display: 'flex', justifyContent: 'space-between' }
};

export default HrDashboard;