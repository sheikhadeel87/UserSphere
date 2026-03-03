import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, CartesianGrid
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF6699", "#A28FD0"];

const chartCardStyle = {
  background: 'var(--card)',
  borderRadius: 16,
  boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
  padding: 24,
  margin: 16,
  flex: 1,
  minWidth: 340,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const gridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 24,
  justifyContent: 'center',
  alignItems: 'stretch',
  minWidth: 0,
};

function GraphicalView() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/users/stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data.data || []);
        setLoading(false);
      })
      .catch(e => { setError('Failed to load data'); setLoading(false); });
  }, []);

  if (loading) return <div style={{padding: 48, textAlign: 'center'}}>Loading professional dashboard...</div>;
  if (error) return <div style={{padding: 48, color: 'red', textAlign: 'center'}}>{error}</div>;

  // Prepare data for charts
  const barData = stats.map(city => ({
    city: city.city.charAt(0).toUpperCase() + city.city.slice(1).toLowerCase(),
    totalUsers: city.totalUsers,
    activeUsers: city.activeUsers,
    averageAge: city.averageAge,
    inactiveUsers: city.totalUsers - city.activeUsers,
  }));

  const pieData = stats.map(city => ({
    name: city.city.charAt(0).toUpperCase() + city.city.slice(1).toLowerCase(),
    value: city.totalUsers,
  }));

  const totalActive = stats.reduce((sum, c) => sum + c.activeUsers, 0);
  const totalUsers = stats.reduce((sum, c) => sum + c.totalUsers, 0);
  const totalInactive = totalUsers - totalActive;

  const doughnutData = [
    { name: "Active", value: totalActive },
    { name: "Inactive", value: totalInactive },
  ];

  // For line chart: average age per city
  const lineData = barData;

  // For stacked bar: active + inactive per city
  const stackedBarData = barData;

  // Custom tooltip for bar/stacked bar
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <strong>{label}</strong><br/>
          {payload.map((entry, i) => (
            <div key={i} style={{ color: entry.color }}>{entry.name}: {entry.value}</div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="graphical-container">
      <div className="graphical-inner" style={{ display: 'flex', minWidth: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 className="analytics-title" style={{ fontSize: 28 }}>📊 User Analytics Dashboard</h2>
          <div className="graphical-charts-grid" style={gridStyle}>

            {/* 1️⃣ Bar Chart */}
            <div className="graphical-chart-card" style={chartCardStyle}>
          <h2 style={{marginBottom: 12}}>City-wise Users</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <XAxis dataKey="city" tick={{ fontWeight: 100, fill: 'var(--muted)' }} />
              <YAxis tick={{ fontWeight: 100, fill: 'var(--muted)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="totalUsers" fill="#8884d8" name="Total Users" radius={[8,8,0,0]} />
              <Bar dataKey="activeUsers" fill="#00C49F" name="Active Users" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

            {/* 2️⃣ Stacked Bar Chart */}
            <div className="graphical-chart-card" style={chartCardStyle}>
          <h2 style={{marginBottom: 12}}>Active vs Inactive per City</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stackedBarData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <XAxis dataKey="city" tick={{ fontWeight: 100, fill: 'var(--muted)' }} />
              <YAxis tick={{ fontWeight: 100, fill: 'var(--muted)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="activeUsers" stackId="a" fill="#0284c7" name="Active" radius={[8,8,0,0]} />
              <Bar dataKey="inactiveUsers" stackId="a" fill="#64748b" name="Inactive" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

            {/* 3️⃣ Pie Chart */}
            <div className="graphical-chart-card" style={chartCardStyle}>
          <h2 style={{marginBottom: 12}}>User Distribution by City</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

            {/* 4️⃣ Doughnut Chart */}
            <div className="graphical-chart-card" style={chartCardStyle}>
          <h2 style={{marginBottom: 12}}>Active vs Inactive Users</h2>
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

            {/* 5️⃣ Line Chart */}
            <div className="graphical-chart-card" style={chartCardStyle}>
          <h2 style={{marginBottom: 12}}>Average Age per City</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" tick={{ fontWeight: 100, fill: 'var(--muted)' }} />
              <YAxis tick={{ fontWeight: 100, fill: 'var(--muted)' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="averageAge" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 5 }} name="Average Age" />
            </LineChart>
          </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphicalView;