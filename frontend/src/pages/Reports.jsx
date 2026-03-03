import React, { useEffect, useState } from "react";
import { FaCity } from "react-icons/fa";
import {
    LineChart, Line, XAxis, YAxis,
    Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell, CartesianGrid
} from "recharts";


const COLORS = ["#0284c7", "#64748b"];

const chartCardStyle = {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(0,94,255,0.06)",
    padding: 24,
    marginBottom: 24,
};

function Reports() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/users/stats`)
            .then(res => res.json())
            .then(data => {
                setStats(data.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-5 text-center">Loading Reports...</div>;

    // 🔹 Calculations
    const totalUsers = stats.reduce((sum, c) => sum + c.totalUsers, 0);
    const totalActive = stats.reduce((sum, c) => sum + c.activeUsers, 0);
    const totalInactive = totalUsers - totalActive;

    const avgAge =
        stats.length > 0
            ? (
                stats.reduce((sum, c) => sum + c.averageAge, 0) /
                stats.length
            ).toFixed(1)
            : 0;

    const activePercent =
        totalUsers > 0 ? ((totalActive / totalUsers) * 100).toFixed(0) : 0;

    const lineData = stats.map(c => ({
        city: c.city,
        users: c.totalUsers
    }));

    const doughnutData = [
        { name: "Active", value: totalActive },
        { name: "Inactive", value: totalInactive }
    ];

    return (
        <div className="site-container">
            <h2 className="report-title" style={{ fontSize: 28 }}>Reports</h2>
            <div className="main-card">
                    {/* Stat Cards: space-evenly on big screens, 2 per row on small */}
                    <div className="reports-stat-cards">
                        <div className="stat-card">
                            <div className="stat-value">{totalUsers}</div>
                            <div className="stat-title">Total Users</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value text-success">{activePercent}%</div>
                            <div className="stat-title">Active Users</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{totalInactive}</div>
                            <div className="stat-title">Inactive Users</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value text-warning">{avgAge}</div>
                            <div className="stat-title">Avg Age</div>
                        </div>
                    </div>
                {/* Users Growth */}
                <div className="chart-box mb-4">
                    <h2 style={{ marginBottom: 12 }}>Users Growth Over Time</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={lineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="city" tick={{ fontWeight: 100, fill: 'var(--muted)' }} />
                            <YAxis tick={{ fontWeight: 100, fill: 'var(--muted)' }} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#0ea5e9"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                    <div className="reports-flex-row">
                        {/* User Table Section */}
                        <div className="site-card reports-table-col">
                            <h2 style={{ marginBottom: 18, fontWeight: 700, fontSize: 22, letterSpacing: 0.5 }}>Top Cities</h2>
                            <div className="site-table-wrap">
                                <table className="site-table">
                                    <thead>
                                        <tr>
                                            <th>City Name</th>
                                            <th>Total Users</th>
                                            <th>Active Users</th>
                                            <th>Active %</th>
                                            <th>Average Age</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: 'center', color: '#888', fontSize: 18, padding: 32 }}>No data found.</td>
                                            </tr>
                                        ) : (
                                            stats.map((city, idx) => {
                                                const percentActive = city.totalUsers ? Math.round((city.activeUsers / city.totalUsers) * 100) : 0;
                                                const themeGrad = 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)';
                                                return (
                                                    <tr key={city.city + idx}>
                                                        <td style={{ fontWeight: 600, color: 'var(--accent-light)', fontSize: 17, display: 'flex', alignItems: 'center', gap: 12 }}>
                                                            <span style={{ background: themeGrad, borderRadius: '50%', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(2,132,199,0.35)' }}>
                                                                <FaCity size={18} style={{ color: '#fff' }} />
                                                            </span>
                                                            {city.city || 'Unknown'}
                                                        </td>
                                                        <td style={{ textAlign: 'left', fontWeight: 500, color: 'var(--text)', fontSize: 17 }}>{city.totalUsers}</td>
                                                        <td style={{ textAlign: 'left', fontWeight: 500, color: 'var(--text)', fontSize: 17 }}>{city.activeUsers}</td>
                                                        <td style={{ textAlign: 'left', fontWeight: 500, minWidth: 120 }}>
                                                            <div style={{ display: 'left', alignItems: 'center', gap: 8 }}>
                                                                <div style={{ width: 60, height: 10, background: 'var(--line)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                                                                    <div style={{ width: `${percentActive}%`, background: themeGrad, height: '100%', borderRadius: 8, position: 'absolute', left: 0, top: 0, transition: 'width 0.4s' }}></div>
                                                                </div>
                                                                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{percentActive}%</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ textAlign: 'left', fontWeight: 500, color: 'var(--text)', fontSize: 17 }}>{city.averageAge ?? 0}</td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Doughnut Chart Section */}
                        <div className="site-card reports-doughnut-col">
                            <h2 style={{ marginBottom: 12 }}>Active vs Inactive Users</h2>
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={doughnutData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        <Cell fill="#0284c7" />
                                        <Cell fill="#64748b" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default Reports;
