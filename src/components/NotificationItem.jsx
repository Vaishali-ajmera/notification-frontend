import React from 'react';
import './NotificationItem.css';

function NotificationItem({ 
    notification, 
    isSelected, 
    onSelect, 
    onClick 
}) {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        
        return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        return `${displayHours}:${minutes}:${date.getSeconds().toString().padStart(2, '0')} ${ampm}`;
    };

    return (
        <div 
            className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
        >
            <div className="notification-checkbox">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                        e.stopPropagation();
                        onSelect(notification.id);
                    }}
                />
            </div>
            
            <div 
                className="notification-content"
                onClick={() => onClick(notification.id)}
            >
                <div className="notification-header">
                    <h4 className="notification-title">
                        {notification.title}
                        {!notification.is_read && (
                            <span className="unread-indicator">●</span>
                        )}
                    </h4>
                </div>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-timestamp">
                    {formatDate(notification.timestamp)}
                </span>
            </div>
        </div>
    );
}

export default NotificationItem;
