import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ 
    search, 
    onSearchChange, 
    filter, 
    onFilterChange, 
    onGenerateMock,
    isGenerating 
}) {
    const [mockCount, setMockCount] = useState(1000);

    const handleGenerate = () => {
        onGenerateMock(mockCount);
    };

    return (
        <div className="search-bar">
            <div className="search-section">
                <div className="search-input-wrapper">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search notifications..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => onFilterChange('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                        onClick={() => onFilterChange('unread')}
                    >
                        Unread
                    </button>
                    <button
                        className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
                        onClick={() => onFilterChange('read')}
                    >
                        Read
                    </button>
                </div>
            </div>

            <div className="generate-section">
                <button 
                    className="generate-btn"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Generating...' : `Generate ${mockCount} Mock`}
                </button>
            </div>
        </div>
    );
}

export default SearchBar;
