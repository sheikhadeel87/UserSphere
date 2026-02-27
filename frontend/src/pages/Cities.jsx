import React, { useEffect, useState } from 'react';
import { FaCity } from 'react-icons/fa';

function Cities() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Accent palette for city rows (same as dashboard)
  const accents = [
    { grad: 'linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)', color: '#198754' },
    { grad: 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)', color: '#0d6efd' },
    { grad: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', color: '#f59e42' },
    { grad: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)', color: '#e83e8c' },
    { grad: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)', color: '#6c757d' },
  ];

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/users/stats`);
        const data = await res.json();
        setStats(data.data || []);
      } catch (err) {
        setError('Failed to load city stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="cities-container">
      <h2 className="report-title" style={{ fontSize: 28 }}>All Cities</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <div className="cities-table-wrap">
          <table className="cities-table">
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
              {stats.map((city, idx) => {
                const accent = accents[idx % accents.length];
                const activePercent = city.totalUsers ? ((city.activeUsers / city.totalUsers) * 100).toFixed(1) : 0;
                return (
                  <tr key={city.city}>
                    <td style={{ fontWeight: 600, color: "#0ea5e9" }}>{city.city}</td>
                    <td style={{ textAlign: 'left', color: 'var(--text)', fontWeight: 600 }}>{city.totalUsers}</td>
                    <td style={{ textAlign: 'left', color: 'var(--text)', fontWeight: 600 }}>{city.activeUsers}</td>
                    <td style={{ textAlign: 'left', color: "#0ea5e9", fontWeight: 600 }}>{activePercent}%</td>
                    <td style={{ textAlign: 'left', color: 'var(--text)', fontWeight: 600 }}>{city.averageAge}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Cities;
