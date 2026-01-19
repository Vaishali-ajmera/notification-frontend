import { useState, useCallback, useEffect, useRef } from 'react';
import { notificationAPI } from '../services/api';

export function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const limit = 50;
    
    // Track if filters changed to reset list
    const isResetting = useRef(false);

    // Fetch notifications (initial or load more)
    const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        setError(null);
        
        try {
            const data = await notificationAPI.getNotifications({
                page: pageNum,
                limit: limit,
                status: filter,
                search: search,
                ordering: '-timestamp',
            });
            
            const newNotifications = data.notifications || data.results || [];
            
            if (append) {
                // Append for infinite scroll
                setNotifications(prev => [...prev, ...newNotifications]);
            } else {
                // Replace for initial load or filter change
                setNotifications(newNotifications);
            }
            
            setPage(data.page || pageNum);
            setTotalPages(data.totalPages || Math.ceil((data.count || 0) / limit));
            setHasMore(data.hasMore !== undefined ? data.hasMore : !!data.next);
            
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to fetch notifications');
            if (!append) {
                setNotifications([]);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
            isResetting.current = false;
        }
    }, [filter, search]);

    // Load more notifications (for infinite scroll)
    const loadMore = useCallback(() => {
        if (loadingMore || loading || !hasMore) return;
        fetchNotifications(page + 1, true);
    }, [fetchNotifications, page, loadingMore, loading, hasMore]);

    // Reset and fetch when filters change
    const resetAndFetch = useCallback(() => {
        isResetting.current = true;
        setPage(1);
        setHasMore(true);
        setNotifications([]);
        fetchNotifications(1, false);
    }, [fetchNotifications]);

    // Add new notification to the top
    const addNotification = useCallback((notification) => {
        setNotifications(prev => [notification, ...prev]);
    }, []);

    // Mark single as read
    const markAsRead = useCallback(async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            return true;
        } catch (err) {
            console.error('Error marking as read:', err);
            return false;
        }
    }, []);

    // Bulk mark as read
    const bulkMarkAsRead = useCallback(async (ids) => {
        try {
            await notificationAPI.bulkMarkAsRead(ids);
            setNotifications(prev => 
                prev.map(n => ids.includes(n.id) ? { ...n, is_read: true } : n)
            );
            return true;
        } catch (err) {
            console.error('Error bulk marking as read:', err);
            return false;
        }
    }, []);

    // Bulk delete
    const bulkDelete = useCallback(async (ids) => {
        try {
            await notificationAPI.bulkDelete(ids);
            setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
            return true;
        } catch (err) {
            console.error('Error bulk deleting:', err);
            return false;
        }
    }, []);

    // Generate mock data
    const generateMockData = useCallback(async (count = 100) => {
        try {
            const result = await notificationAPI.generateMockData(count);
            resetAndFetch();
            return result;
        } catch (err) {
            console.error('Error generating mock data:', err);
            throw err;
        }
    }, [resetAndFetch]);

    // Initial fetch
    useEffect(() => {
        fetchNotifications(1, false);
    }, []);

    // Refetch when filter or search changes
    useEffect(() => {
        resetAndFetch();
    }, [filter, search]);

    return {
        notifications,
        page,
        totalPages,
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
    };
}
