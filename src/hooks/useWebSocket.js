import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = 'ws://localhost:8000/ws/notifications/';

export function useWebSocket(onNotification, onStatsUpdate) {
    const [isConnected, setIsConnected] = useState(false);
    const [stats, setStats] = useState({ total: 0, read: 0, unread: 0 });
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttempts = useRef(0);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        try {
            const ws = new WebSocket(WS_URL);

            ws.onopen = () => {
                console.log('✅ WebSocket connected');
                setIsConnected(true);
                reconnectAttempts.current = 0;
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 WS Message:', data);

                    switch (data.type) {
                        case 'connection_established':
                            if (data.stats) {
                                setStats(data.stats);
                                if (onStatsUpdate) onStatsUpdate(data.stats);
                            }
                            break;
                        
                        case 'new_notification':
                            if (onNotification) onNotification(data.notification);
                            break;
                        
                        case 'stats_update':
                            if (data.stats) {
                                setStats(data.stats);
                                if (onStatsUpdate) onStatsUpdate(data.stats);
                            }
                            break;
                        
                        case 'pong':
                            console.log('🏓 Pong received');
                            break;
                        
                        default:
                            console.log('Unknown message type:', data.type);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                setIsConnected(false);
                wsRef.current = null;
                
                const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
                reconnectAttempts.current += 1;
                
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log(`🔄 Reconnecting (attempt ${reconnectAttempts.current})...`);
                    connect();
                }, delay);
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('Error creating WebSocket:', error);
        }
    }, [onNotification, onStatsUpdate]);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connect]);

    useEffect(() => {
        const pingInterval = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'ping' }));
            }
        }, 30000);

        return () => clearInterval(pingInterval);
    }, []);

    const refreshStats = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'refresh_stats' }));
        }
    }, []);

    return { isConnected, stats, refreshStats };
}
