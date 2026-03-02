import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPredictions } from '../services/api';

const Predictions = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getPredictions();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch predictions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="predictions-loading">Loading predictions...</div>;
    if (!data) return <div className="predictions-error">Failed to load predictions</div>;

    // Combine historical + forecast for chart
    const chartData = [
        ...data.historicalData.map(d => ({ date: d.date, actual: d.count })),
        ...data.dailyForecast.map(d => ({ date: d.date, predicted: d.predicted }))
    ];

    const trendColors = {
        increasing: '#10b981',
        stable: '#f59e0b',
        declining: '#ef4444'
    };

    return (
        <div className="site-container">
            <h2 className="report-title" style={{ fontSize: 28 }}>AI Growth Predictions</h2>
            <div className="main-card">

                {/* Stats Cards */}
                <div className="predictions-stats">
                    <div className="stat-card">
                        <span className="stat-label">Current Users</span>
                        <span className="stat-value">{data.current.totalUsers}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Last 30 Days</span>
                        <span className="stat-value">+{data.current.last30DaysGrowth}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Predicted (Next 30 Days)</span>
                        <span className="stat-value">+{data.prediction.next30Days}</span>
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