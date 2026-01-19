const API_BASE = 'http://localhost:8000/api';

export const notificationAPI = {
    // Get paginated notifications (infinite scroll)
    async getNotifications(params = {}) {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.search) queryParams.append('search', params.search);
        if (params.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params.ordering) queryParams.append('ordering', params.ordering);
        
        const url = `${API_BASE}/notifications/?${queryParams}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    },

    // Get statistics
    async getStats() {
        const response = await fetch(`${API_BASE}/notifications/stats/`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    },

    // Mark single notification as read
    async markAsRead(id) {
        const response = await fetch(`${API_BASE}/notifications/${id}/read/`, {
            method: 'PATCH',
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    },

    // Bulk mark as read
    async bulkMarkAsRead(notificationIds) {
        const response = await fetch(`${API_BASE}/notifications/bulk-read/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notification_ids: notificationIds }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    },

    // Bulk delete
    async bulkDelete(notificationIds) {
        const response = await fetch(`${API_BASE}/notifications/bulk-delete/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notification_ids: notificationIds }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    },

    // Generate mock data
    async generateMockData(count = 100) {
        const response = await fetch(`${API_BASE}/notifications/generate/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    },
};
