import React, { useRef, useCallback, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import './NotificationList.css';

function NotificationList({ 
    notifications, 
    loading,
    loadingMore,
    error,
    hasMore,
    selectedIds, 
    onSelectOne, 
    onSelectAll,
    onNotificationClick,
    onLoadMore
}) {
    const containerRef = useRef(null);
    const allSelected = notifications.length > 0 && selectedIds.length === notifications.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < notifications.length;

    // Infinite scroll handler
    const handleScroll = useCallback(() => {
        if (!containerRef.current || loadingMore || !hasMore) return;
        
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        
        // Load more when scrolled to 80% of the list
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            onLoadMore();
        }
    }, [loadingMore, hasMore, onLoadMore]);

    // Attach scroll listener
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    if (loading && notifications.length === 0) {
        return (
            <div className="notification-list">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading notifications...</p>
                </div>
            </div>
        );
    }

    if (error && notifications.length === 0) {
        return (
            <div className="notification-list">
                <div className="error-state">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="notification-list">
            <div className="list-header">
                <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                    }}
                    onChange={onSelectAll}
                />
                <span className="select-all-label">
                    {selectedIds.length > 0 
                        ? `${selectedIds.length} selected` 
                        : 'Select all'
                    }
                </span>
            </div>

            <div className="notifications-container" ref={containerRef}>
                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M18.364 5.636a9 9 0 11-12.728 0M12 9v4m0 4h.01"/>
                        </svg>
                        <p>No notifications found</p>
                    </div>
                ) : (
                    <>
                        {notifications.map(notification => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                isSelected={selectedIds.includes(notification.id)}
                                onSelect={onSelectOne}
                                onClick={onNotificationClick}
                            />
                        ))}
                        
                        {/* Loading more indicator */}
                        {loadingMore && (
                            <div className="loading-more">
                                <div className="loading-spinner-small"></div>
                                <span>Loading more...</span>
                            </div>
                        )}
                        
                        {/* End of list indicator */}
                        {!hasMore && notifications.length > 0 && (
                            <div className="end-of-list">
                                <span>You've reached the end</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default NotificationList;
