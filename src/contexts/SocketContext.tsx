
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from "sonner";

// Mock socket URL for demo purposes
const SOCKET_URL = 'https://api.brilink-tv.com';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  emit: (event: string, data?: any) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // For demo purposes, we'll create a mock socket implementation
    const mockSocket = {
      connected: false,
      id: 'mock-socket-id',
      on: (event: string, callback: Function) => {
        console.log(`Mock socket registered event: ${event}`);
        // Simulate connection event after a delay
        if (event === 'connect') {
          setTimeout(() => {
            mockSocket.connected = true;
            setConnected(true);
            callback();
            toast.success('Connected to BriLink TV server');
          }, 1000);
        }
      },
      emit: (event: string, data: any) => {
        console.log(`Mock socket emitted event: ${event}`, data);
        return true;
      },
      disconnect: () => {
        console.log('Mock socket disconnected');
        mockSocket.connected = false;
        setConnected(false);
      }
    } as unknown as Socket;
    
    // In a real implementation, we would use:
    // const newSocket = io(SOCKET_URL, {
    //   auth: {
    //     token: localStorage.getItem('brilink_token')
    //   },
    //   reconnection: true,
    //   reconnectionDelay: 1000,
    //   reconnectionAttempts: 5,
    // });
    
    if (isAuthenticated) {
      setSocket(mockSocket);
      
      mockSocket.on('connect', () => {
        setConnected(true);
      });
      
      mockSocket.on('disconnect', () => {
        setConnected(false);
        toast.error('Disconnected from BriLink TV server');
      });
      
      // In a real app, we would handle cleanup:
      // return () => {
      //   newSocket.disconnect();
      // };
    }
    
    return () => {
      if (mockSocket) {
        mockSocket.disconnect();
      }
    };
  }, [isAuthenticated]);
  
  const emit = (event: string, data?: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.error('Socket not connected');
    }
  };
  
  return (
    <SocketContext.Provider value={{ socket, connected, emit }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
