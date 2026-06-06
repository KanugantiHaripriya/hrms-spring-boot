import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Laptop, FileText, DollarSign, TrendingUp, Box, AlertTriangle, Download} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import "../styles/analyticalDashboard.css";

const AnalyticalDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CHART_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    fetch('http://localhost:8080/api/dashboard/analytics', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="sems-status-fallback">
        <div className="sems-premium-loader"></div>
        <p>Syncing secure enterprise matrix...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sems-status-fallback sems-error-state">
        <p>Operational Error: {error}</p>
      </div>
    );
  }

  const formatMapToData = (dataMap) => {
    return Object.keys(dataMap || {}).map(key => ({
      name: key,
      value: dataMap[key]
    }));
  };

  const departmentData = formatMapToData(data.departmentWiseDistribution);
  const assetData = formatMapToData(data.assetStatusDistribution);
  const leaveData = formatMapToData(data.leaveStatusDistribution);

  const totalAssetsCount = assetData.reduce((sum, item) => sum + item.value, 0) || 1;

  const getAssetMeta = (name) => {
    switch (name) {
      case 'IN_USE':
        return { color: '#10B981', bg: 'sems-ledger-emerald', icon: <CheckCircle size={14} /> };
      case 'IN_REPAIR':
        return { color: '#EF4444', bg: 'sems-ledger-rose', icon: <AlertTriangle size={14} /> };
      default:
        return { color: '#6366F1', bg: 'sems-ledger-indigo', icon: <Box size={14} /> };
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/dashboard/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error("Failed to download Excel sheet");

      // Convert the response to a Blob (binary data)
      const blob = await response.blob();
      
      // Create a temporary URL and trigger a silent download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SecureEMS_Dashboard.xlsx');
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export Error:", err);
      alert("Failed to export data to Excel.");
    }
  };

  const handleExportLeaves = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/dashboard/export/leaves', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error("Failed to download Leaves Excel sheet");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SecureEMS_Leaves_Report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Leaves Export Error:", err);
      alert("Failed to export leaves data.");
    }
  };

  const handleExportAssets = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/dashboard/export/assets', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error("Failed to download Assets Excel sheet");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SecureEMS_Assets_Report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Assets Export Error:", err);
      alert("Failed to export assets data.");
    }
  };

  return (
    <div className="sems-analytics-workspace">

      {/* 🚀 Summary KPI Cards */}
      <div className="sems-kpi-grid">
        <Card title="Total Headcount" value={data.totalEmployees} icon={<Users size={18} />} variant="blue" subtext="Registered workers" />
        <Card title="Active Accounts" value={data.activeEmployees} icon={<CheckCircle size={18} />} variant="emerald" subtext="Live sessions active" />
        <Card title="Deployed Assets" value={data.totalAssignedAssets} icon={<Laptop size={18} />} variant="purple" subtext="Hardware provisioned" />
        <Card title="Pending Leaves" value={data.pendingLeaveRequests} icon={<FileText size={18} />} variant="amber" subtext="Awaiting HR signoff" />
        
        {/* Financial Outflow Panel */}
        <div className="sems-kpi-card sems-variant-rose">
          <div className="sems-kpi-card-header">
            <span className="sems-kpi-title">Monthly Net Payroll</span>
            <div className="sems-kpi-icon-wrapper"><DollarSign size={18} /></div>
          </div>
          <div className="sems-kpi-card-body">
            <h3 className="sems-kpi-value">
              {data.totalMonthlyPayrollOutflow ? `₹${data.totalMonthlyPayrollOutflow.toLocaleString('en-IN')}` : '₹0'}
            </h3>
            <p className="sems-kpi-subtext">
              <TrendingUp size={12} className="sems-trend-icon" /> Automated ledger metrics
            </p>
          </div>
        </div>
      </div>

      {/* 📊 High-End Layout-Aligned Graph System */}
      <div className="sems-charts-grid">
        
        {/* Workforce Distribution Area Chart */}
        <div className="sems-chart-card sems-span-2">
          <div className="sems-chart-head">
            <h3 className="sems-chart-title">Workforce Trend by Designation</h3>
            <p className="sems-chart-desc">Staff headcount proportions calculated by active employment roles</p>
          </div>

          {/* EXPORT BUTTON */}
            <button onClick={handleExportExcel} className="sems-export-btn">
              <Download size={16} />
              Export to Excel
            </button>

          <div className="sems-canvas-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={departmentData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="semsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.00}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} axisLine={false} dy={8} style={{ fontSize: '11px', fontWeight: 500 }} />
                <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} dx={-4} allowDecimals={false} style={{ fontSize: '11px', fontWeight: 500 }} />
                <Tooltip contentStyle={{ border: 'none', background: 'transparent' }} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366F1" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#semsAreaGradient)" 
                  activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#6366F1' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🍩 Refined Premium Pie (Donut) Chart View */}
        <div className="sems-chart-card">
          <div className="sems-chart-head">
            <h3 className="sems-chart-title">Leave Application Status</h3>
            <p className="sems-chart-desc">Current lifecycle of active queue metrics</p>
          </div>

          {/* LEAVES EXPORT BUTTON */}
            <button onClick={handleExportLeaves} className="sems-export-btn">
              <Download size={14} />
              Export Leave Status
            </button>

          <div className="sems-canvas-box sems-pie-canvas">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={leaveData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={4} 
                  dataKey="value"
                >
                  {leaveData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS[index % CHART_COLORS.length]} 
                      stroke="#ffffff" 
                      strokeWidth={3} 
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ border: 'none', background: 'transparent' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="sems-legend-wrapper">
            {leaveData.map((entry, index) => (
              <div key={entry.name} className="sems-legend-node">
                <div className="sems-legend-meta">
                  <span className="sems-legend-dot" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></span>
                  <span className="sems-legend-txt">{entry.name.toLowerCase()}</span>
                </div>
                <span className="sems-legend-num">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* STRIPE ARCHITECTURE: Multi-Segmented Tracking Ledger */}
        <div className="sems-chart-card sems-span-3">
          <div className="sems-chart-head">
            <h3 className="sems-chart-title">Inventory Operations & Allocation Ledger</h3>
            <p className="sems-chart-desc">Macro status tracking metrics and global system asset distribution rates</p>
          </div>

            {/* ASSETS EXPORT BUTTON */}
            <button onClick={handleExportAssets} className="sems-export-btn">
              <Download size={14} />
              Export Assets
            </button>
            <br />
          <div className="sems-stripe-ledger-container">
            <div className="sems-segment-strip-bar">
              {assetData.map((item) => {
                const percentage = (item.value / totalAssetsCount) * 100;
                const meta = getAssetMeta(item.name);
                return (
                  <div 
                    key={item.name} 
                    className="sems-segment-slice" 
                    style={{ width: `${percentage}%`, backgroundColor: meta.color }}
                    title={`${item.name}: ${Math.round(percentage)}%`}
                  />
                );
              })}
            </div>

            <div className="sems-ledger-table">
              <div className="sems-ledger-header-row">
                <span>Operational Status</span>
                <span>Allocation Volume</span>
                <span>System Weight</span>
              </div>
              
              {assetData.map((item) => {
                const percentage = Math.round((item.value / totalAssetsCount) * 100);
                const meta = getAssetMeta(item.name);
                
                return (
                  <div key={item.name} className="sems-ledger-row">
                    <div className="sems-ledger-status-cell">
                      <span className={`sems-ledger-icon-badge ${meta.bg}`}>
                        {meta.icon}
                      </span>
                      <span className="sems-ledger-name-string">
                        {item.name.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="sems-ledger-volume-cell">
                      {item.value} <small>Units</small>
                    </div>
                    <div className="sems-ledger-weight-cell">
                      <span className="sems-weight-pill">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

const Card = ({ title, value, icon, variant, subtext }) => {
  return (
    <div className={`sems-kpi-card sems-variant-${variant}`}>
      <div className="sems-kpi-card-header">
        <span className="sems-kpi-title">{title}</span>
        <div className="sems-kpi-icon-wrapper">{icon}</div>
      </div>
      <div className="sems-kpi-card-body">
        <h3 className="sems-kpi-value">{value}</h3>
        <p className="sems-kpi-subtext">{subtext}</p>
      </div>
    </div>
  );
};

export default AnalyticalDashboard;