import { useEffect, useState } from "react";
import api, { submitLeave, getLeaveStats } from "../services/api";
import { jsPDF } from "jspdf";
import "../styles/dashboard.css";

function Dashboard() {
    const [employee, setEmployee] = useState(null);
    const [showLeaveForm, setShowLeaveForm] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [stats, setStats] = useState(null);

    // =========================
    // PAYSLIP PDF STATES
    // =========================
    const [pdfUrl, setPdfUrl] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const [leaveData, setLeaveData] = useState({
        startDate: "", endDate: "", leaveType: "", reason: ""
    });  

    // Re-enabled the token retrieval for real API calls
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    useEffect(() => {
        // Only attempt to fetch if we have an email
        if (email) {
            fetchProfile();
        }
    }, [email]);

    const fetchProfile = async () => {
        try {
            // Real API Call restored
            const response = await api.get(`/employee/profile/${email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // This sets your real database data!
            setEmployee(response.data);
            
        } catch (error) {
            console.log("Error fetching profile:", error);
            // alert("Failed To Fetch Profile");
        }
    };

    const handleLeaveChange = (e) => {
        setLeaveData({
            ...leaveData,
            [e.target.name]: e.target.value
        });
    };

    const submitLeaveRequest = async () => {
        try {
            // Real API Call restored
            await submitLeave({ employeeId: employee.id, ...leaveData });
            
            alert("Leave Request Submitted Successfully");
            setLeaveData({ startDate: "", endDate: "", leaveType: "", reason: "" });
            setShowLeaveForm(false);
        } catch (error) {
            console.log(error);
            alert("Failed To Submit Leave");
        }
    };

    const fetchStats = async () => {
        try {
            // Real API Call restored
            const response = await getLeaveStats(employee.id);
            setStats(response.data);
            
        } catch (error) {
            console.log(error);
            alert("Failed To Fetch Leave Stats");
        }
    };

    const generatePayslipPDF = () => {
        const payroll = employee?.payroll;
        if (!payroll) {
            alert("No payroll data found. Please contact HR.");
            return;
        }

        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        // Branding Banner Configurations
        doc.setFillColor(17, 24, 39);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('Helvetica', 'bold');
        doc.text("SECURE EMS SOFTWARE CORP", 15, 18);
        doc.setFontSize(10);
        doc.setFont('Helvetica', 'normal');
        doc.text("Automated Workforce Cryptographic Ledger Payroll Statement", 15, 26);

        // Metadata Profile Fields
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(14);
        doc.setFont('Helvetica', 'bold');
        doc.text("Employee Earnings Statement", 15, 55);
        doc.setLineWidth(0.5);
        doc.line(15, 58, 195, 58);

        doc.setFontSize(11);
        doc.setFont('Helvetica', 'normal');
        doc.text(`Employee Name: ${employee.name}`, 15, 68);
        doc.text(`Email Address: ${employee.email}`, 15, 75);
        doc.text(`Designation: ${employee.designation}`, 15, 82);
        doc.text(`Account Status: Active`, 15, 89);

        // Columns Grid
        doc.setFont('Helvetica', 'bold');
        doc.text("EARNINGS BASE COMPONENTS", 15, 105);
        doc.text("STATUTORY DEDUCTIONS", 110, 105);
        doc.line(15, 108, 95, 108);
        doc.line(110, 108, 195, 108);

        doc.setFont('Helvetica', 'normal');
        doc.text(`Basic Salary: Rs. ${payroll.basicSalary}`, 15, 116);
        doc.text(`HRA Allowance: Rs. ${payroll.hra}`, 15, 124);
        doc.text(`Other Allowances: Rs. 1250`, 15, 132);

        doc.text(`Provident Fund (PF): Rs. ${payroll.pf}`, 110, 116);
        doc.text(`ESI Insurance: Rs. ${payroll.esi}`, 110, 124);
        doc.text(`Professional Tax (PT): Rs. ${payroll.pt}`, 110, 132);
        doc.text(`Group Insurance: Rs. ${payroll.insurance}`, 110, 140);

        // Summary Calculations
        doc.rect(15, 155, 180, 30);
        doc.setFont('Helvetica', 'bold');
        doc.text(`Gross Total Earnings: Rs. ${payroll.grossSalary}`, 20, 163);
        doc.setTextColor(239, 68, 68);
        doc.text(`Total Aggregated Deductions: Rs. ${payroll.totalDeductions}`, 20, 171);
        doc.setTextColor(16, 185, 129);
        doc.setFontSize(13);
        doc.text(`Net Take-Home Pay Dividend: Rs. ${payroll.netSalary}`, 20, 180);

        // Footer
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(9);
        doc.setFont('Helvetica', 'italic');
        doc.text("This is a system-generated document ledger statement. No physical signature required.", 15, 280);

        const blobStream = doc.output('bloburl');
        setPdfUrl(blobStream);
        setShowPreview(true);
    };

    // Prevent rendering the dashboard until the real data arrives
    if (!employee && email) {
        return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter' }}>Loading your dashboard...</div>;
    }

    return (
        <div className="dashboard-layout">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <h2>EMS<span>.</span></h2>
                </div>
                <nav className="sidebar-nav">
                    <button className={`nav-item ${!showLeaveForm && !showStats ? 'active' : ''}`} onClick={() => { setShowLeaveForm(false); setShowStats(false); }}>
                        Dashboard
                    </button>
                    <button className={`nav-item ${showLeaveForm ? 'active' : ''}`} onClick={() => { setShowLeaveForm(!showLeaveForm); setShowStats(false); }}>
                        Leave Request
                    </button>
                    <button className={`nav-item ${showStats ? 'active' : ''}`} onClick={() => { setShowStats(!showStats); setShowLeaveForm(false); fetchStats(); }}>
                        Leave Status
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("email");
                        window.location.href = "/";
                    }}>
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">
                <header className="topbar">
                    <div>
                        <h1>Welcome Back, {employee?.name?.split(' ')[0] || 'Employee'}</h1>
                        <p>Employee Control Room</p>
                    </div>
                    <div className="profile-badge">
                        <div className="avatar">{employee?.name?.charAt(0) || 'E'}</div>
                        <div className="badge-info">
                            <span className="badge-name">{employee?.name}</span>
                            <span className="badge-role">{employee?.designation}</span>
                        </div>
                    </div>
                </header>

                <div className="dashboard-grid">
                    
                    {/* UPGRADED PROFILE CARD */}
                    {/* PREMIUM PROPERTY GRID PROFILE CARD */}
                    {employee && (
                        <div className="dash-card profile-section">
                            <div className="profile-card-header">
                                <h3>Personal Details</h3>
                                
                            </div>
                            
                            <div className="property-grid">
                                <div className="property-item">
                                    <span className="property-label">Email Address</span>
                                    <span className="property-value">{employee.email}</span>
                                </div>
                                <div className="property-item">
                                    <span className="property-label">Age</span>
                                    <span className="property-value">{employee.age} Years</span>
                                </div>
                                <div className="property-item">
                                    <span className="property-label">Gender</span>
                                    <span className="property-value">{employee.gender}</span>
                                </div>
                                <div className="property-item">
                                    <span className="property-label">Blood Group</span>
                                    <span className="property-value blood-pill">{employee.bloodGroup}</span>
                                </div>
                                <div className="property-item full-width">
                                    <span className="property-label">Location</span>
                                    <span className="property-value">{employee.city}, {employee.pincode}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC RIGHT COLUMN: LEAVE OR PAYROLL */}
                    <div className="dash-card action-section">
                        {showLeaveForm ? (
                            <div className="form-container">
                                <h3>Apply for Leave</h3>
                                <div className="dash-input-group">
                                    <label>Start Date</label>
                                    <input type="date" name="startDate" value={leaveData.startDate} onChange={handleLeaveChange} />
                                </div>
                                <div className="dash-input-group">
                                    <label>End Date</label>
                                    <input type="date" name="endDate" value={leaveData.endDate} onChange={handleLeaveChange} />
                                </div>
                                <div className="dash-input-group">
                                    <label>Leave Type</label>
                                    <input type="text" name="leaveType" placeholder="e.g. Sick, Casual" value={leaveData.leaveType} onChange={handleLeaveChange} />
                                </div>
                                <div className="dash-input-group">
                                    <label>Reason</label>
                                    <textarea name="reason" placeholder="Brief reason for leave..." value={leaveData.reason} onChange={handleLeaveChange} />
                                </div>
                                <button className="primary-btn" onClick={submitLeaveRequest}>Submit Request</button>
                            </div>
                        ) : showStats && stats ? (
                            <div className="stats-container">
                                <h3>Leave Statistics</h3>
                                <div className="stat-boxes">
                                    <div className="stat-box">
                                        <span className="stat-val">{stats.totalRequests}</span>
                                        <span className="stat-label">Total</span>
                                    </div>
                                    <div className="stat-box approved">
                                        <span className="stat-val">{stats.approvedLeaves}</span>
                                        <span className="stat-label">Approved</span>
                                    </div>
                                    <div className="stat-box rejected">
                                        <span className="stat-val">{stats.rejectedLeaves}</span>
                                        <span className="stat-label">Rejected</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="payroll-container">
                                <h3>Financial Ledger</h3>
                                {employee?.payroll ? (
                                    <div className="payroll-summary">
                                        <p>Latest Net Take-Home Salary</p>
                                        <h2>₹{employee.payroll.netSalary}</h2>
                                        <button className="primary-btn" onClick={generatePayslipPDF}>
                                            Generate Pay Slip
                                        </button>
                                    </div>
                                ) : (
                                    <p className="no-data">Your payroll matrix has not been configured by HR yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* PDF IFRAME PREVIEW MODAL */}
            {showPreview && pdfUrl && (
                <div style={previewStyles.overlay}>
                    <div style={previewStyles.container}>
                        <div style={previewStyles.headerRow}>
                            <h4 style={{ margin: 0 }}>Interactive Preview - Payslip Statement Document</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <a href={pdfUrl} download={`Payslip_${employee?.name}.pdf`} className="success-btn" style={{ textDecoration: 'none' }}>
                                    Download PDF
                                </a>
                                <button className="danger-btn" onClick={() => setShowPreview(false)}>Close</button>
                            </div>
                        </div>
                        <iframe src={pdfUrl} title="Payslip Viewport Explorer" style={{ width: '100%', height: 'calc(100% - 60px)', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                </div>
            )}
        </div>
    );
}

const previewStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 },
    container: { background: '#fff', width: '80%', height: '85vh', borderRadius: '16px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }
};

export default Dashboard;