import { useEffect, useState } from "react";
import api from "../services/api";

function AssetsModal({ empId, onClose }) {
    const [assets, setAssets] = useState([]);
    
    // Your exact form state
    const [form, setForm] = useState({
        name: "",
        type: "",
        trackingNumber: "",
        specifications: "",
        status: "SUBMITTED"
    });

    const token = localStorage.getItem("token");

    // =========================
    // API CALLS (Unchanged)
    // =========================
    const fetchAssets = async () => {
        try {
            const res = await api.get(`/assets/employee/${empId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssets(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, [empId]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const assignAsset = async () => {
        try {
            await api.post("/assets", { ...form, empId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Asset Assigned");
            setForm({
                name: "", type: "", trackingNumber: "",
                specifications: "", status: "SUBMITTED"
            });
            fetchAssets();
        } catch (err) {
            console.log(err);
            alert("Failed to assign asset");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/assets/${id}/status?status=${status}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAssets();
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this asset?")) return;
        try {
            await api.delete(`/assets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Asset Deleted Successfully");
            fetchAssets();
        } catch (error) {
            console.error("Error Deleting Asset", error);
            alert("Failed To Delete Asset");
        }
    };

    // =========================
    // PREMIUM UI RENDER
    // =========================
    return (
        <div className="premium-modal-backdrop">
            {/* Using an expanded modifier class for the table */}
            <div className="premium-modal assets-modal-wide">
                
                <div className="modal-header">
                    <div>
                        <h3>Employee Hardware Ledger</h3>
                        <p>Manage and track assets for EMP-{empId}</p>
                    </div>
                    <button className="close-icon-btn" onClick={onClose}>✕</button>
                </div>

                {/* PREMIUM FORM GRID */}
                <div className="asset-form-section">
                    <div className="asset-form-grid">
                        <div className="input-group">
                            <label>Asset Name</label>
                            <input name="name" placeholder="e.g. Dell Monitor" value={form.name} onChange={handleChange} className="premium-input" />
                        </div>
                        <div className="input-group">
                            <label>Category Type</label>
                            <input name="type" placeholder="e.g. Display" value={form.type} onChange={handleChange} className="premium-input" />
                        </div>
                        <div className="input-group">
                            <label>Tracking Number</label>
                            <input name="trackingNumber" placeholder="e.g. TRK-9921" value={form.trackingNumber} onChange={handleChange} className="premium-input" />
                        </div>
                        <div className="input-group">
                            <label>Assignment Status</label>
                            <select name="status" value={form.status} onChange={handleChange} className="premium-input">
                                <option value="SUBMITTED">Submitted</option>
                                <option value="IN_USE">In Use</option>
                                <option value="IN_REPAIR">In Repair</option>
                            </select>
                        </div>
                        <div className="input-group span-2">
                            <label>Technical Specifications</label>
                            <input name="specifications" placeholder="e.g. 27-inch, 4K Resolution, USB-C" value={form.specifications} onChange={handleChange} className="premium-input" />
                        </div>
                    </div>
                    
                    <div className="asset-form-actions">
                        <button className="premium-btn-dark" onClick={assignAsset} disabled={!form.name}>
                            Assign Hardware
                        </button>
                    </div>
                </div>

                {/* PREMIUM TABLE CONTAINER */}
                <div className="assets-table-container">
                    {assets.length === 0 ? (
                        <div className="empty-state">No assets have been assigned to this employee yet.</div>
                    ) : (
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Hardware Details</th>
                                    <th>Tracking & Specs</th>
                                    <th>Current Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.map((a) => (
                                    <tr key={a.id}>
                                        <td>
                                            <div className="cell-primary">{a.name}</div>
                                            <div className="cell-secondary">Type: {a.type}</div>
                                        </td>
                                        <td>
                                            <div className="cell-primary text-sm">{a.trackingNumber}</div>
                                            <div className="cell-secondary text-xs truncate" title={a.specifications}>
                                                {a.specifications || "No specs listed"}
                                            </div>
                                        </td>
                                        <td>
                                            {/* Inline Custom Status Dropdown */}
                                            <select 
                                                className="premium-select-inline"
                                                value={a.status}
                                                onChange={(e) => updateStatus(a.id, e.target.value)}
                                            >
                                                <option value="SUBMITTED">Submitted</option>
                                                <option value="IN_USE">In Use</option>
                                                <option value="IN_REPAIR">In Repair</option>
                                            </select>
                                        </td>
                                        <td className="text-right">
                                            <button className="text-link danger" onClick={() => handleDelete(a.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    );
}

export default AssetsModal;