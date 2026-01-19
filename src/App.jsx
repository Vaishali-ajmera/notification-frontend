import React, { useState, useCallback } from 'react';
import { useNotifications } from './hooks/useNotifications';
import { useWebSocket } from './hooks/useWebSocket';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import BulkActions from './components/BulkActions';
import NotificationList from './components/NotificationList';
import './App.css';

function App() {
    const [selectedIds, setSelectedIds] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const {
        notifications,
        hasMore,
        filter,
        setFilter,
        search,
        setSearch,
        loading,
        loadingMore,
        error,
        loadMore,
        resetAndFetch,
        addNotification,
        markAsRead,
        bulkMarkAsRead,
        bulkDelete,
        generateMockData,
    } = useNotifications();

    // Handle new notification from WebSocket
    const handleNewNotification = useCallback((notification) => {
        addNotification(notification);
    }, [addNotification]);

    // Handle stats update from WebSocket
    const handleStatsUpdate = useCallback((newStats) => {
        console.log('Stats updated via WebSocket:', newStats);
    }, []);

    // Connect to WebSocket
    const { isConnected, stats, refreshStats } = useWebSocket(
        handleNewNotification,
        handleStatsUpdate
    );

    // Handle search change - reset to first page
    const handleSearchChange = (value) => {
        setSearch(value);
    };

    // Handle filter change
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setSelectedIds([]);
    };

    // Generate mock data
    const handleGenerateMock = async (count) => {
        setIsGenerating(true);
        try {
            await generateMockData(count);
            refreshStats();
        } catch (err) {
            console.error('Error generating mock data:', err);
            alert('Failed to generate mock data');
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle single notification click (mark as read)
    const handleNotificationClick = async (id) => {
        const notification = notifications.find(n => n.id === id);
        if (notification && !notification.is_read) {
            await markAsRead(id);
            refreshStats();
        }
    };

    // Toggle single selection
    const handleSelectOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    // Toggle select all
    const handleSelectAll = () => {
        if (selectedIds.length === notifications.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(notifications.map(n => n.id));
        }
    };

    // Bulk mark as read
    const handleBulkMarkAsRead = async () => {
        if (selectedIds.length === 0) return;
        
        setIsProcessing(true);
        try {
            await bulkMarkAsRead(selectedIds);
            setSelectedIds([]);
            refreshStats();
        } catch (err) {
            console.error('Error bulk marking as read:', err);
            alert('Failed to mark as read');
        } finally {
            setIsProcessing(false);
        }
    };

    // Bulk delete
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        
        setIsProcessing(true);
        try {
            await bulkDelete(selectedIds);
            setSelectedIds([]);
            refreshStats();
        } catch (err) {
            console.error('Error deleting notifications:', err);
            alert('Failed to delete notifications');
        } finally {
            setIsProcessing(false);
        }
    };

    // Clear selection
    const handleClearSelection = () => {
        setSelectedIds([]);
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-title-section">
                        <h1 className="app-title">Notification Dashboard</h1>
                        <p className="app-subtitle">Real-time notifications with optimized performance</p>
                    </div>
                    <div className="connection-status">
                        <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
                        <span className="status-text">{isConnected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                </div>
            </header>

            <main className="app-main">
                <StatsCards stats={stats} />
                
                <SearchBar
                    search={search}
                    onSearchChange={handleSearchChange}
                    filter={filter}
                    onFilterChange={handleFilterChange}
                    onGenerateMock={handleGenerateMock}
                    isGenerating={isGenerating}
                />

                <BulkActions
                    selectedCount={selectedIds.length}
                    onMarkAsRead={handleBulkMarkAsRead}
                    onDelete={handleBulkDelete}
                    onClearSelection={handleClearSelection}
                    isProcessing={isProcessing}
                />

                <NotificationList
                    notifications={notifications}
                    loading={loading}
                    loadingMore={loadingMore}
                    error={error}
                    hasMore={hasMore}
                    selectedIds={selectedIds}
                    onSelectOne={handleSelectOne}
                    onSelectAll={handleSelectAll}
                    onNotificationClick={handleNotificationClick}
                    onLoadMore={loadMore}
                />
            </main>
        </div>
    );
}

export default App;
