import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000'; // Backend must run on this port

export function useSocket(onConnect, onDisconnect) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'], // force WebSocket for stability
      reconnectionAttempts: 5,
      timeout: 2000,
    });
    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
      if (onConnect) onConnect();
    });
    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (onDisconnect) onDisconnect();
    });
    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [onConnect, onDisconnect]);

  return socketRef;
}
