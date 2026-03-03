import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPredictions } from '../services/api';

const RANGE_OPTIONS = [
  { value: 'last7', label: 'Last 7 days' },
  { value: 'last30', label: 'Last 30 days' },
  { value: 'thisMonth', label: 'This month' },
  { value: 'month', label: 'Specific month', needsMonth: true },
  { value: 'custom', label: 'Custom range', needsCustom: true }
];

const Predictions = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('last30');
    const [month, setMonth] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    const fetchData = async (customStart, customEnd) => {
        setLoading(true);
        setError('');
        try {
            const params = { filterType };
            if (filterType === 'month' && month) params.month = month;
            if (filterType === 'custom' && (customStart || startDate) && (customEnd || endDate)) {
                params.startDate = customStart || startDate;
                params.endDate = customEnd || endDate;
            }
            const result = await getPredictions(params);
            setData(result);
        } catch (err) {
            setError(err.message || 'Failed to fetch predictions');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filterType === 'custom') return;
        if (filterType === 'month' && !month) return;
        fetchData();
    }, [filterType, month]);

    const handleApplyCustom = () => {
        if (filterType === 'custom' && startDate && endDate) fetchData(startDate, endDate);
    };

    const selectedOption = RANGE_OPTIONS.find(o => o.value === filterType);

    if (loading && !data) return <div className="predictions-loading">Loading predictions...</div>;
    if (error && !data) return <div className="predictions-error">{error}</div>;
    if (!data) return null;

    const chartData = [
        ...data.historicalData.map(d => ({ date: d.date, actual: d.count })),
        ...data.dailyForecast.map(d => ({ date: d.date, predicted: d.predicted }))
    ];

    const trendColors = {
        increasing: '#10b981',
        stable: '#f59e0b',
        declining: '#ef4444'
    };

    const rangeLabel = data.range ? `${data.range.start} → ${data.range.end} (${data.range.days} days)` : '';

    return (
        <div className="site-container">
            <h2 className="report-title" style={{ fontSize: 28 }}>AI Growth Predictions</h2>
            <div className="main-card">

                {/* Range filter */}
                <div className="predictions-filters" style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--text)' }}
                    >
                        {RANGE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {selectedOption?.needsMonth && (
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--text)' }}
                        />
                    )}
                    {selectedOption?.needsCustom && (
                        <>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--text)' }} />
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--text)' }} />
                            <button type="button" onClick={handleApplyCustom} className="searchbar-btn">Apply</button>
                        </>
                    )}
                    {rangeLabel && <span style={{ color: 'var(--muted)', fontSize: 14 }}>{rangeLabel}</span>}
                </div>

                {/* Stats Cards */}
                <div className="predictions-stats">
                    <div className="stat-card">
                        <span className="stat-label">Current Users</span>
                        <span className="stat-value">{data.current.totalUsers}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Period Growth</span>
                        <span className="stat-value">+{data.current.periodGrowth}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Predicted (Next {data.range?.forecastDays || 30} Days)</span>
                        <span className="stat-value">+{data.prediction.nextPeriod}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Projected Total</span>
                        <span className="stat-value">{data.prediction.projectedTotal}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Trend</span>
                        <span className="stat-value" style={{ color: trendColors[data.prediction.growthTrend] }}>
                            {data.prediction.growthTrend.toUpperCase()}
                        </span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Confidence</span>
                        <span className="stat-value">{data.prediction.confidenceScore}%</span>
                    </div>
                </div>

                {/* Chart */}
                <div className="predictions-chart">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--muted)" />
                            <YAxis stroke="var(--muted)" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={2} name="Actual" dot={false} />
                            <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Predicted" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    
  );
};

export default Predictions;