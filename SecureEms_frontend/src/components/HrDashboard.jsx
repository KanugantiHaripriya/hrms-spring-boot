// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import api, { getAllLeaves, approveLeave, rejectLeave } from "../services/api";
// import AssetsModal from "./AssetsModal";
// import AnalyticalDashboard from "./AnalyticalDashboard"; 
// import "../styles/hrDashboard.css";

// function HrDashboard() {
//     const navigate = useNavigate();
//     const fileInputRef = useRef(null);
    
//     const [isUploading, setIsUploading] = useState(false);
    
//     const [showPayrollModal, setShowPayrollModal] = useState(false);
//     const [payrollEmpId, setPayrollEmpId] = useState(null);
    
//     const [selectedEmpId, setSelectedEmpId] = useState(null);
//     const [showAssets, setShowAssets] = useState(false);
//     const [employees, setEmployees] = useState([]);
//     const [editingId, setEditingId] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [leaveRequests, setLeaveRequests] = useState([]);
//     const [rejectReason, setRejectReason] = useState({});
    
//     const [activeSection, setActiveSection] = useState("dashboard");
//     const [currentPage, setCurrentPage] = useState(1);
//     const employeesPerPage = 6;

//     const [employee, setEmployee] = useState({
//         name: "", email: "", age: "", bloodGroup: "",
//         city: "", gender: "", pincode: "", designation: "",
//         password: "", active: true
//     });

//     const token = localStorage.getItem("token");

//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("hrEmail");
//         navigate("/");
//     };

//     const fetchEmployees = async () => {
//         try {
//             const response = await api.get("/hr/all", { headers: { Authorization: `Bearer ${token}` } });
//             setEmployees(response.data);
//         } catch (error) { console.log(error); }
//     };

//     const fetchLeaveRequests = async () => {
//         try {
//             const response = await getAllLeaves();
//             setLeaveRequests(response.data);
//         } catch (error) { console.log(error); }
//     };

//     // ==========================================
//     // SECURITY FIX: Prevent 'Bearer null' error
//     // ==========================================
//     useEffect(() => {
//         if (!token || token === "undefined" || token === "null") {
//             handleLogout();
//             return;
//         }
//         fetchEmployees();
//         fetchLeaveRequests();
//     }, [token]);

//     const handleChange = (e) => setEmployee({ ...employee, [e.target.name]: e.target.value });

//     const editEmployee = (emp) => {
//         setEmployee({ ...emp, password: "" });
//         setEditingId(emp.id);
//         setShowAddForm(true);
//     };

//     const addEmployee = async () => {
//         try {
//             await api.post("/hr/add", employee, { headers: { Authorization: `Bearer ${token}` } });
//             setShowAddForm(false);
//             fetchEmployees();
//         } catch (error) { alert(error.response?.data?.message || "Failed To Add Employee"); }
//     };

//     const updateEmployee = async () => {
//         try {
//             await api.put(`/hr/update/${editingId}`, employee, { headers: { Authorization: `Bearer ${token}` } });
//             setEditingId(null);
//             setShowAddForm(false);
//             fetchEmployees();
//         } catch (error) { alert("Update Failed"); }
//     };

//     const deleteEmployee = async (id) => {
//         if(window.confirm("Permanently remove this employee?")) {
//             try {
//                 await api.delete(`/hr/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//                 fetchEmployees();
//             } catch (error) { alert("Delete Failed"); }
//         }
//     };

//     const handleSavePayroll = async (empId, payrollPayload) => {
//         try {
//             await api.put(`/api/hr/payroll/update/${empId}`, payrollPayload, { headers: { Authorization: `Bearer ${token}` } });
//             setShowPayrollModal(false);
//             fetchEmployees(); 
//         } catch (error) { alert("Failed to update payroll."); }
//     };

//     const handleApprove = async (id) => {
//         try { await approveLeave(id); fetchLeaveRequests(); } 
//         catch (error) { alert("Approval Failed"); }
//     };

//     const handleReject = async (id) => {
//         try { await rejectLeave(id, rejectReason[id] || "HR Decision"); fetchLeaveRequests(); } 
//         catch (error) { alert("Rejection Failed"); }
//     };

//     const triggerFileExplorer = () => fileInputRef.current.click();

//     const handleBulkUploadFile = async (event) => {
//         const file = event.target.files[0];
//         if (!file) return;
//         const formData = new FormData();
//         formData.append("file", file);
//         setIsUploading(true);
//         try {
//             await api.post("/api/employees/bulk-upload", formData, {
//                 headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
//             });
//             fetchEmployees();
//         } catch (error) { alert("Upload Failed."); } 
//         finally { setIsUploading(false); event.target.value = ""; }
//     };

//     const indexOfLastEmployee = currentPage * employeesPerPage;
//     const currentEmployees = employees.slice(indexOfLastEmployee - employeesPerPage, indexOfLastEmployee);
//     const totalPages = Math.ceil(employees.length / employeesPerPage);

//     // If there is no token, don't render the dashboard (avoids flicker before redirect)
//     if (!token || token === "undefined" || token === "null") return null;

//     return (
//         <div className="premium-layout">
//             <aside className="premium-sidebar">
//                 <div className="sidebar-logo">HRMS</div>
//                 <nav className="sidebar-menu">
//                     <button className={`menu-item ${activeSection === "dashboard" ? "active" : ""}`} onClick={() => setActiveSection("dashboard")}>
//                         <span className="menu-dot"></span> Directory
//                     </button>
//                     <button className={`menu-item ${activeSection === "leave" ? "active" : ""}`} onClick={() => setActiveSection("leave")}>
//                         <span className="menu-dot"></span> Time Off & Intel
//                     </button>
//                     {/* 👇 NEW ANALYTICS LINK 👇 */}
//                     <button className={`menu-item ${activeSection === "analytics" ? "active" : ""}`} onClick={() => setActiveSection("analytics")}>
//                         <span className="menu-dot"></span> Analytics
//                     </button>

//                 </nav>
//                 <div className="sidebar-bottom">
//                     <button className="menu-item danger" onClick={handleLogout}>Log Out</button>
//                 </div>
//             </aside>

//             <main className="premium-main">
//                 <header className="premium-header">
//                     <div>
//                         <h2>{activeSection === "dashboard" ? "Team Directory" : "Time Off & Analytics"}</h2>
//                         <p className="subtitle">
//                             {activeSection === "dashboard" ? "Manage your organization's people and operations." : "Process requests and monitor real-time workforce metrics."}
//                         </p>
//                     </div>
//                     {activeSection === "dashboard" && (
//                         <div className="header-actions">
//                             <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xlsx, .xls" onChange={handleBulkUploadFile} />
//                             <button className="premium-btn-outline" onClick={triggerFileExplorer} disabled={isUploading}>
//                                 {isUploading ? "Processing..." : "Import CSV"}
//                             </button>
//                             <button className="premium-btn-dark" onClick={() => setShowAddForm(!showAddForm)}>
//                                 {showAddForm ? "Cancel Entry" : "+ Add Member"}
//                             </button>
//                         </div>
//                     )}
//                 </header>

//                 <div className="premium-content">
//                     {activeSection === "dashboard" && (
//                         <>
//                             {showAddForm && (
//                                 <div className="premium-surface form-surface">
//                                     <h3 className="surface-title">{editingId ? "Edit Profile" : "New Team Member"}</h3>
//                                     <div className="premium-grid">
//                                         <div className="input-group"><label>Full Name</label><input type="text" name="name" value={employee.name} onChange={handleChange} /></div>
//                                         <div className="input-group"><label>Email</label><input type="email" name="email" value={employee.email} onChange={handleChange} /></div>
//                                         <div className="input-group"><label>Designation</label><input type="text" name="designation" value={employee.designation} onChange={handleChange} /></div>
//                                         <div className="input-group"><label>City</label><input type="text" name="city" value={employee.city} onChange={handleChange} /></div>
//                                         <div className="input-group"><label>Age</label><input type="number" name="age" value={employee.age} onChange={handleChange} /></div>
//                                         <div className="input-group"><label>Gender</label><input type="text" name="gender" value={employee.gender} onChange={handleChange} /></div>
//                                         <div className="input-group"><label>Blood Type</label><input type="text" name="bloodGroup" value={employee.bloodGroup} onChange={handleChange} /></div>
//                                         <div className="input-group"><label>Pincode</label><input type="text" name="pincode" value={employee.pincode} onChange={handleChange} /></div>
//                                         <div className="input-group span-2"><label>Temporary Password</label><input type="password" name="password" value={employee.password} onChange={handleChange} placeholder={editingId ? "Leave blank to keep current password" : ""} /></div>
//                                     </div>
//                                     <div className="form-footer">
//                                         <button className="premium-btn-dark" onClick={editingId ? updateEmployee : addEmployee}>
//                                             {editingId ? "Save Changes" : "Create Profile"}
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}

//                             <div className="premium-surface">
//                                 <table className="premium-table">
//                                     <thead>
//                                         <tr>
//                                             <th>Member</th>
//                                             <th>Role & Location</th>
//                                             <th>Compensation</th>
//                                             <th className="text-right">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {currentEmployees.map((emp) => (
//                                             <tr key={emp.id}>
//                                                 <td>
//                                                     <div className="cell-primary">{emp.name}</div>
//                                                     <div className="cell-secondary">{emp.email}</div>
//                                                 </td>
//                                                 <td>
//                                                     <div className="cell-primary">{emp.designation}</div>
//                                                     <div className="cell-secondary">{emp.city}</div>
//                                                 </td>
//                                                 <td>
//                                                     {emp.payroll ? (
//                                                         <div className="salary-text">₹{emp.payroll.netSalary}</div>
//                                                     ) : (
//                                                         <div className="cell-secondary italic">Pending Setup</div>
//                                                     )}
//                                                 </td>
//                                                 <td className="text-right">
//                                                     <div className="table-actions">
//                                                         <button className="text-link" onClick={() => { setPayrollEmpId(emp.id); setShowPayrollModal(true); }}>Finance</button>
//                                                         <button className="text-link" onClick={() => { setSelectedEmpId(emp.id); setShowAssets(true); }}>Assets</button>
//                                                         <button className="text-link" onClick={() => editEmployee(emp)}>Edit</button>
//                                                         <button className="text-link danger" onClick={() => deleteEmployee(emp.id)}>Remove</button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
                                
//                                 {employees.length > 0 && (
//                                     <div className="premium-pagination">
//                                         <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
//                                         <span className="page-info">Page {currentPage} of {totalPages}</span>
//                                         <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
//                                     </div>
//                                 )}
//                             </div>
//                         </>
//                     )}

//                     {activeSection === "leave" && (
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
//                             <div className="premium-surface">
//                                 <table className="premium-table">
//                                     <thead>
//                                         <tr>
//                                             <th>Employee ID</th>
//                                             <th>Leave Details</th>
//                                             <th>Status</th>
//                                             <th className="text-right">Review</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {leaveRequests.map((leave) => (
//                                             <tr key={leave.id}>
//                                                 <td className="cell-primary">EMP-{leave.employeeId}</td>
//                                                 <td>
//                                                     <div className="cell-primary">{leave.leaveType}</div>
//                                                     <div className="cell-secondary">{leave.startDate} → {leave.endDate}</div>
//                                                     <div className="cell-secondary italic mt-1">"{leave.reason}"</div>
//                                                 </td>
//                                                 <td>
//                                                     <span className={`pill-badge ${leave.status?.toLowerCase()}`}>
//                                                         <span className="dot"></span> {leave.status}
//                                                     </span>
//                                                 </td>
//                                                 <td className="text-right">
//                                                     {leave.status === 'PENDING' ? (
//                                                         <div className="review-actions">
//                                                             <button className="text-link success" onClick={() => handleApprove(leave.id)}>Approve</button>
//                                                             <div className="reject-input-group">
//                                                                 <input type="text" placeholder="Reason..." className="mini-input" onChange={(e) => setRejectReason({ ...rejectReason, [leave.id]: e.target.value })} />
//                                                                 <button className="text-link danger" onClick={() => handleReject(leave.id)}>Reject</button>
//                                                             </div>
//                                                         </div>
//                                                     ) : (
//                                                         <span className="cell-secondary">Resolved</span>
//                                                     )}
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>

//                             <AnalyticalDashboard />
                            
//                         </div>
//                     )}
//                 </div>
//             </main>

//             {showAssets && selectedEmpId && (
//                 <AssetsModal empId={selectedEmpId} onClose={() => { setShowAssets(false); setSelectedEmpId(null); }} />
//             )}
            
//             {showPayrollModal && payrollEmpId && (
//                 <PayrollManagementModal 
//                     empId={payrollEmpId} employees={employees} 
//                     onClose={() => { setShowPayrollModal(false); setPayrollEmpId(null); }} 
//                     onSave={handleSavePayroll} 
//                 />
//             )}
//         </div>
//     );
// }

// const PayrollManagementModal = ({ empId, employees, onClose, onSave }) => {
//     const targetWorker = employees.find(e => e.id === empId);
//     const existing = targetWorker?.payroll || {};
    
//     const [inputs, setInputs] = useState({ 
//         basicSalary: existing.basicSalary || '', 
//         hra: existing.hra || '' 
//     });
    
//     const [calc, setCalc] = useState({ 
//         allowances: 1250, gross: 0, pf: 0, esi: 0, pt: 0, insurance: 350, totalDeductions: 0, net: 0 
//     });

//     const handleChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

//     useEffect(() => {
//         const basic = parseFloat(inputs.basicSalary) || 0;
//         const hra = parseFloat(inputs.hra) || 0;
        
//         if (basic <= 0) return;

//         const allowances = 1250;
//         const gross = basic + hra + allowances;
        
//         const pf = Math.round(basic * 0.12);
//         const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
//         const pt = basic >= 15000 ? 200 : 150;
//         const insurance = 350;
        
//         const totalDeductions = pf + esi + pt + insurance;

//         setCalc({ 
//             allowances, gross, pf, esi, pt, insurance, 
//             totalDeductions, net: gross - totalDeductions 
//         });
//     }, [inputs]);

//     return (
//         <div className="premium-modal-backdrop">
//             <div className="premium-modal">
//                 <div className="modal-header">
//                     <div>
//                         <h3>Compensation Package</h3>
//                         <p>{targetWorker?.name} • {targetWorker?.designation}</p>
//                     </div>
//                     <button className="close-icon-btn" onClick={onClose}>✕</button>
//                 </div>
                
//                 <div className="modal-input-row">
//                     <div className="input-group">
//                         <label>Base Salary (₹)</label>
//                         <input type="number" name="basicSalary" value={inputs.basicSalary} onChange={handleChange} placeholder="e.g. 25000" />
//                     </div>
//                     <div className="input-group">
//                         <label>HRA (₹)</label>
//                         <input type="number" name="hra" value={inputs.hra} onChange={handleChange} placeholder="e.g. 10000" />
//                     </div>
//                 </div>

//                 <div className="receipt-box">
//                     <div className="receipt-row text-muted"><span>Basic + HRA</span><span>₹{(parseFloat(inputs.basicSalary)||0) + (parseFloat(inputs.hra)||0)}</span></div>
//                     <div className="receipt-row text-muted"><span>Fixed Allowances</span><span>+ ₹{calc.allowances}</span></div>
//                     <div className="receipt-row gross-line" style={{ marginTop: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', color: '#0f172a', fontWeight: '500' }}>
//                         <span>Gross Earnings</span><span>₹{calc.gross}</span>
//                     </div>
                    
//                     <div className="receipt-row text-muted" style={{ marginTop: '8px' }}><span>Provident Fund (PF)</span><span>- ₹{calc.pf}</span></div>
//                     <div className="receipt-row text-muted"><span>Tax & Insurance (PT, ESI, Ins)</span><span>- ₹{calc.pt + calc.esi + calc.insurance}</span></div>
                    
//                     <div className="receipt-divider"></div>
//                     <div className="receipt-row total"><span>Net Take-Home</span><span>₹{calc.net}</span></div>
//                 </div>

//                 <div className="modal-footer">
//                     <button className="premium-btn-outline" onClick={onClose}>Cancel</button>
//                     <button 
//                         className="premium-btn-dark" 
//                         onClick={() => onSave(empId, { 
//                             basicSalary: parseFloat(inputs.basicSalary), 
//                             hra: parseFloat(inputs.hra) 
//                         })} 
//                         disabled={!inputs.basicSalary}
//                     >
//                         Save & Authorize
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HrDashboard;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api, { getAllLeaves, approveLeave, rejectLeave } from "../services/api";
import AssetsModal from "./AssetsModal";
import AnalyticalDashboard from "./AnalyticalDashboard"; 
import "../styles/hrDashboard.css";

function HrDashboard() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [isUploading, setIsUploading] = useState(false);
    
    const [showPayrollModal, setShowPayrollModal] = useState(false);
    const [payrollEmpId, setPayrollEmpId] = useState(null);
    
    const [selectedEmpId, setSelectedEmpId] = useState(null);
    const [showAssets, setShowAssets] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [rejectReason, setRejectReason] = useState({});
    
    // Controls which section is visible: "dashboard", "leave", or "analytics"
    const [activeSection, setActiveSection] = useState("dashboard");
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 6;

    const [employee, setEmployee] = useState({
        name: "", email: "", age: "", bloodGroup: "",
        city: "", gender: "", pincode: "", designation: "",
        password: "", active: true
    });

    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("hrEmail");
        navigate("/");
    };

    const fetchEmployees = async () => {
        try {
            const response = await api.get("/hr/all", { headers: { Authorization: `Bearer ${token}` } });
            setEmployees(response.data);
        } catch (error) { console.log(error); }
    };

    const fetchLeaveRequests = async () => {
        try {
            const response = await getAllLeaves();
            setLeaveRequests(response.data);
        } catch (error) { console.log(error); }
    };

    // SECURITY FIX: Prevent 'Bearer null' error
    useEffect(() => {
        if (!token || token === "undefined" || token === "null") {
            handleLogout();
            return;
        }
        fetchEmployees();
        fetchLeaveRequests();
    }, [token]);

    const handleChange = (e) => setEmployee({ ...employee, [e.target.name]: e.target.value });

    const editEmployee = (emp) => {
        setEmployee({ ...emp, password: "" });
        setEditingId(emp.id);
        setShowAddForm(true);
    };

    const addEmployee = async () => {
        try {
            await api.post("/hr/add", employee, { headers: { Authorization: `Bearer ${token}` } });
            setShowAddForm(false);
            fetchEmployees();
        } catch (error) { alert(error.response?.data?.message || "Failed To Add Employee"); }
    };

    const updateEmployee = async () => {
        try {
            await api.put(`/hr/update/${editingId}`, employee, { headers: { Authorization: `Bearer ${token}` } });
            setEditingId(null);
            setShowAddForm(false);
            fetchEmployees();
        } catch (error) { alert("Update Failed"); }
    };

    const deleteEmployee = async (id) => {
        if(window.confirm("Permanently remove this employee?")) {
            try {
                await api.delete(`/hr/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchEmployees();
            } catch (error) { alert("Delete Failed"); }
        }
    };

    const handleSavePayroll = async (empId, payrollPayload) => {
        try {
            await api.put(`/api/hr/payroll/update/${empId}`, payrollPayload, { headers: { Authorization: `Bearer ${token}` } });
            setShowPayrollModal(false);
            fetchEmployees(); 
        } catch (error) { alert("Failed to update payroll."); }
    };

    const handleApprove = async (id) => {
        try { await approveLeave(id); fetchLeaveRequests(); } 
        catch (error) { alert("Approval Failed"); }
    };

    const handleReject = async (id) => {
        try { await rejectLeave(id, rejectReason[id] || "HR Decision"); fetchLeaveRequests(); } 
        catch (error) { alert("Rejection Failed"); }
    };

    const triggerFileExplorer = () => fileInputRef.current.click();

    const handleBulkUploadFile = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        try {
            await api.post("/api/employees/bulk-upload", formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            });
            fetchEmployees();
        } catch (error) { alert("Upload Failed."); } 
        finally { setIsUploading(false); event.target.value = ""; }
    };

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const currentEmployees = employees.slice(indexOfLastEmployee - employeesPerPage, indexOfLastEmployee);
    const totalPages = Math.ceil(employees.length / employeesPerPage);

    // If there is no token, don't render the dashboard (avoids flicker before redirect)
    if (!token || token === "undefined" || token === "null") return null;

    return (
        <div className="premium-layout">
            
            {/* SIDEBAR */}
            <aside className="premium-sidebar">
                <div className="sidebar-logo">HRMS</div>
                <nav className="sidebar-menu">
                    <button className={`menu-item ${activeSection === "dashboard" ? "active" : ""}`} onClick={() => setActiveSection("dashboard")}>
                        <span className="menu-dot"></span> Directory
                    </button>
                    <button className={`menu-item ${activeSection === "leave" ? "active" : ""}`} onClick={() => setActiveSection("leave")}>
                        <span className="menu-dot"></span> Time Off
                    </button>
                    <button className={`menu-item ${activeSection === "analytics" ? "active" : ""}`} onClick={() => setActiveSection("analytics")}>
                        <span className="menu-dot"></span> Analytics
                    </button>
                </nav>
                <div className="sidebar-bottom">
                    <button className="menu-item danger" onClick={handleLogout}>Log Out</button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="premium-main">
                <header className="premium-header">
                    <div>
                        <h2>
                            {activeSection === "dashboard" ? "Team Directory" : 
                             activeSection === "leave" ? "Time Off Requests" : 
                             "System Analytics"}
                        </h2>
                        <p className="subtitle">
                            {activeSection === "dashboard" ? "Manage your organization's people and operations." : 
                             activeSection === "leave" ? "Process time-off requests." : 
                             "Real-time metrics and workforce intel."}
                        </p>
                    </div>
                    {activeSection === "dashboard" && (
                        <div className="header-actions">
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xlsx, .xls" onChange={handleBulkUploadFile} />
                            <button className="premium-btn-outline" onClick={triggerFileExplorer} disabled={isUploading}>
                                {isUploading ? "Processing..." : "Import CSV"}
                            </button>
                            <button className="premium-btn-dark" onClick={() => setShowAddForm(!showAddForm)}>
                                {showAddForm ? "Cancel Entry" : "+ Add Member"}
                            </button>
                        </div>
                    )}
                </header>

                <div className="premium-content">
                    
                    {/* DIRECTORY SECTION */}
                    {activeSection === "dashboard" && (
                        <>
                            {showAddForm && (
                                <div className="premium-surface form-surface">
                                    <h3 className="surface-title">{editingId ? "Edit Profile" : "New Team Member"}</h3>
                                    <div className="premium-grid">
                                        <div className="input-group"><label>Full Name</label><input type="text" name="name" value={employee.name} onChange={handleChange} /></div>
                                        <div className="input-group"><label>Email</label><input type="email" name="email" value={employee.email} onChange={handleChange} /></div>
                                        <div className="input-group"><label>Designation</label><input type="text" name="designation" value={employee.designation} onChange={handleChange} /></div>
                                        <div className="input-group"><label>City</label><input type="text" name="city" value={employee.city} onChange={handleChange} /></div>
                                        <div className="input-group"><label>Age</label><input type="number" name="age" value={employee.age} onChange={handleChange} /></div>
                                        <div className="input-group"><label>Gender</label><input type="text" name="gender" value={employee.gender} onChange={handleChange} /></div>
                                        <div className="input-group"><label>Blood Type</label><input type="text" name="bloodGroup" value={employee.bloodGroup} onChange={handleChange} /></div>
                                        <div className="input-group"><label>Pincode</label><input type="text" name="pincode" value={employee.pincode} onChange={handleChange} /></div>
                                        <div className="input-group span-2"><label>Temporary Password</label><input type="password" name="password" value={employee.password} onChange={handleChange} placeholder={editingId ? "Leave blank to keep current password" : ""} /></div>
                                    </div>
                                    <div className="form-footer">
                                        <button className="premium-btn-dark" onClick={editingId ? updateEmployee : addEmployee}>
                                            {editingId ? "Save Changes" : "Create Profile"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="premium-surface">
                                <table className="premium-table">
                                    <thead>
                                        <tr>
                                            <th>Member</th>
                                            <th>Role & Location</th>
                                            <th>Compensation</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentEmployees.map((emp) => (
                                            <tr key={emp.id}>
                                                <td>
                                                    <div className="cell-primary">{emp.name}</div>
                                                    <div className="cell-secondary">{emp.email}</div>
                                                </td>
                                                <td>
                                                    <div className="cell-primary">{emp.designation}</div>
                                                    <div className="cell-secondary">{emp.city}</div>
                                                </td>
                                                <td>
                                                    {emp.payroll ? (
                                                        <div className="salary-text">₹{emp.payroll.netSalary}</div>
                                                    ) : (
                                                        <div className="cell-secondary italic">Pending Setup</div>
                                                    )}
                                                </td>
                                                <td className="text-right">
                                                    <div className="table-actions">
                                                        <button className="text-link" onClick={() => { setPayrollEmpId(emp.id); setShowPayrollModal(true); }}>Finance</button>
                                                        <button className="text-link" onClick={() => { setSelectedEmpId(emp.id); setShowAssets(true); }}>Assets</button>
                                                        <button className="text-link" onClick={() => editEmployee(emp)}>Edit</button>
                                                        <button className="text-link danger" onClick={() => deleteEmployee(emp.id)}>Remove</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                {employees.length > 0 && (
                                    <div className="premium-pagination">
                                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
                                        <span className="page-info">Page {currentPage} of {totalPages}</span>
                                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* LEAVE SECTION */}
                    {activeSection === "leave" && (
                        <div className="premium-surface">
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Employee ID</th>
                                        <th>Leave Details</th>
                                        <th>Status</th>
                                        <th className="text-right">Review</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaveRequests.map((leave) => (
                                        <tr key={leave.id}>
                                            <td className="cell-primary">EMP-{leave.employeeId}</td>
                                            <td>
                                                <div className="cell-primary">{leave.leaveType}</div>
                                                <div className="cell-secondary">{leave.startDate} → {leave.endDate}</div>
                                                <div className="cell-secondary italic mt-1">"{leave.reason}"</div>
                                            </td>
                                            <td>
                                                <span className={`pill-badge ${leave.status?.toLowerCase()}`}>
                                                    <span className="dot"></span> {leave.status}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                {leave.status === 'PENDING' ? (
                                                    <div className="review-actions">
                                                        <button className="text-link success" onClick={() => handleApprove(leave.id)}>Approve</button>
                                                        <div className="reject-input-group">
                                                            <input type="text" placeholder="Reason..." className="mini-input" onChange={(e) => setRejectReason({ ...rejectReason, [leave.id]: e.target.value })} />
                                                            <button className="text-link danger" onClick={() => handleReject(leave.id)}>Reject</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="cell-secondary">Resolved</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ANALYTICS SECTION */}
                    {activeSection === "analytics" && (
                        <div className="analytics-wrapper" style={{ width: '100%' }}>
                            {/* The 'key' forces Recharts to recalculate width when sidebar changes */}
                            <AnalyticalDashboard key={activeSection} />
                        </div>
                    )}

                </div>
            </main>

            {/* MODALS */}
            {showAssets && selectedEmpId && (
                <AssetsModal empId={selectedEmpId} onClose={() => { setShowAssets(false); setSelectedEmpId(null); }} />
            )}
            
            {showPayrollModal && payrollEmpId && (
                <PayrollManagementModal 
                    empId={payrollEmpId} employees={employees} 
                    onClose={() => { setShowPayrollModal(false); setPayrollEmpId(null); }} 
                    onSave={handleSavePayroll} 
                />
            )}
        </div>
    );
}

// PAYROLL MODAL COMPONENT
const PayrollManagementModal = ({ empId, employees, onClose, onSave }) => {
    const targetWorker = employees.find(e => e.id === empId);
    const existing = targetWorker?.payroll || {};
    
    const [inputs, setInputs] = useState({ 
        basicSalary: existing.basicSalary || '', 
        hra: existing.hra || '' 
    });
    
    const [calc, setCalc] = useState({ 
        allowances: 1250, gross: 0, pf: 0, esi: 0, pt: 0, insurance: 350, totalDeductions: 0, net: 0 
    });

    const handleChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

    useEffect(() => {
        const basic = parseFloat(inputs.basicSalary) || 0;
        const hra = parseFloat(inputs.hra) || 0;
        if (basic <= 0) return;
        const allowances = 1250;
        const gross = basic + hra + allowances;
        const pf = Math.round(basic * 0.12);
        const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
        const pt = basic >= 15000 ? 200 : 150;
        const insurance = 350;
        const totalDeductions = pf + esi + pt + insurance;
        setCalc({ allowances, gross, pf, esi, pt, insurance, totalDeductions, net: gross - totalDeductions });
    }, [inputs]);

    return (
        <div className="premium-modal-backdrop">
            <div className="premium-modal">
                <div className="modal-header">
                    <div>
                        <h3>Compensation Package</h3>
                        <p>{targetWorker?.name} • {targetWorker?.designation}</p>
                    </div>
                    <button className="close-icon-btn" onClick={onClose}>✕</button>
                </div>
                
                <div className="modal-input-row">
                    <div className="input-group">
                        <label>Base Salary (₹)</label>
                        <input type="number" name="basicSalary" value={inputs.basicSalary} onChange={handleChange} placeholder="e.g. 25000" />
                    </div>
                    <div className="input-group">
                        <label>HRA (₹)</label>
                        <input type="number" name="hra" value={inputs.hra} onChange={handleChange} placeholder="e.g. 10000" />
                    </div>
                </div>

                <div className="receipt-box">
                    <div className="receipt-row text-muted"><span>Basic + HRA</span><span>₹{(parseFloat(inputs.basicSalary)||0) + (parseFloat(inputs.hra)||0)}</span></div>
                    <div className="receipt-row text-muted"><span>Fixed Allowances</span><span>+ ₹{calc.allowances}</span></div>
                    <div className="receipt-row gross-line" style={{ marginTop: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', color: '#0f172a', fontWeight: '500' }}>
                        <span>Gross Earnings</span><span>₹{calc.gross}</span>
                    </div>
                    <div className="receipt-row text-muted" style={{ marginTop: '8px' }}><span>Provident Fund (PF)</span><span>- ₹{calc.pf}</span></div>
                    <div className="receipt-row text-muted"><span>Tax & Insurance (PT, ESI, Ins)</span><span>- ₹{calc.pt + calc.esi + calc.insurance}</span></div>
                    <div className="receipt-divider"></div>
                    <div className="receipt-row total"><span>Net Take-Home</span><span>₹{calc.net}</span></div>
                </div>

                <div className="modal-footer">
                    <button className="premium-btn-outline" onClick={onClose}>Cancel</button>
                    <button className="premium-btn-dark" onClick={() => onSave(empId, { basicSalary: parseFloat(inputs.basicSalary), hra: parseFloat(inputs.hra) })} disabled={!inputs.basicSalary}>
                        Save & Authorize
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HrDashboard;