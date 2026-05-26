import { useEffect, useState } from "react";
import api, {
    submitLeave,
    getLeaveStats
} from "../services/api";
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

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get(`/employee/profile/${email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployee(response.data);
        } catch (error) {
            console.log(error);
            alert("Failed To Fetch Profile");
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
            await submitLeave({
                employeeId: employee.id,
                ...leaveData
            });
            alert("Leave Request Submitted Successfully");
            setLeaveData({ startDate: "", endDate: "", leaveType: "", reason: "" });
        } catch (error) {
            console.log(error);
            alert("Failed To Submit Leave");
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getLeaveStats(employee.id);
            setStats(response.data);
        } catch (error) {
            console.log(error);
            alert("Failed To Fetch Leave Stats");
        }
    };

    // ==========================================
    // PDF GENERATION ENGINE
    // ==========================================
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

    return (
        <div className="dashboard-container">

            <div className="dashboard-header">
                <h2>Employee Dashboard</h2>
                <div className="mt-3">
                    <button className="btn btn-primary me-2" onClick={() => setShowLeaveForm(!showLeaveForm)}>
                        Leave Request
                    </button>
                    <button className="btn btn-success me-2" onClick={() => { setShowStats(!showStats); fetchStats(); }}>
                        Leave Status
                    </button>
                    <button className="dashboard-btn logout-btn" onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("email");
                        window.location.href = "/";
                    }}>
                        Logout
                    </button>
                </div>
            </div>

            {/* LEAVE FORM */}
            {showLeaveForm && (
                <div className="card p-4 mb-4">
                    <h4>Apply Leave</h4>
                    <input type="date" name="startDate" className="form-control mb-2" value={leaveData.startDate} onChange={handleLeaveChange} />
                    <input type="date" name="endDate" className="form-control mb-2" value={leaveData.endDate} onChange={handleLeaveChange} />
                    <input type="text" name="leaveType" placeholder="Leave Type" className="form-control mb-2" value={leaveData.leaveType} onChange={handleLeaveChange} />
                    <textarea name="reason" placeholder="Reason" className="form-control mb-2" value={leaveData.reason} onChange={handleLeaveChange} />
                    <button className="btn btn-primary" onClick={submitLeaveRequest}>Submit Leave</button>
                </div>
            )}

            {/* LEAVE STATS */}
            {showStats && stats && (
                <div className="card p-4 mb-4">
                    <h4>Leave Statistics</h4>
                    <p><strong>Total Requests:</strong> {stats.totalRequests}</p>
                    <p><strong>Approved Leaves:</strong> {stats.approvedLeaves}</p>
                    <p><strong>Rejected Leaves:</strong> {stats.rejectedLeaves}</p>
                </div>
            )}

            {/* PROFILE & PAYROLL MATRIX */}
            {employee && (
                <div className="card-wrapper">
                    <div className="profile-card">
                        <h3 className="welcome-text">Welcome to your profile {employee.name}</h3>

                        <div className="info-grid">
                            <div className="info-row"><span>Email </span><b>{employee.email}</b></div>
                            <div className="info-row"><span>Age </span><b>{employee.age}</b></div>
                            <div className="info-row"><span>Blood Group </span><b>{employee.bloodGroup}</b></div>
                            <div className="info-row"><span>City </span><b>{employee.city}</b></div>
                            <div className="info-row"><span>Gender </span><b>{employee.gender}</b></div>
                            <div className="info-row"><span>Pincode </span><b>{employee.pincode}</b></div>
                            <div className="info-row"><span>Designation </span><b>{employee.designation}</b></div>
                            <div className="info-row role"><span>Role </span><b>{employee.role}</b></div>
                        </div>
                        
                        {/* ============================== */}
                        {/* EMPLOYEE PAYROLL SUB-SECTION   */}
                        {/* ============================== */}
                        <div style={{ marginTop: '35px', paddingTop: '25px', borderTop: '1px solid #e2e8f0' }}>
                            <h4 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                                Financial Ledger & Payroll
                            </h4>
                            
                            {employee.payroll ? (
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    backgroundColor: '#f8fafc', 
                                    padding: '24px', 
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    maxWidth: '400px',
                                    margin: '0 auto',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                                }}>
                                    {/* Centered Salary Metric */}
                                    <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                                            Latest Net Take-Home Salary
                                        </p>
                                        <strong style={{ color: '#10b981', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>
                                            ₹{employee.payroll.netSalary}
                                        </strong>
                                    </div>

                                    {/* Downsized Centered Button */}
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={generatePayslipPDF}
                                        style={{ 
                                            padding: '10px 24px', 
                                            fontSize: '14px', 
                                            fontWeight: '600', 
                                            borderRadius: '8px',
                                            width: 'auto', // Overrides full stretch
                                            minWidth: '160px',
                                            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                                        }}
                                    >
                                        Generate Pay Slip
                                    </button>
                                </div>
                            ) : (
                                <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '14px', backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                    Your payroll matrix has not been configured by HR yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ============================== */}
            {/* PDF IFRAME PREVIEW MODAL       */}
            {/* ============================== */}
            {showPreview && pdfUrl && (
                <div style={previewStyles.overlay}>
                    <div style={previewStyles.container}>
                        <div style={previewStyles.headerRow}>
                            <h4 style={{ margin: 0 }}>Interactive Preview - Payslip Statement Document</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <a href={pdfUrl} download={`Payslip_${employee?.name}.pdf`} className="btn btn-success" style={{ textDecoration: 'none' }}>
                                    Download PDF Document
                                </a>
                                <button className="btn btn-danger" onClick={() => setShowPreview(false)}>Close Window</button>
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
    container: { background: '#fff', width: '80%', height: '85vh', borderRadius: '16px', padding: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }
};

export default Dashboard;