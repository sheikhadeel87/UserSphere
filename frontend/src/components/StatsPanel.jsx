import { FaCity, FaUsers, FaUserCheck, FaChartBar } from 'react-icons/fa';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function StatsPanel({ stats, totalUsers, totalCities, cityNames }) {
  // Split city stats for layout: 3 in first row, 2 in second row
  const firstRow = stats.slice(0, 3);
  const secondRow = stats.slice(3, 5);
  // Accent palette for city cards
  const accents = [
    { grad: 'linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)', color: '#198754', icon: <FaCity size={18} /> },
    { grad: 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)', color: '#0d6efd', icon: <FaUsers size={18} /> },
    { grad: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', color: '#f59e42', icon: <FaUserCheck size={18} /> },
    { grad: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)', color: '#e83e8c', icon: <FaChartBar size={18} /> },
    { grad: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)', color: '#6c757d', icon: <FaCity size={18} /> },
  ];

  const navigate = useNavigate();

  return (
    <div className="card stats-panel" style={{
      background: 'var(--card)',
      borderRadius: 24,
      // boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      padding: 32,
      marginBottom: 32,
      position: 'relative',
      border: '1.5px solid var(--line)',
    }}>
      <h2 style={{ margin: '0 0 16px 0 ', fontSize: 28 }}>Aggregation Stats</h2>
      <div className="stats-panel-inner" style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Active Users Card (left) */}
        <div className="card stats-card card-success shadow-sm" style={{ minWidth: 240, maxWidth: 260, marginBottom: 24,  position: 'relative', height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
          <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}>
              <span className="icon-circle" style={{ background: '#d5deda', borderRadius: '50%', padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-users text-success" aria-hidden="true" style={{ fontSize: 28 }}></i>
              </span>
            </div>
            <div>
              <div className="text-muted text-uppercase fw-bold small">Active Users</div>
              <div className="stat-value text-success" style={{ fontSize: 32, fontWeight: 700 }}>{totalUsers?.toLocaleString?.() ?? totalUsers}</div>
              <div className="text-muted text-uppercase fw-bold small" style={{ marginTop: 16 }}>Active Cities</div>
              <div className="stat-value text-success" style={{ fontSize: 32, fontWeight: 700 }}>{totalCities?.toLocaleString?.() ?? totalCities}</div>
              <div className="progress mt-4" style={{ height: 8, background: '#d5deda', marginTop: 8, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <div className="progress-bar bg-primary" role="progressbar" style={{ width: '75%', background: '#198754', height: '100%', borderRadius: 4, position: 'absolute', left: 0, top: 0 }}></div>
              </div>
            </div>
            <div className="mini-chart" style={{ display: 'flex', gap: 2, marginTop: 12, width: '100%' }}>
              <div className="chart-bar" style={{ height: '50%', flexGrow: 1, background: '#d5deda', borderRadius: 2 }}></div>
              <div className="chart-bar" style={{ height: '70%', flexGrow: 1, background: '#d5deda', borderRadius: 2 }}></div>
              <div className="chart-bar" style={{ height: '85%', flexGrow: 1, background: '#d5deda', borderRadius: 2 }}></div>
              <div className="chart-bar" style={{ height: '75%', flexGrow: 1, background: '#d5deda', borderRadius: 2 }}></div>
              <div className="chart-bar" style={{ height: '85%', flexGrow: 1, background: '#d5deda', borderRadius: 2 }}></div>
            </div>
            <div style={{ marginTop: 16, fontSize: 13, color: '#555' }}>
              <span>Total Cities: {totalCities}</span><br />
              <span>City Names: {cityNames && cityNames.length > 0 ? cityNames.join(', ') : 'None'}</span>
            </div>
          </div>
        </div>
        {/* City Cards (right) */}
        <div className="stats-panel-cities" style={{ flex: 1, minWidth: 0 }}>
          {/* First row: 3 city cards */}
          <div className="stats-panel-row" style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
            {firstRow.map((item, idx) => {
              const accent = accents[idx % accents.length];
              const percentActive = item.totalUsers ? Math.round((item.activeUsers / item.totalUsers) * 100) : 0;
              return (
                <div className="card stats-card stats-panel-city-card shadow-sm" style={{ minWidth: 180, flex: '1 1 0', position: 'relative', background: 'var(--card)', border: '1px solid var(--line)',  borderRadius: 18, padding: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }} key={item.city}>
                  <div className="card-body" style={{ padding: 20, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 13, right: 15, zIndex: 1 }}>
                      <span style={{ background: accent.grad, borderRadius: '50%', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <span style={{ color: accent.color, zIndex: 2 }}>{accent.icon}</span>
                      </span>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: accent.color, marginBottom: 2 }}>{item.city || 'Unknown'}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#bbb', fontWeight: 600, textTransform: 'uppercase' }}>Users</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#222' }}>{item.totalUsers}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: '#bbb', fontWeight: 600, textTransform: 'uppercase' }}>Active</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: accent.color }}>{item.activeUsers}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: '#bbb', fontWeight: 600, textTransform: 'uppercase' }}>Avg Age</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#222' }}>{item.averageAge ?? 0}</div>
                      </div>
                    </div>
                    <div style={{ width: '100%', marginTop: 12, marginBottom: 2 }}>
                      <div style={{ height: 10, background: '#f0f1f3', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ width: `${percentActive}%`, background: accent.grad, height: '100%', borderRadius: 8, position: 'absolute', left: 0, top: 0, transition: 'width 0.4s' }}></div>
                      </div>
                      <div style={{ fontSize: 11, color: accent.color, marginTop: 4, textAlign: 'right', fontWeight: 600 }}>{percentActive}% Active</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Second row: 2 city cards only – no buttons in row to avoid empty space */}
          <div className="stats-panel-row" style={{ display: 'flex', gap: 24 }}>
            {secondRow.map((item, idx) => {
              const accent = accents[(idx + 3) % accents.length];
              const percentActive = item.totalUsers ? Math.round((item.activeUsers / item.totalUsers) * 100) : 0;
              return (
                <div className="card stats-card stats-panel-city-card shadow-sm" style={{ minWidth: 180, flex: '1 1 0', position: 'relative', background: 'var(--card)',border: '1px solid var(--line)', borderRadius: 18, padding: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }} key={item.city}>
                  <div className="card-body" style={{ padding: 20, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 18, right: 18, zIndex: 1 }}>
                      <span style={{ background: accent.grad, borderRadius: '50%', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <span style={{ color: accent.color, zIndex: 2 }}>{accent.icon}</span>
                      </span>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: accent.color, marginBottom: 2 }}>{item.city || 'Unknown'}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#bbb', fontWeight: 600, textTransform: 'uppercase' }}>Users</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#222' }}>{item.totalUsers}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: '#bbb', fontWeight: 600, textTransform: 'uppercase' }}>Active</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: accent.color }}>{item.activeUsers}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: '#bbb', fontWeight: 600, textTransform: 'uppercase' }}>Avg Age</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#222' }}>{item.averageAge ?? 0}</div>
                      </div>
                    </div>
                    <div style={{ width: '100%', marginTop: 12, marginBottom: 2 }}>
                      <div style={{ height: 10, background: '#f0f1f3', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ width: `${percentActive}%`, background: accent.grad, height: '100%', borderRadius: 8, position: 'absolute', left: 0, top: 0, transition: 'width 0.4s' }}></div>
                      </div>
                      <div style={{ fontSize: 11, color: accent.color, marginTop: 4, textAlign: 'right', fontWeight: 600 }}>{percentActive}% Active</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {cityNames && cityNames.length > 5 && (
            <div className="stats-panel-cta-wrap" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                className="stats-panel-cta-btn"
                onClick={() => navigate('/cities')}
              >
                Total Cities <i className="fa fa-arrow-right" style={{ marginLeft: 8 }}></i>
              </button>
              <button
                type="button"
                className="stats-panel-cta-btn stats-panel-cta-btn-second"
                style={{ marginTop: 0 }}
                onClick={() => navigate('/graphicalView')}
              >
                Graphical View <i className="fa fa-arrow-right" style={{ marginLeft: 8 }}></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
