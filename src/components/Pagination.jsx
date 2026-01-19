import React from 'react';
import './Pagination.css';

function Pagination({ 
    currentPage, 
    totalPages, 
    totalCount,
    hasNext, 
    hasPrevious, 
    onPageChange 
}) {
    if (totalCount === 0) return null;

    return (
        <div className="pagination">
            <button
                className="pagination-btn"
                disabled={!hasPrevious}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 19l-7-7 7-7"/>
                </svg>
                Previous
            </button>
            
            <span className="page-info">
                Page {currentPage} of {totalPages}
            </span>
            
            <button
                className="pagination-btn"
                disabled={!hasNext}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    );
}

export default Pagination;
