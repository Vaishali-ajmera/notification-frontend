import React from 'react';
import './BulkActions.css';

function BulkActions({ 
    selectedCount, 
    onMarkAsRead, 
    onDelete, 
    onClearSelection,
    isProcessing 
}) {
    if (selectedCount === 0) return null;

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedCount} notification(s)?`)) {
            onDelete();
        }
    };

    return (
        <div className="bulk-actions">
            <span className="selection-count">
                {selectedCount} notification{selectedCount !== 1 ? 's' : ''} selected
            </span>
            
            <div className="action-buttons">
                <button 
                    className="action-btn mark-read-btn"
                    onClick={onMarkAsRead}
                    disabled={isProcessing}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Mark as Read
                </button>
                
                <button 
                    className="action-btn delete-btn"
                    onClick={handleDelete}
                    disabled={isProcessing}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                    Delete
                </button>
                
                <button 
                    className="action-btn clear-btn"
                    onClick={onClearSelection}
                    disabled={isProcessing}
                >
                    Clear Selection
                </button>
            </div>
        </div>
    );
}

export default BulkActions;
