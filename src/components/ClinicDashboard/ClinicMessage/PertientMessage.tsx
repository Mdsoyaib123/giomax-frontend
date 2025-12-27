// src/components/UserDashboard/PatientMessage.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Check, Paperclip, Menu, X, RefreshCw, Bug } from 'lucide-react';
import { useSocket } from '@/hooks/contexts/SocketContext';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

 interface Message {
  _id: string;
  message: string;
  senderId: string;
  senderName?: string;
  receiverId?: string;
  receiverType?: string;
  chatType: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminContact {
  _id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
}

interface User {
  _id: string;
  name: string;
  email?: string;
  role: string;
  avatar?: string;
  online?: boolean;
  lastSeen?: string;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

const PatientMessage = () => {
  const { socket, isConnected, debugInfo } = useSocket();
  const location = useLocation();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patients, setPatients] = useState<User[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [adminContact, setAdminContact] = useState<AdminContact>({
    _id: 'admin',
    name: 'Support Admin',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=random',
    online: true
  });
  
  console.log('location', location);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  
  // Get current user properly
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  // Get token properly
  const getToken = () => {
    return localStorage.getItem('token') || document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
  };

  // Detect mode from location state
  useEffect(() => {
    const showAdmin = (location.state as any)?.showAdmin === true;
    setIsAdminMode(showAdmin);
    console.log('Mode detected:', showAdmin ? 'Admin Mode' : 'Patient List Mode');
  }, [location.state]);

  // Fetch clinic patients list (for patient list mode)
  const fetchClinicPatients = useCallback(async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      setError(null);
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const currentUserId = currentUser._id || currentUser.id;
      console.log('📥 Fetching clinic patients...');
      
      const response = await fetch(
        `https://giomaxatadxe-backend.onrender.com/api/v1/doctor-appointment/getSingleClinicChats/${currentUserId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Clinic patients API response:', data);

      if (data.success && Array.isArray(data.data)) {
        const formattedPatients: User[] = data.data.map((item: any) => {
          const user = item.userId || item;
          return {
            _id: user._id,
            name: user.fullName || user.name || 'Unknown Patient',
            email: user.email,
            role: user.role || 'patient',
            avatar: user.profileImage || `https://ui-avatars.com/api/?name=${user.fullName || 'Patient'}&background=random`,
            online: false,
            unreadCount: 0,
            lastMessage: '',
            lastMessageTime: ''
          };
        });

        setPatients(formattedPatients);
        console.log('✅ Fetched patients:', formattedPatients.length);
      } else {
        console.warn('⚠️ No patients array in response');
        setPatients([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching patients:', error);
      setError(error.message);
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Fetch admin data from API
  const fetchAdmin = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        console.warn('No token found for fetching admin');
        return;
      }

      console.log('📥 Fetching admin data...');
      const response = await fetch(
        'https://giomaxatadxe-backend.onrender.com/api/v1/user/get-admin',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch admin: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const admin = data.data;
        console.log('✅ Admin data loaded:', admin);
        const adminData = {
          _id: admin._id,
          name: admin.fullName || admin.name || 'Support Admin',
          role: admin.role || 'admin',
          avatar: admin.profileImage || admin.avatar || `https://ui-avatars.com/api/?name=${admin.fullName || 'Admin'}&background=random`,
          online: true
        };
        setAdminContact(adminData);
        // Auto-select admin when fetched
        if (admin._id) {
          setSelectedAdminId(admin._id);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching admin:', error);
      // Keep default adminContact on error
    }
  }, []);

  useEffect(() => {
    console.log('🔧 User Component State:', {
      isConnected,
      messagesCount: messages.length,
      currentUserId: currentUser?._id || currentUser?.id,
      adminTyping: isAdminTyping
    });
  }, [isConnected, messages.length, currentUser, isAdminTyping]);

  // Fetch messages - Updated to use selected admin ID
//   const fetchMessages = useCallback(async (adminId: string) => {
//     console.log('adminId', adminId);
//     if (!currentUser || !adminId) return;
    
//     try {
//       setIsLoading(true);
//       setError(null);
      
//       // const token = getToken(); // Current user token (sender)
//       const currentUserId = currentUser._id || currentUser.id; // Current user ID for filtering
//  const token = Cookies.get('token'); 
//  console.log('token', token);     // API expects admin ID (recipient) - same logic as SupportMessage
//       let response;
//       let endpoints = [
//         `https://giomaxatadxe-backend.onrender.com/api/v1/chatHistory/getChat/${adminId}`,  // Use selected admin ID
//       ];

//       console.log('endpoints', endpoints);
      
//       let messagesData: Message[] = [];
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`Trying endpoint: ${endpoint}`);
//           response = await fetch(endpoint, {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           });

//           console.log('response', response);
          
//           if (response.ok) {
//             const data = await response.json();
//             console.log('data', data);
//             // Handle different response formats
//             if (Array.isArray(data)) {
//               // API returns array directly (like Postman response)
//               messagesData = data;
//               console.log(`✅ Loaded ${messagesData.length} messages from ${endpoint}`);
//               break;
//             } else if (data.success && Array.isArray(data.data)) {
//               // API returns object with success and data array
//               messagesData = data.data;
//               console.log(`✅ Loaded ${messagesData.length} messages from ${endpoint}`);
//               break;
//             } else if (data.data && Array.isArray(data.data)) {
//               // API returns object with data array
//               messagesData = data.data;
//               console.log(`✅ Loaded ${messagesData.length} messages from ${endpoint}`);
//               break;
//             }
//           }
//         } catch (err) {
//           console.log(`Endpoint ${endpoint} failed:`, err);
//           continue;
//         }
//       }
      
//       if (messagesData.length === 0 && response && !response.ok) {
//         // Try to get error message from response
//         let errorMessage = `Failed to fetch messages: ${response.status}`;
//         try {
//           const errorData = await response.json();
//           errorMessage = errorData.message || errorData.error || errorMessage;
//           console.error('❌ API Error:', errorData);
//         } catch {
//           // If response is not JSON, use default message
//         }
//         throw new Error(errorMessage);
//       }
      
//       // Filter messages: only show messages between this user and admin
//       const filteredMessages = messagesData.filter(msg => 
//         // Messages where user sent to admin OR admin sent to this user
//         (msg.senderId === currentUserId && msg.receiverType === 'admin') ||
//         (msg.receiverId === currentUserId && msg.senderId?.includes('admin')) ||
//         (msg.chatType === 'user_admin' || msg.chatType === 'admin_user')
//       );
      
//       setMessages(filteredMessages);
      
//       // Mark messages as seen
//       if (filteredMessages.length > 0) {
//         await markMessagesAsSeen(filteredMessages);
//       }
      
//     } catch (error: any) {
//       console.error('❌ Error fetching messages:', error);
//       setError(error.message || 'Failed to load messages');
//       setMessages([]);
      
//       // Don't show error if it's just "no messages" - show empty state instead
//       if (error.message.includes('404') || error.message.includes('no messages')) {
//         setError(null);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentUser]);
  

const fetchMessages = useCallback(async (targetId: string) => {
  console.log('📥 Fetching messages, mode:', isAdminMode ? 'Admin' : 'Patient', 'targetId:', targetId);
  if (!currentUser) {
    console.warn('⚠️ Missing currentUser');
    return;
  }
  
  try {
    setIsLoading(true);
    setError(null);
    
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const currentUserId = currentUser._id || currentUser.id;
    console.log('currentUserId', currentUserId);
    
    // Use new API endpoint that returns all messages for current user
    const apiUrl = `https://giomaxatadxe-backend.onrender.com/api/v1/chatHistory/admin/history`;
    
    console.log('🔗 Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      if (response.status === 404) {
        // No messages yet - show empty state instead of error
        console.log('ℹ️ No messages found (404) - showing empty state');
        setMessages([]);
        setError(null);
        return;
      }
      
      // Try to get error message from response
      let errorMessage = `Failed to fetch messages: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use default message
      }
      throw new Error(errorMessage);
    }
    
    const messagesData: Message[] = await response.json();
    console.log('📦 Response data:', messagesData);
    console.log(`✅ Loaded ${messagesData.length} messages`);
    
    // Filter messages based on mode
    let filteredMessages: Message[];
    if (isAdminMode) {
      // Admin mode: filter messages between clinic and admin
      // All messages from API are already for current user, just filter by chatType
      filteredMessages = messagesData.filter((msg: Message) => 
        msg.chatType === 'user_admin' || msg.chatType === 'admin_to_user'
      );
    } else {
      // Patient mode: filter messages between clinic and selected patient
      const patientId = selectedPatientId;
      if (patientId) {
        filteredMessages = messagesData.filter((msg: Message) => 
          // Clinic sent to patient OR patient sent to clinic
          (msg.senderId === currentUserId && msg.receiverId === patientId) ||
          (msg.senderId === patientId && msg.receiverId === currentUserId) ||
          // Fallback: match by chatType
          (msg.chatType === 'user_admin' || msg.chatType === 'admin_to_user')
        );
      } else {
        filteredMessages = [];
      }
    }
    
    console.log(`🔍 Filtered to ${filteredMessages.length} relevant messages`);
    setMessages(filteredMessages);
    setError(null); // Clear any previous errors
    
    // Mark messages as seen (don't let errors here break the flow)
    if (filteredMessages.length > 0) {
      try {
        await markMessagesAsSeen(filteredMessages);
      } catch (markError) {
        console.warn('⚠️ Error marking messages as seen:', markError);
        // Don't throw - this is not critical
      }
    }
  } catch (error: any) {
    console.error('❌ Error fetching messages:', error);
    const errorMessage = error.message || 'Failed to load messages';
    setError(errorMessage);
    setMessages([]);
    
    // Don't show error if it's just "no messages" - show empty state instead
    if (errorMessage.includes('404') || errorMessage.includes('no messages') || errorMessage.includes('not found')) {
      setError(null);
    }
  } finally {
    setIsLoading(false);
  }
}, [currentUser, isAdminMode, selectedPatientId]);





  // Handle admin selection
  const handleAdminSelect = useCallback((adminId: string) => {
    setSelectedAdminId(adminId);
    setSelectedPatientId(null); // Clear patient selection
    setIsSidebarOpen(false);
    setError(null);
    fetchMessages(adminId);
    
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  }, [fetchMessages]);

  // Handle patient selection
  const handlePatientSelect = useCallback((patientId: string) => {
    setSelectedPatientId(patientId);
    setSelectedAdminId(null); // Clear admin selection
    setIsSidebarOpen(false);
    setError(null);
    fetchMessages(patientId);
    
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  }, [fetchMessages]);

  // Mark messages as seen
  const markMessagesAsSeen = useCallback(async (messagesToMark: Message[]) => {
    const unseenMessages = messagesToMark.filter(msg => 
      msg.senderId !== (currentUser?._id || currentUser?.id) && !msg.seen
    );
    
    if (unseenMessages.length === 0 || !socket) return;
    
    try {
      const token = getToken();
      
      await Promise.all(
        unseenMessages.map(msg =>
          fetch(`https://giomaxatadxe-backend.onrender.com/api/v1/chat/mark-seen/${msg._id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        )
      );
      
      console.log(`✅ Marked ${unseenMessages.length} messages as seen`);
    } catch (error) {
      console.error('❌ Error marking messages as seen:', error);
    }
  }, [currentUser, socket]);

  // Setup socket listeners
  useEffect(() => {
    if (!socket) return;

    // FIXED: Listen for messages from admin
    const handleAdminMessage = (data: Message) => {
      console.log('📩 New message from admin:', data);
      
      // Check if this message is for current user
      const isForCurrentUser = 
        data.receiverId === (currentUser?._id || currentUser?.id) ||
        (data.receiverType === 'admin' && data.senderId === (currentUser?._id || currentUser?.id)) ||
        data.chatType === 'admin_user';
      
      if (isForCurrentUser) {
        setMessages(prev => {
          // Prevent duplicates
          const exists = prev.some(msg => msg._id === data._id);
          if (exists) return prev;
          return [...prev, data];
        });
      }
    };

    // Listen for message sent confirmation
    const handleMessageSent = (data: any) => {
      console.log('✅ Message sent confirmation:', data);
      
      // Update optimistic message with real ID
      setMessages(prev => prev.map(msg => 
        msg._id.includes('temp_') && msg.message === data.message 
          ? { ...msg, _id: data._id } 
          : msg
      ));
    };

    // Listen for typing indicator
    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      console.log('⌨️ Admin typing indicator:', data);
      // If typing is from admin (or any user that's not current user)
      if (data.userId !== (currentUser?._id || currentUser?.id)) {
        setIsAdminTyping(data.isTyping);
      }
    };

    // FIXED: Listen for correct event
    socket.on('receive_message_from_admin', handleAdminMessage);
    socket.on('message_sent', handleMessageSent);
    socket.on('user_typing', handleTyping);

    // Cleanup
    return () => {
      socket.off('receive_message_from_admin', handleAdminMessage);
      socket.off('message_sent', handleMessageSent);
      socket.off('user_typing', handleTyping);
    };
  }, [socket]); // Remove dependencies that cause infinite loop

  // Send message - FIXED
  const sendMessage = useCallback(() => {
    const hasSelectedContact = isAdminMode ? selectedAdminId : selectedPatientId;
    if (!messageInput.trim() || !socket || !isConnected || !currentUser || !hasSelectedContact) {
      console.error('❌ Cannot send message:', {
        hasMessage: !!messageInput.trim(),
        hasSocket: !!socket,
        isConnected,
        currentUserId: currentUser?._id || currentUser?.id,
        selectedAdminId,
        selectedPatientId,
        isAdminMode,
        currentUser
      });
      return;
    }

    const targetId = isAdminMode ? selectedAdminId : selectedPatientId;
    console.log('📤 Sending message:', isAdminMode ? 'to admin' : 'to patient', messageInput);

    // FIXED: Backend expects only { message } - userId comes from socket auth
    const messageData = {
      message: messageInput
    };

    // Send via socket - use appropriate event based on mode
    if (isAdminMode) {
      socket.emit('send_message_to_admin', messageData);
    } else {
      // For patient mode, use the same event or appropriate patient message event
      socket.emit('send_message_to_admin', messageData); // TODO: Update if different event needed
    }

    // Create optimistic message
    const optimisticMessage: Message = {
      _id: `temp_${Date.now()}`,
      message: messageInput,
      senderId: currentUser._id || currentUser.id,
      senderName: currentUser.name,
      receiverId: targetId || undefined,
      receiverType: isAdminMode ? 'admin' : 'user',
      chatType: isAdminMode ? 'user_admin' : 'user_admin',
      seen: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to messages immediately
    setMessages(prev => [...prev, optimisticMessage]);

    // Clear input
    setMessageInput('');

    // Focus input for next message
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  }, [messageInput, socket, isConnected, currentUser, isAdminMode, selectedAdminId, selectedPatientId]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!socket || !isConnected || !currentUser) return;
    
    socket.emit('typing', {
      userId: currentUser._id || currentUser.id,
      isTyping: true
    });
    
    // Clear typing after 1 second
    setTimeout(() => {
      if (socket) {
        socket.emit('typing', {
          userId: currentUser._id || currentUser.id,
          isTyping: false
        });
      }
    }, 1000);
  }, [socket, isConnected, currentUser]);

  // Handle key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Refresh messages
  const handleRefresh = useCallback(() => {
    if (isAdminMode && selectedAdminId) {
      fetchMessages(selectedAdminId);
    } else if (!isAdminMode && selectedPatientId) {
      fetchMessages(selectedPatientId);
    } else if (!isAdminMode) {
      fetchClinicPatients();
    }
  }, [fetchMessages, fetchClinicPatients, isAdminMode, selectedAdminId, selectedPatientId]);

  // Admin contact (static for user)
  




  // Admin contact is now fetched from API (see fetchAdmin function above)

  // Fetch data based on mode
  useEffect(() => {
    if (isAdminMode) {
      // Admin mode: fetch admin and auto-select
      fetchAdmin();
    } else {
      // Patient list mode: fetch patients list
      fetchClinicPatients();
    }
  }, [isAdminMode, fetchAdmin, fetchClinicPatients]);

  // Auto-fetch messages when admin is selected (admin mode only)
  useEffect(() => {
    if (isAdminMode && selectedAdminId && adminContact._id === selectedAdminId) {
      fetchMessages(selectedAdminId);
    }
  }, [isAdminMode, selectedAdminId, adminContact._id]); // Fetch when admin is selected

  // Auto-fetch messages when patient is selected (patient mode only)
  useEffect(() => {
    if (!isAdminMode && selectedPatientId) {
      fetchMessages(selectedPatientId);
    }
  }, [isAdminMode, selectedPatientId]); // Fetch when patient is selected

  return (
    <div className="bg-gray-50 flex justify-center">
      <div className="flex w-full bg-white rounded-lg shadow-sm h-[90vh] overflow-hidden relative">
        {/* Debug Panel */}
        {showDebug && (
          <div className="fixed top-20 right-4 w-96 max-h-96 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-50 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Socket Debug</h3>
              <button 
                onClick={() => setShowDebug(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div>User ID: {currentUser?._id || currentUser?.id || 'Not loaded'}</div>
              <div>Messages: {messages.length}</div>
              <div>Last Event: {debugInfo.lastEvent}</div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div className={`
          ${isSidebarOpen ? 'fixed inset-0 z-30 block bg-white' : 'hidden lg:block'} 
          lg:w-[280px] border-r border-gray-200 flex flex-col
        `}>
          {/* Mobile Close Button */}
          <div className="lg:hidden px-4 pt-4 pb-3 flex justify-between items-center border-b">
            <h2 className="text-base font-semibold text-gray-900 mb-1">{isAdminMode ? 'Support' : 'Patients'}</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw size={18} className={`${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {isAdminMode ? (
              // Admin Mode: Show admin contact
              (() => {
                const adminToRender = adminContact?._id ? adminContact : null;
                
                if (!adminToRender) {
                  return (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">No admin available</p>
                    </div>
                  );
                }
                
                return (
                  <div 
                    onClick={() => adminToRender._id && handleAdminSelect(adminToRender._id)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${selectedAdminId === adminToRender._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={adminToRender.avatar} alt={adminToRender.name} className="w-11 h-11 rounded-full object-cover" />
                      {adminToRender.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{adminToRender.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 truncate">Support Team</p>
                        {isAdminTyping && (
                          <span className="text-xs text-blue-500 animate-pulse">
                            typing...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              // Patient Mode: Show patient list
              error ? (
                <div className="p-4 text-center">
                  <p className="text-red-500 text-sm">{error}</p>
                  <button 
                    onClick={() => fetchClinicPatients()}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              ) : isLoading && patients.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading patients...</p>
                </div>
              ) : patients.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No patients found</p>
                  <button 
                    onClick={() => fetchClinicPatients()}
                    className="mt-2 text-blue-500 hover:text-blue-600"
                  >
                    Refresh
                  </button>
                </div>
              ) : (
                patients.map((patient) => (
                  <div
                    key={patient._id}
                    onClick={() => handlePatientSelect(patient._id)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${selectedPatientId === patient._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={patient.avatar} 
                        alt={patient.name} 
                        className="w-11 h-11 rounded-full object-cover" 
                      />
                      {patient.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{patient.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{patient.role || 'Patient'}</p>
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          {/* Connection Status */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="text-gray-500 hover:text-gray-700"
                title="Debug Info"
              >
                <Bug size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={20} />
              </button>
              {isAdminMode ? (
                <>
                  <img src={adminContact.avatar} alt={adminContact.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">{adminContact.name}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Support Team</span>
                      <span className="text-xs text-green-600">• Online</span>
                      {isAdminTyping && (
                        <span className="text-xs text-blue-500 animate-pulse">
                          typing...
                        </span>
                      )}
                    </div>
                  </div>
                </>
              ) : selectedPatientId ? (
                (() => {
                  const selectedPatient = patients.find(p => p._id === selectedPatientId);
                  return selectedPatient ? (
                    <>
                      <img src={selectedPatient.avatar} alt={selectedPatient.name} className="w-11 h-11 rounded-full object-cover" />
                      <div>
                        <h2 className="text-base font-semibold text-gray-900">{selectedPatient.name}</h2>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{selectedPatient.role || 'Patient'}</span>
                          {selectedPatient.online && <span className="text-xs text-green-600">• Online</span>}
                        </div>
                      </div>
                    </>
                  ) : null;
                })()
              ) : (
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Select a patient</h2>
                  <span className="text-xs text-gray-500">Choose a patient to start chatting</span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Refresh messages"
            >
              <RefreshCw size={18} className={`${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-white">
            {((isAdminMode && !selectedAdminId) || (!isAdminMode && !selectedPatientId)) ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-500 text-center max-w-md">
                  {isAdminMode 
                    ? 'Select an admin from the sidebar to start chatting.'
                    : 'Select a patient from the sidebar to start chatting.'}
                </p>
              </div>
            ) : isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading messages...</p>
                </div>
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X size={24} className="text-red-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading messages</h3>
                  <p className="text-red-500 mb-4">{error}</p>
                  <button 
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Start a conversation with support. <br />
                  Type your message below and press Enter to send.
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => {
                  /**
                   * MESSAGE ALIGNMENT LOGIC (Following SupportMessage.tsx pattern exactly)
                   * 
                   * SupportMessage.tsx (Admin perspective):
                   * - Admin's own messages → RIGHT side (blue)
                   * - User's messages → LEFT side (white)
                   * Logic: message.senderId === adminId || message.chatType === 'admin_to_user' || (message.receiverId === selectedUserId && message.senderId === adminId)
                   * 
                   * PertientMessage.tsx (Patient/Clinic perspective):
                   * - Patient/Clinic's own messages → RIGHT side (blue)
                   * - Admin's messages → LEFT side (white)
                   * 
                   * API Response Structure:
                   * - User messages: senderId = user ID, receiverType = "admin", chatType = "user_admin"
                   * - Admin messages: senderId = admin ID, receiverId = user ID, receiverType = "user", chatType = "user_admin"
                   */
                  // Determine if message is from current user (patient/clinic) - same pattern as SupportMessage.tsx
                  const currentUserId = currentUser?._id || currentUser?.id;
                  
                  // Based on API response analysis:
                  // User messages: senderId = currentUserId (e.g., "6944f4a64c9c8aacef7b254d"), receiverType = "admin"
                  // Admin messages: senderId = adminId (e.g., "69450cc070ff2e62166d9a93"), receiverId = currentUserId, receiverType = "user"
                  //
                  // User's own message (RIGHT side) if senderId matches current user
                  // Admin's message (LEFT side) if senderId does NOT match current user
                  // Same exact logic as SupportMessage.tsx: message.senderId === adminId (for admin)
                  // For user: message.senderId === currentUserId
                  const isOwnMessage = String(message.senderId) === String(currentUserId);
                  
                  const messageTime = new Date(message.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  
                  return (
                    <div 
                      key={message._id} 
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div className={`max-w-lg ${isOwnMessage ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
                        <div 
                          className={`rounded-2xl px-4 py-3 ${isOwnMessage 
                            ? 'bg-blue-500 text-white rounded-tr-md' 
                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-md'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.message}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                          <span className="text-xs text-gray-500">
                            {isOwnMessage ? 'You' : (isAdminMode ? 'Admin' : 'Patient')} • {messageTime}
                          </span>
                          {isOwnMessage && (
                            <div className="flex items-center gap-0.5">
                              <Check size={12} className={`${message.seen ? 'text-blue-500' : 'text-gray-400'}`} />
                              {message.seen && <Check size={12} className="text-blue-500 -ml-1.5" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <Paperclip size={20} />
              </button>
              <input
                ref={messageInputRef}
                type="text"
                placeholder={
                  isAdminMode 
                    ? (!selectedAdminId ? "Select an admin to message..." :
                       !isConnected ? "Connecting to server..." : 
                       `Message ${adminContact.name}...`)
                    : (!selectedPatientId ? "Select a patient to message..." :
                       !isConnected ? "Connecting to server..." : 
                       "Type a message...")
                }
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                onKeyDown={handleKeyDown}
                disabled={!isConnected || (isAdminMode ? !selectedAdminId : !selectedPatientId)}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-full 
                         focus:outline-none focus:border-blue-400 bg-white placeholder:text-gray-400 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={!isConnected || (isAdminMode ? !selectedAdminId : !selectedPatientId) || !messageInput.trim()}
                className="w-11 h-11 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 
                         disabled:cursor-not-allowed rounded-full flex items-center justify-center 
                         text-white flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
            
            <div className="mt-3 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <div className="text-xs text-gray-500">
                Press Enter to send • Shift+Enter for new line
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientMessage;








// import { useState } from 'react';
// import { Search, Send, Check, Paperclip, Download, Menu, X } from 'lucide-react';

// interface Message {
//   id: number;
//   text?: string;
//   time: string;
//   sent: boolean;
//   read: boolean;
//   type?: 'text' | 'file';
//   fileName?: string;
//   fileSize?: string;
// }

// interface Contact {
//   id: number;
//   name: string;
//   preview: string;
//   avatar: string;
//   online: boolean;
// }

// const PertientMessage = () => {
//   const [selectedContact, setSelectedContact] = useState<number>(1);
//   const [messageInput, setMessageInput] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

//   const contacts: Contact[] = [
//     { id: 1, name: 'Mike Shinoda', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', online: true },
//     { id: 2, name: 'Mike Shinoda', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', online: true },
//     { id: 3, name: 'Mike Shinoda', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', online: true },
//     { id: 4, name: 'Mike Shinoda', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', online: true },
//     { id: 5, name: 'Mike Shinoda', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop', online: true },
//     { id: 6, name: 'Mike Shinoda', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop', online: true }
//   ];

//   const messages: Message[] = [
//     { id: 1, text: "Hello, there. I have mild symptoms.", time: '10:13 AM', sent: true, read: true, type: 'text' },
//     { id: 2, text: "Lorem ipsum dolor sit amet consectetur.", time: '10:14 AM', sent: false, read: true, type: 'text' },
//     { id: 3, text: "fever\ndry cough\ntiredness\nsore throat", time: '10:15 AM', sent: true, read: true, type: 'text' },
//     { id: 4, text: "Do you have any underlying diseases?", time: '10:17 AM', sent: false, read: true, type: 'text' },
//     { id: 5, time: '10:14 AM', sent: true, read: true, type: 'file', fileName: 'Prescription.pdf', fileSize: '1.2 MB' }
//   ];

//   const currentContact = contacts.find(c => c.id === selectedContact);

//   return (
//     <div className=" bg-gray-50 flex justify-center ">
//       <div className="flex w-full  bg-white rounded-lg shadow-sm h-[90vh] overflow-hidden relative">

//         {/* Sidebar */}
//         <div className={`
//           ${isSidebarOpen ? 'fixed inset-0 z-30 block bg-white' : 'hidden lg:block'} 
//           lg:w-[280px] border-r border-gray-200 flex flex-col transition-transform duration-300
//         `}>
//           {/* Mobile Close Button */}
//           <div className="lg:hidden px-4 pt-4 pb-3 flex justify-between items-center border-b">
//             <h2 className="text-base font-semibold text-gray-900 mb-1">Patient Messages</h2>
//             <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsSidebarOpen(false)}>
//               <X size={20} />
//             </button>
//           </div>

//           {/* Search */}
//           <div className="px-4 pb-3">
//             <div className="relative mt-3">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
//               <input
//                 type="text"
//                 placeholder="Search patients..."
//                 className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 bg-white placeholder:text-gray-400"
//               />
//             </div>
//           </div>

//           {/* Contacts */}
//           <div className="flex-1 overflow-y-auto">
//             {contacts.map((contact) => (
//               <div
//                 key={contact.id}
//                 onClick={() => { setSelectedContact(contact.id); setIsSidebarOpen(false); }}
//                 className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedContact === contact.id ? 'bg-blue-50' : ''}`}
//               >
//                 <div className="relative flex-shrink-0">
//                   <img src={contact.avatar} alt={contact.name} className="w-11 h-11 rounded-full object-cover" />
//                   {contact.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{contact.name}</h3>
//                   <p className="text-xs text-gray-500 truncate">{contact.preview}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col bg-white">
//           {/* Chat Header */}
//           <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
//             {/* Mobile Menu Button */}
//             <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsSidebarOpen(true)}>
//               <Menu size={20} />
//             </button>
//             <img src={currentContact?.avatar} alt={currentContact?.name} className="w-11 h-11 rounded-full object-cover" />
//             <div>
//               <h2 className="text-base font-semibold text-gray-900">{currentContact?.name}</h2>
//               <span className="text-xs text-gray-500">Online</span>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-white">
//             {messages.map((message) => (
//               <div key={message.id} className={`flex ${message.sent ? 'justify-start' : 'justify-end'}`}>
//                 <div className="max-w-md">
//                   {message.type === 'file' ? (
//                     <div className="bg-blue-500 rounded-2xl rounded-tl-md p-3 flex items-center gap-3">
//                       <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
//                         <Download size={20} />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium text-white truncate">{message.fileName}</p>
//                         <p className="text-xs text-blue-100">{message.fileSize}</p>
//                       </div>
//                       <button className="text-white hover:text-blue-100 flex-shrink-0">
//                         <Download size={18} />
//                       </button>
//                     </div>
//                   ) : (
//                     <div className={`rounded-2xl px-4 py-3 ${message.sent ? 'bg-blue-500 text-white rounded-tl-md' : 'bg-gray-100 text-gray-800 rounded-tr-md'}`}>
//                       <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
//                     </div>
//                   )}
//                   <div className={`flex items-center gap-1 mt-1.5 px-1 ${message.sent ? 'justify-start' : 'justify-end'}`}>
//                     <span className="text-xs text-gray-500">{message.time}</span>
//                     {message.sent && <Check size={14} className="text-gray-400" />}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Message Input */}
//           <div className="bg-white border-t border-gray-200 px-6 py-4">
//             <div className="flex items-center gap-3">
//               <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
//                 <Paperclip size={20} />
//               </button>
//               <input
//                 type="text"
//                 placeholder="Write a message..."
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-400 bg-white placeholder:text-gray-400"
//               />
//               <button className="w-11 h-11 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
//                 <Send size={18} />
//               </button>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default PertientMessage;
