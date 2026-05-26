import { useEffect, useState } from "react";
import api from "../services/api";


function AssetsModal({ empId, onClose }) {

    const [assets, setAssets] = useState([]);

    const [form, setForm] = useState({
        name: "",
        type: "",
        trackingNumber: "",
        specifications: "",
        status: "SUBMITTED"
    });

    const token = localStorage.getItem("token");

    const fetchAssets = async () => {
        try {
            const res = await api.get(
                `/assets/employee/${empId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
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
            await api.post(
                "/assets",
                { ...form, empId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Asset Assigned");

            setForm({
                name: "",
                type: "",
                trackingNumber: "",
                specifications: "",
                status: "SUBMITTED"
            });

            fetchAssets();

        } catch (err) {
            console.log(err);
            alert("Failed to assign asset");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(
                `/assets/${id}/status?status=${status}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchAssets();

        } catch (err) {
            console.log(err);
        }
    };

    // Delete Asset
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this asset?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(
                `/assets/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Asset Deleted Successfully");

            fetchAssets();

        } catch (error) {

            console.error("Error Deleting Asset", error);

            alert("Failed To Delete Asset");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">

                <h3>Employee Assets</h3>

                <button
                    className="btn btn-secondary mb-3"
                    onClick={onClose}
                >
                    Close
                </button>

                {/* FORM */}
                <div className="card p-2 mb-3">

                    <input
                        name="name"
                        placeholder="Asset Name"
                        value={form.name}
                        onChange={handleChange}
                        className="form-control mb-2"
                    />

                    <input
                        name="type"
                        placeholder="Type"
                        value={form.type}
                        onChange={handleChange}
                        className="form-control mb-2"
                    />

                    <input
                        name="trackingNumber"
                        placeholder="Tracking Number"
                        value={form.trackingNumber}
                        onChange={handleChange}
                        className="form-control mb-2"
                    />

                    <textarea
                        name="specifications"
                        placeholder="Specifications"
                        value={form.specifications}
                        onChange={handleChange}
                        className="form-control mb-2"
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="form-control mb-2"
                    >
                        <option value="SUBMITTED">Submitted</option>
                        <option value="IN_USE">In Use</option>
                        <option value="IN_REPAIR">In Repair</option>
                    </select>

                    <button
                        className="btn btn-primary"
                        onClick={assignAsset}
                    >
                        Assign Asset
                    </button>

                </div>

                {/* LIST */}
                {/* LIST */}
                <h5>Assigned Assets</h5>

                {assets.length === 0 ? (

                    <p>No Assets Assigned</p>

                ) : (

                    <table className="table table-bordered table-striped">

                        <thead className="table-dark">

                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Tracking Number</th>
                                <th>Specifications</th>
                                <th>Status</th>
                            </tr>

                        </thead>

                        <tbody>

                            {assets.map((a) => (

                                <tr key={a.id}>

                                    <td>{a.id}</td>

                                    <td>{a.name}</td>

                                    <td>{a.type}</td>

                                    <td>{a.trackingNumber}</td>

                                    <td>{a.specifications}</td>

                                    <td>

                                        <select
                                            value={a.status}
                                            onChange={(e) =>
                                                updateStatus(
                                                    a.id,
                                                    e.target.value
                                                )
                                            }
                                            className="form-select"
                                        >
                                            <option value="SUBMITTED">
                                                Submitted
                                            </option>

                                            <option value="IN_USE">
                                                In Use
                                            </option>

                                            <option value="IN_REPAIR">
                                                In Repair
                                            </option>

                                        </select>

                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(a.id)}
                                        >
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
    );
}

export default AssetsModal;


