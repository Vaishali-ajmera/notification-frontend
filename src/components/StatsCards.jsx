import React from 'react';
import './StatsCards.css';

function StatsCards({ stats }) {
    return (
        <div className="stats-cards">
            <div className="stat-card">
                <h2 className="stat-value">{stats.total.toLocaleString()}</h2>
                <p className="stat-label">TOTAL</p>
            </div>
            <div className="stat-card stat-unread">
                <h2 className="stat-value">{stats.unread.toLocaleString()}</h2>
                <p className="stat-label">UNREAD</p>
            </div>
            <div className="stat-card stat-read">
                <h2 className="stat-value">{stats.read.toLocaleString()}</h2>
                <p className="stat-label">READ</p>
            </div>
        </div>
    );
}

export default StatsCards;
