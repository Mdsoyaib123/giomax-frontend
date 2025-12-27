// src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, useRef, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  debugInfo: {
    connectionStatus: string;
    lastEvent: string;
    events: string[];
  };
  clearDebug: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  debugInfo: {
    connectionStatus: 'disconnected',
    lastEvent: '',
    events: []
  },
  clearDebug: () => {}
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [debugInfo, setDebugInfo] = useState({
    connectionStatus: 'disconnected',
    lastEvent: '',
    events: [] as string[]
  });

  // FIXED: Get user info properly
  const getUserInfo = () => {
    try {
      const userData = localStorage.getItem('user');
      const token = Cookies.get('token') || localStorage.getItem('token');
      
      if (!userData || !token) {
        console.error('❌ No user data or token found');
        return null;
      }
      
      const user = JSON.parse(userData);
      
      // FIX: Ensure _id field exists
      return { 
        user: { 
          _id: user._id || user.id,  // Use _id for consistency
          id: user._id || user.id,
          role: user.role,
          name: user.name
        }, 
        token 
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  };

  const addDebugEvent = useCallback((event: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    const eventMessage = `[${timestamp}] ${event}${data ? `: ${JSON.stringify(data).slice(0, 100)}` : ''}`;
    
    setDebugInfo(prev => ({
      ...prev,
      lastEvent: eventMessage,
      events: [eventMessage, ...prev.events.slice(0, 49)]
    }));
    
    console.log(`🔧 DEBUG: ${eventMessage}`);
  }, []);

  const connect = useCallback(() => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      console.error('❌ Cannot connect: Missing user data or token');
      addDebugEvent('connect_failed', 'No user info');
      setIsConnected(false);
      setDebugInfo(prev => ({ ...prev, connectionStatus: 'disconnected' }));
      return;
    }

    const { user, token } = userInfo;

    // Disconnect existing socket using functional update
    setSocket(prevSocket => {
      if (prevSocket) {
        console.log('🔄 Disconnecting previous socket');
        prevSocket.disconnect();
        addDebugEvent('disconnect_previous');
        socketRef.current = null;
      }
      return null;
    });

    console.log('🔌 Attempting socket connection...', { userId: user._id, role: user.role });
    addDebugEvent('connect_attempt', { userId: user._id, role: user.role });

    const newSocket = io('https://giomaxatadxe-backend.onrender.com', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      auth: { 
        token,
        userId: user._id,
        userRole: user.role
      }
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      addDebugEvent('connected', { socketId: newSocket.id });
      setIsConnected(true);
      setDebugInfo(prev => ({ ...prev, connectionStatus: 'connected' }));
      
      // Join user's room
      newSocket.emit('join_room', user._id);
      addDebugEvent('joined_room', user._id);
      
      // If admin, also join admin room
      if (user.role === 'admin') {
        newSocket.emit('join_room', 'ADMIN_ROOM');
        addDebugEvent('joined_room', 'ADMIN_ROOM');
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      addDebugEvent('disconnected', { reason });
      setIsConnected(false);
      setDebugInfo(prev => ({ ...prev, connectionStatus: 'disconnected' }));
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 Connection error:', error.message);
      addDebugEvent('connect_error', error.message);
      setIsConnected(false);
      setDebugInfo(prev => ({ ...prev, connectionStatus: 'error' }));
    });

    newSocket.on('reconnect_attempt', (attempt) => {
      console.log('🔄 Reconnection attempt:', attempt);
      addDebugEvent('reconnect_attempt', attempt);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('✅ Reconnected after', attemptNumber, 'attempts');
      addDebugEvent('reconnected', { attemptNumber });
      setIsConnected(true);
      setDebugInfo(prev => ({ ...prev, connectionStatus: 'connected' }));
      
      // Rejoin rooms after reconnection
      newSocket.emit('join_room', user._id);
      addDebugEvent('rejoined_room', user._id);
      
      if (user.role === 'admin') {
        newSocket.emit('join_room', 'ADMIN_ROOM');
        addDebugEvent('rejoined_room', 'ADMIN_ROOM');
      }
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed');
      addDebugEvent('reconnect_failed');
      setIsConnected(false);
      setDebugInfo(prev => ({ ...prev, connectionStatus: 'disconnected' }));
    });

    const originalEmit = newSocket.emit.bind(newSocket);
    newSocket.emit = (event: string, ...args: any[]) => {
      addDebugEvent(`emit_${event}`, args[0]);
      return originalEmit(event, ...args);
    };

    newSocket.onAny((event, ...args) => {
      addDebugEvent(`on_${event}`, args[0]);
    });

    setSocket(newSocket);
    socketRef.current = newSocket;
  }, [addDebugEvent]);

  const disconnect = useCallback(() => {
    setSocket(prevSocket => {
      if (prevSocket) {
        prevSocket.disconnect();
        setIsConnected(false);
        addDebugEvent('manual_disconnect');
        socketRef.current = null;
        return null;
      }
      return prevSocket;
    });
  }, [addDebugEvent]);

  const clearDebug = useCallback(() => {
    setDebugInfo({
      connectionStatus: debugInfo.connectionStatus,
      lastEvent: debugInfo.lastEvent,
      events: []
    });
  }, [debugInfo.connectionStatus, debugInfo.lastEvent]);

  // Initial connection on mount
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      console.log('🚀 Initializing socket connection...');
      connect();
    } else {
      console.error('❌ Cannot initialize socket: Missing user data or token');
      console.log('User data:', localStorage.getItem('user'));
      console.log('Token:', Cookies.get('token') || localStorage.getItem('token'));
    }
  }, [connect]);

  // Cleanup socket when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup on unmount - use ref to get current socket
      if (socketRef.current) {
        console.log('🧹 Cleaning up socket connection on unmount');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
      connect, 
      disconnect,
      debugInfo,
      clearDebug
    }}>
      {children}
    </SocketContext.Provider>
  );
};










// // src/contexts/SocketContext.tsx
// import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
// import { io, Socket } from 'socket.io-client';
// import Cookies from 'js-cookie';

// interface SocketContextType {
//   socket: Socket | null;
//   isConnected: boolean;
//   connect: () => void;
//   disconnect: () => void;
//   debugInfo: {
//     connectionStatus: string;
//     lastEvent: string;
//     events: string[];
//   };
//   clearDebug: () => void;
// }

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   isConnected: false,
//   connect: () => {},
//   disconnect: () => {},
//   debugInfo: {
//     connectionStatus: 'disconnected',
//     lastEvent: '',
//     events: []
//   },
//   clearDebug: () => {}
// });

// export const useSocket = () => useContext(SocketContext);

// interface SocketProviderProps {
//   children: ReactNode;
// }

// export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [debugInfo, setDebugInfo] = useState({
//     connectionStatus: 'disconnected',
//     lastEvent: '',
//     events: [] as string[]
//   });

//   const getUserInfo = () => {
//     try {
//       const userData = localStorage.getItem('user');
//       const token = Cookies.get('token') || localStorage.getItem('token');
      
//       if (!userData || !token) {
//         console.error('❌ No user data or token found');
//         return null;
//       }
      
//       const user = JSON.parse(userData);
//       return { 
//         user: { 
//           id: user._id || user.id, 
//           role: user.role,
//           name: user.name
//         }, 
//         token 
//       };
//     } catch (error) {
//       console.error('Error getting user info:', error);
//       return null;
//     }
//   };

//   const addDebugEvent = useCallback((event: string, data?: any) => {
//     const timestamp = new Date().toLocaleTimeString();
//     const eventMessage = `[${timestamp}] ${event}${data ? `: ${JSON.stringify(data).slice(0, 100)}` : ''}`;
    
//     setDebugInfo(prev => ({
//       ...prev,
//       lastEvent: eventMessage,
//       events: [eventMessage, ...prev.events.slice(0, 49)]
//     }));
    
//     console.log(`🔧 DEBUG: ${eventMessage}`);
//   }, []);

//   const connect = useCallback(() => {
//     const userInfo = getUserInfo();
//     if (!userInfo) {
//       addDebugEvent('connect_failed', 'No user info');
//       return;
//     }

//     const { user, token } = userInfo;

//     if (socket) {
//       socket.disconnect();
//       addDebugEvent('disconnect_previous');
//     }

//     addDebugEvent('connect_attempt', { userId: user.id, role: user.role });

//     const newSocket = io('https://giomaxatadxe-backend.onrender.com', {
//       path: '/socket.io',
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       timeout: 20000,
//       auth: { 
//         token,
//         userId: user.id,
//         userRole: user.role
//       },
//       query: {
//         userId: user.id,
//         userRole: user.role,
//         userName: user.name
//       }
//     });

//     newSocket.on('connect', () => {
//       console.log('✅ Socket connected:', newSocket.id);
//       addDebugEvent('connected', { socketId: newSocket.id });
//       setIsConnected(true);
//       setDebugInfo(prev => ({ ...prev, connectionStatus: 'connected' }));
      
//       // Join user's personal room
//       newSocket.emit('join_room', user.id);
//       addDebugEvent('joined_room', user.id);
      
//       // If admin, also join admin room
//       if (user.role === 'admin') {
//         newSocket.emit('join_room', 'ADMIN_ROOM');
//         addDebugEvent('joined_room', 'ADMIN_ROOM');
//       }
//     });

//     newSocket.on('disconnect', (reason) => {
//       console.log('❌ Socket disconnected:', reason);
//       addDebugEvent('disconnected', { reason });
//       setIsConnected(false);
//       setDebugInfo(prev => ({ ...prev, connectionStatus: 'disconnected' }));
//     });

//     newSocket.on('connect_error', (error) => {
//       console.error('🔴 Connection error:', error.message);
//       addDebugEvent('connect_error', error.message);
//       setIsConnected(false);
//       setDebugInfo(prev => ({ ...prev, connectionStatus: 'error' }));
//     });

//     newSocket.on('reconnect_attempt', (attempt) => {
//       addDebugEvent('reconnect_attempt', attempt);
//     });

//     newSocket.on('reconnect', () => {
//       addDebugEvent('reconnected');
//       setIsConnected(true);
//       setDebugInfo(prev => ({ ...prev, connectionStatus: 'connected' }));
//     });

//     const originalEmit = newSocket.emit.bind(newSocket);
//     newSocket.emit = (event: string, ...args: any[]) => {
//       addDebugEvent(`emit_${event}`, args[0]);
//       return originalEmit(event, ...args);
//     };

//     newSocket.onAny((event, ...args) => {
//       addDebugEvent(`on_${event}`, args[0]);
//     });

//     setSocket(newSocket);
    
//     return () => {
//       if (newSocket) {
//         newSocket.disconnect();
//       }
//     };
//   }, [socket, addDebugEvent]);

//   const disconnect = useCallback(() => {
//     if (socket) {
//       socket.disconnect();
//       setSocket(null);
//       setIsConnected(false);
//       addDebugEvent('manual_disconnect');
//     }
//   }, [socket, addDebugEvent]);

//   const clearDebug = useCallback(() => {
//     setDebugInfo({
//       connectionStatus: debugInfo.connectionStatus,
//       lastEvent: debugInfo.lastEvent,
//       events: []
//     });
//   }, [debugInfo.connectionStatus, debugInfo.lastEvent]);

//   useEffect(() => {
//     const userInfo = getUserInfo();
//     if (userInfo) {
//       connect();
//     }

//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={{ 
//       socket, 
//       isConnected, 
//       connect, 
//       disconnect,
//       debugInfo,
//       clearDebug
//     }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


 