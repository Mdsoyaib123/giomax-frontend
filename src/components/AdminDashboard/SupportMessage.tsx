// src/components/AdminDashboard/SupportMessage.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Send, Check, ChevronDown, Menu, X, Paperclip, RefreshCw, Bug } from 'lucide-react';
import { useSocket } from '@/hooks/contexts/SocketContext';
import Cookies from 'js-cookie';

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
  fileUrl?: string;
  fileType?: string;
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

const SupportMessage = () => {
  const { socket, isConnected } = useSocket();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'Recent' | 'Name' | 'Unread' | 'Online'>('Recent');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  
  const getCurrentAdmin = () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      const user = JSON.parse(userData);
      return {
        _id: user._id || user.id,
        id: user._id || user.id,
        name: user.fullName || user.name,
        role: user.role
      };
    } catch {
      return null;
    }
  };

  const currentAdmin = getCurrentAdmin();

  // const getToken = () => {
  //   return Cookies.get('token') || localStorage.getItem('token');
  // };
console.log(currentAdmin,"currentAdmin")
  // Fetch all users who have chatted
  const fetchUsers = useCallback(async () => {
    if (!currentAdmin) return;

    try {
      setIsLoading(true);
      setError(null);
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log('📥 Fetching users...');
      const response = await fetch(
        'https://giomaxatadxe-backend.onrender.com/api/v1/chatHistory/adminChat/getUserLists', 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Users API response:', data);
      console.log('data.users', data.users);
      if (data.users && Array.isArray(data.users)) {
        const formattedUsers: User[] = data.users.map((user: any) => ({
          _id: user._id,
          name: user.fullName || user.name || 'Unknown User',
          email: user.email,
          role: user.role,
          avatar: user.profileImage || `https://ui-avatars.com/api/?name=${user.fullName || 'User'}&background=random`,
          online: false,
          unreadCount: 0,
          lastMessage: user.lastMessage,
          lastMessageTime: user.lastMessageTime || user.updatedAt || user.createdAt
        }));
        
        setUsers(formattedUsers);
        console.log('✅ Fetched users:', formattedUsers.length, formattedUsers);
      } else {
        console.warn('⚠️ No users array in response');
        setUsers([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      setError(error.message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentAdmin]);

  // Fetch messages for selected user
  const fetchMessages = useCallback(async (userId: string) => {
    console.log('📥 Fetching messages for user:', userId);
    if (!userId || !currentAdmin) {
      console.warn('⚠️ Missing userId or currentAdmin');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('🔗 Fetching from:', `https://giomaxatadxe-backend.onrender.com/api/v1/chatHistory/admin/getUserConversation/${userId}`);
      
      const response = await fetch(
        `https://giomaxatadxe-backend.onrender.com/api/v1/chatHistory/admin/getUserConversation/${userId}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
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
      
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      // Handle different response formats
      let messagesData: Message[] = [];
      
      if (data.success) {
        messagesData = data.data || [];
      } else if (Array.isArray(data)) {
        // Sometimes API returns array directly
        messagesData = data;
      } else if (data.data && Array.isArray(data.data)) {
        messagesData = data.data;
      } else if (data.messages && Array.isArray(data.messages)) {
        messagesData = data.messages;
      }
      
      console.log(`✅ Loaded ${messagesData.length} messages`);
      
      // Filter messages: only show messages between admin and selected user
      const filteredMessages = messagesData.filter((msg: Message) => 
        // Messages where admin sent to user OR user sent to admin
        (msg.senderId === currentAdmin._id && msg.receiverId === userId) ||
        (msg.senderId === userId && (msg.receiverId === currentAdmin._id || msg.receiverType === 'admin')) ||
        (msg.chatType === 'admin_to_user' || msg.chatType === 'user_admin')
      );
      
      console.log(`🔍 Filtered to ${filteredMessages.length} relevant messages`);
      setMessages(filteredMessages);
      setError(null); // Clear any previous errors
      
      // Mark messages as seen (don't let errors here break the flow)
      if (filteredMessages.length > 0) {
        try {
          await markMessagesAsSeen(filteredMessages, userId);
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
  }, [currentAdmin]);

  // Mark messages as seen
  const markMessagesAsSeen = useCallback(async (messagesToMark: Message[], userId: string) => {
    if (!currentAdmin || messagesToMark.length === 0) return;
    
    const unseenMessages = messagesToMark.filter(msg => 
      msg.senderId !== currentAdmin._id && !msg.seen
    );
    
    if (unseenMessages.length === 0) return;
    
    try {
      // const token = getToken();
      const token=Cookies.get('token')
      console.log(token,"token")
      await fetch('https://giomaxatadxe-backend.onrender.com/api/v1/chat/markAllAsSeen', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
    } catch (error) {
      console.error('Error marking messages as seen:', error);
    }
  }, [currentAdmin]);

  // Setup socket listeners
  useEffect(() => {
    if (!socket || !currentAdmin) return;

    // Listen for new messages from users
    const handleNewMessage = (data: Message) => {
      console.log('📩 New message from user:', data);
      
      // Update selected user's messages if applicable
      if (selectedUserId === data.senderId) {
        setMessages(prev => {
          if (prev.some(msg => msg._id === data._id)) return prev;
          return [...prev, data];
        });
      }
      
      // Update users list
      setUsers(prev => {
        const userExists = prev.some(u => u._id === data.senderId);
        if (userExists) {
          return prev.map(user => {
            if (user._id === data.senderId) {
              return {
                ...user,
                lastMessage: data.message,
                lastMessageTime: data.createdAt,
                unreadCount: selectedUserId === data.senderId ? 0 : (user.unreadCount || 0) + 1
              };
            }
            return user;
          });
        } else {
          // Add new user
          return [...prev, {
            _id: data.senderId,
            name: data.senderName || 'Unknown User',
            role: 'patient',
            avatar: `https://ui-avatars.com/api/?name=${data.senderName || 'User'}&background=random`,
            online: true,
            unreadCount: selectedUserId === data.senderId ? 0 : 1,
            lastMessage: data.message,
            lastMessageTime: data.createdAt
          }];
        }
      });
    };

    // Listen for typing indicator
    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    };

    socket.on('receive_from_user', handleNewMessage);
    socket.on('user_typing', handleTyping);
    // Note: user_status removed as backend doesn't emit it

    // Cleanup
    return () => {
      socket.off('receive_from_user', handleNewMessage);
      socket.off('user_typing', handleTyping);
    };
  }, [socket, currentAdmin, selectedUserId]); // Removed fetchUsers to prevent infinite loop

  // Handle user selection
  const handleUserSelect = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setIsSidebarOpen(false);
    setError(null);
    fetchMessages(userId);
    
    // Reset unread count for this user
    setUsers(prev => prev.map(user => 
      user._id === userId ? { ...user, unreadCount: 0 } : user
    ));
    
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  }, [fetchMessages]);

  // Send message to user
  const sendMessage = useCallback(async () => {
    if (!messageInput.trim() || !socket || !currentAdmin || !selectedUserId) {
      console.error('Cannot send message:', { messageInput, socket, currentAdmin, selectedUserId });
      return;
    }

    try {
      // Send via socket - backend expects {userId: string, message: string}
      socket.emit('admin_reply', {
        userId: selectedUserId,
        message: messageInput.trim()
      });

      // Create optimistic message
      const optimisticMessage: Message = {
        _id: `temp_${Date.now()}`,
        message: messageInput.trim(),
        senderId: currentAdmin._id,
        senderName: currentAdmin.name,
        receiverId: selectedUserId,
        chatType: 'admin_to_user',
        seen: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to messages immediately
      setMessages(prev => [...prev, optimisticMessage]);
      
      // Clear input
      setMessageInput('');
      
      // Focus input for next message
      messageInputRef.current?.focus();
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [messageInput, socket, currentAdmin, selectedUserId]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!socket || !currentAdmin || !selectedUserId) return;
    
    socket.emit('typing', {
      userId: selectedUserId,
      isTyping: true
    });
    
    setTimeout(() => {
      socket.emit('typing', {
        userId: selectedUserId,
        isTyping: false
      });
    }, 1000);
  }, [socket, currentAdmin, selectedUserId]);

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

  // Fetch users on mount - only once
  useEffect(() => {
    if (currentAdmin) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - removed dependencies to prevent infinite loop

  // Filter and sort users
  const getFilteredUsers = useCallback(() => {
    let filtered = [...users];
    
    console.log('🔍 getFilteredUsers called:', {
      usersCount: users.length,
      sortBy,
      users: users
    });

    switch (sortBy) {
      case 'Recent':
        filtered.sort((a, b) => {
          // Handle missing lastMessageTime - put users without time at the end
          const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
          const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
          return timeB - timeA;
        });
        break;
      case 'Name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Unread':
        filtered.sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0));
        break;
      case 'Online':
        filtered.sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0));
        break;
    }

    console.log('✅ getFilteredUsers returning:', filtered.length, 'users');
    return filtered;
  }, [users, sortBy]);
  
  // Debug: Log the actual result, not the function
  console.log('📊 Users state:', users);
  console.log('📊 Filtered users result:', getFilteredUsers());

  const selectedUser = users.find(user => user._id === selectedUserId);
console.log(selectedUser,"selectedUser")
  // Format time
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch(role.toLowerCase()) {
      case 'patient': return 'bg-blue-100 text-blue-800';
      case 'doctor': return 'bg-green-100 text-green-800';
      case 'nurse': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Refresh
  const handleRefresh = useCallback(() => {
    fetchUsers();
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [fetchUsers, selectedUserId, fetchMessages]);

  return (
    <div className="flex h-screen bg-gray-50">
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
            <div>Admin ID: {currentAdmin?._id || 'Not loaded'}</div>
            <div>Selected User: {selectedUserId || 'None'}</div>
            <div>Users: {users.length}</div>
            <div>Messages: {messages.length}</div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'fixed left-0 z-30' : 'hidden lg:flex'} 
        w-full lg:w-96 flex-col h-screen bg-white border-r border-gray-200
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              </button>
              <div className="lg:hidden">
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       bg-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {isLoading ? 'Loading...' : `${users.length} users`}
          </span>
          <div className="relative">
            <button 
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 
                       border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span>Sort: {sortBy}</span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border 
                           border-gray-200 rounded-lg shadow-lg z-10">
                {(['Recent', 'Name', 'Online', 'Unread'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 
                             ${sortBy === option ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {error ? (
            <div className="p-4 text-center">
              <p className="text-red-500 text-sm">{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : isLoading && users.length === 0 ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No users found</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 text-blue-500 hover:text-blue-600"
              >
                Refresh
              </button>
            </div>
          ) : (() => {
            const filtered = getFilteredUsers();
            console.log('🎨 Rendering users list:', {
              usersCount: users.length,
              filteredCount: filtered.length,
              filtered: filtered
            });
            
            // Safety check: if filtered is empty but users exist, use users directly
            const usersToRender = filtered.length > 0 ? filtered : users;
            
            if (usersToRender.length === 0) {
              return (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No users to display</p>
                </div>
              );
            }
            
            return usersToRender.map((user) => {
              console.log('👤 Rendering user:', user);
              
              return (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user._id)}
                  className={`flex items-center gap-3 px-5 py-4 cursor-pointer border-b border-gray-100 
                           hover:bg-gray-50 ${selectedUserId === user._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                >
                  <div className="relative">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                    {user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
                                    rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                        {typingUsers.has(user._id) && (
                          <span className="ml-2 text-xs text-blue-500 animate-pulse">
                            typing...
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        {user?.unreadCount && user?.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {user.unreadCount}
                          </span>
                        )}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 truncate">
                        {user.lastMessage || user.email}
                      </span>
                      <span className="text-xs text-gray-400">
                        {user.lastMessageTime ? formatTime(user.lastMessageTime) : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
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
          <div className="text-xs text-gray-500 mt-1">
            Admin: {currentAdmin?.name || 'Not loaded'}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            
            {selectedUser ? (
              <>
                <div className="relative">
                  <img 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  {selectedUser.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
                                  rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedUser.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                    <span className={`text-xs ${selectedUser.online ? 'text-green-600' : 'text-gray-500'}`}>
                      {selectedUser.online ? 'Online' : 'Offline'}
                    </span>
                    {typingUsers.has(selectedUser._id) && (
                      <span className="text-xs text-blue-500 animate-pulse">
                        typing...
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Select a user</h2>
                <p className="text-sm text-gray-500">Choose a user to start chatting</p>
              </div>
            )}
          </div>
          
          {selectedUser && (
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {!selectedUserId ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-500 text-center max-w-md">
                Select a user from the sidebar to start chatting.
              </p>
            </div>
          ) : isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={() => fetchMessages(selectedUserId)}
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
                Start a conversation with {selectedUser?.name}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                // Determine if message is from admin (own message) - check both _id and id, and chatType
                const adminId = currentAdmin?._id || currentAdmin?.id;
                const isOwnMessage = 
                  message.senderId === adminId || 
                  message.chatType === 'admin_to_user' ||
                  (message.receiverId === selectedUserId && message.senderId === adminId);
                
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
                          {isOwnMessage ? 'You' : selectedUser?.name || 'User'} • {formatTime(message.createdAt)}
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
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-gray-100 rounded-full">
              <Paperclip size={20} className="text-gray-500" />
            </button>
            
            <input
              ref={messageInputRef}
              type="text"
              placeholder={
                !selectedUserId ? "Select a user to message..." :
                !isConnected ? "Connecting..." :
                `Message ${selectedUser?.name}...`
              }
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value);
                handleTyping();
              }}
              onKeyDown={handleKeyDown}
              disabled={!selectedUserId || !isConnected}
              className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-full 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       bg-white placeholder:text-gray-400 disabled:opacity-50"
            />
            
            <button
              onClick={sendMessage}
              disabled={!selectedUserId || !isConnected || !messageInput.trim()}
              className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 
                       rounded-full transition-colors"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
          
          <div className="mt-3 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            {selectedUserId && (
              <div className="text-xs text-gray-500">
                Press Enter to send
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportMessage;







// // src/components/AdminDashboard/SupportMessage.tsx
// import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { Search, Send, Check, ChevronDown, Menu, X, Paperclip, RefreshCw, Bug } from 'lucide-react';
// import { useSocket } from '@/hooks/contexts/SocketContext';
// import Cookies from 'js-cookie';

// interface Message {
//   _id: string;
//   message: string;
//   senderId: string;
//   senderName?: string;
//   receiverId?: string;
//   receiverType?: string;
//   chatType: string;
//   seen: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface User {
//   _id: string;
//   name: string;
//   email?: string;
//   role: string;
//   avatar?: string;
//   online?: boolean;
//   lastSeen?: string;
//   unreadCount?: number;
// }

// const SupportMessage = () => {
//   const { socket, isConnected, debugInfo } = useSocket();
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const [messageInput, setMessageInput] = useState('');
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [sortBy, setSortBy] = useState<'Recent' | 'Name' | 'Unread' | 'Online'>('Recent');
//    const [messages, setMessages] = useState<Message[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showDebug, setShowDebug] = useState(false);
//   const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const messageInputRef = useRef<HTMLInputElement>(null);
  
//   // FIXED: Use useMemo to prevent recreation on every render (fixes infinite loop)
//   const currentAdmin = useMemo(() => {
//     try {
//       const userData = localStorage.getItem('user');
//       return userData ? JSON.parse(userData) : null;
//     } catch {
//       return null;
//     }
//   }, []); // Only compute once on mount

//   // Debug logging
//   useEffect(() => {
//     console.log('🔧 Admin Component State:', {
//       isConnected,
//       selectedUserId,
//       messagesCount: messages.length,
//       usersCount: users.length,
//       currentAdminId: currentAdmin?._id || currentAdmin?.id,
   
//       currentAdminName: currentAdmin?.name,
//       typingUsers: Array.from(typingUsers)
//     });
//   }, [isConnected, selectedUserId, messages.length, users.length, currentAdmin, typingUsers]);

//   // Fetch all users who have chatted with admin
//   const fetchUsers = useCallback(async () => {
//     if (!(currentAdmin?._id || currentAdmin?.id)) {
//       console.log('⚠️ Admin ID not available, skipping fetch');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);
      
//       const token = Cookies.get('token');
//       console.log('token', token);
//       // Use admin history API to get all users who have chatted
//       const response = await fetch('https://giomaxatadxe-backend.onrender.com/api/v1/chatHistory/admin/history', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch users: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.success) {
//         // Backend returns array of users who have chatted with admin
//         const formattedUsers: User[] = data.data.map((user: any) => ({
//           _id: user._id || user.id || user.userId,
//           name: user.name || 'Unknown User',
//           email: user.email,
//           role: user.role || 'patient',
//           avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=random`,
//           online: user.online || false,
//           lastSeen: user.lastSeen,
//           unreadCount: user.unreadCount || 0
//         }));
        
//         setUsers(formattedUsers);
//         console.log('✅ Fetched users:', formattedUsers.length);
//       } else {
//         throw new Error(data.message || 'Failed to fetch users');
//       }
//     } catch (error: any) {
//       console.error('❌ Error fetching users:', error);
//       setError(error.message);
//       setUsers([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []); // Empty deps - currentAdmin is stable via useMemo, accessed directly

//   // Fetch messages for selected user - Following same pattern as patient
//   const fetchMessages = useCallback(async (userId: string) => {
//     console.log('userId', userId);
//     if (!userId) return;
    
//     // Get admin ID directly (currentAdmin is stable via useMemo)
//     const adminId = currentAdmin?._id || currentAdmin?.id;
//     if (!adminId) {
//       console.log('⚠️ Admin ID not available');
//       return;
//     }
    
//     try {
//       setIsLoading(true);
//       setError(null);
//       const token = Cookies.get('token');
      
//       // Use selected user's ID (same as patient uses their own ID)
//       const response = await fetch(`https://giomaxatadxe-backend.onrender.com/api/v1/chatHistory/getChat/${userId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch messages: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.success) {
//         const messagesData = data.data || [];
        
//         // Filter messages: only show messages between admin and selected user
//         const filteredMessages = messagesData.filter((msg: Message) => 
//           // Messages where admin sent to user OR user sent to admin
//           (msg.senderId === adminId && msg.receiverId === userId) ||
//           (msg.senderId === userId && (msg.receiverId === adminId || msg.receiverType === 'admin'))
//         );
        
//         setMessages(filteredMessages);
//         console.log(`✅ Loaded ${filteredMessages.length} messages for user ${userId}`);
        
//         // Mark messages as seen
//         if (filteredMessages.length > 0) {
//           await markMessagesAsSeen(filteredMessages);
//         }
//       } else {
//         throw new Error(data.message || 'Failed to fetch messages');
//       }
//     } catch (error: any) {
//       console.error('❌ Error fetching messages:', error);
//       setError(error.message || 'Failed to load messages');
//       setMessages([]);
      
//       // Don't show error if it's just "no messages" - show empty state instead
//       if (error.message?.includes('404') || error.message?.includes('no messages')) {
//         setError(null);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }, []); // Empty deps - currentAdmin is stable via useMemo, accessed directly

//   // Mark messages as seen
//   const markMessagesAsSeen = useCallback(async (messagesToMark: Message[]) => {
//     const unseenMessages = messagesToMark.filter(msg => 
//       msg.senderId !== (currentAdmin?._id || currentAdmin?.id) && !msg.seen
//     );
    
//     if (unseenMessages.length === 0 || !socket) return;
//     // Mark as seen - backend may handle this automatically via socket
//   }, [currentAdmin, socket]);
    
    
      
   

//   // Setup socket listeners
//   useEffect(() => {
//     if (!socket) return;

//     // Listen for new messages from users
//     const handleReceiveFromUser = (data: Message) => {
//       console.log('📩 New message from user:', data);
      
//       // Add to messages if it's from selected user
//       if (selectedUserId === data.senderId) {
//         setMessages(prev => {
//           // Prevent duplicates
//           const exists = prev.some(msg => msg._id === data._id);
//           if (exists) return prev;
//           return [...prev, data];
//         });
//       }
      
//       // Update users list - add user if not exists, or update unread count
//       setUsers(prev => {
//         const userExists = prev.some(u => u._id === data.senderId);
//         if (userExists) {
//           return prev.map(user => {
//             if (user._id === data.senderId) {
//               return {
//                 ...user,
//                 online: true,
//                 unreadCount: selectedUserId === data.senderId ? 0 : (user.unreadCount || 0) + 1
//               };
//             }
//             return user;
//           });
//         } else {
//           // Add new user to list
//           return [...prev, {
//             _id: data.senderId,
//             name: data.senderName || 'Unknown User',
//             role: 'patient',
//             avatar: `https://ui-avatars.com/api/?name=${data.senderName || 'User'}&background=random`,
//             online: true,
//             unreadCount: selectedUserId === data.senderId ? 0 : 1
//           }];
//         }
//       });
//     };

//     // Listen for message sent confirmation
//     const handleMessageSent = (data: any) => {
//       console.log('✅ Message sent confirmation:', data);
      
//       // Update optimistic message with real ID
//       setMessages(prev => prev.map(msg => 
//         msg._id.includes('temp_') && msg.message === data.message 
//           ? { ...msg, _id: data._id } 
//           : msg
//       ));
//     };

//     // Listen for typing indicator
//     const handleTyping = (data: { userId: string; isTyping: boolean }) => {
//       console.log('⌨️ Typing indicator:', data);
//       setTypingUsers(prev => {
//         const newSet = new Set(prev);
//         if (data.isTyping) {
//           newSet.add(data.userId);
//         } else {
//           newSet.delete(data.userId);
//         }
//         return newSet;
//       });
//     };

//     socket.on('receive_from_user', handleReceiveFromUser);
//     socket.on('message_sent', handleMessageSent);
//     socket.on('user_typing', handleTyping);

//     // Fetch users only once when socket connects (use ref to track)
//     const adminId = currentAdmin?._id || currentAdmin?.id;
//     if (adminId) {
//       fetchUsers();
//     }

//     // Cleanup
//     return () => {
//       socket.off('receive_from_user', handleReceiveFromUser);
//       socket.off('message_sent', handleMessageSent);
//       socket.off('user_typing', handleTyping);
//     };
//   }, [socket, selectedUserId]); // Removed fetchUsers and currentAdmin to prevent infinite loop

//   // Handle user selection
//   const handleUserSelect = useCallback((userId: string) => {
//     console.log('👤 Selecting user:', userId);
//     setSelectedUserId(userId);
//     setIsSidebarOpen(false);
//     setError(null);
//     fetchMessages(userId);
    
//     // Focus message input
//     setTimeout(() => {
//       messageInputRef.current?.focus();
//     }, 100);
//   }, []); // Empty deps - fetchMessages is stable

//   // Send message - Following same pattern as patient
//   const sendMessage = useCallback(() => {
//     // FIXED: Check for both _id and id (same as patient checks currentUser)
//     if (!messageInput.trim() || !socket || !isConnected || !selectedUserId || !(currentAdmin?._id || currentAdmin?.id)) {
//       console.error('❌ Cannot send message:', {
//         hasMessage: !!messageInput.trim(),
//         hasSocket: !!socket,
//         isConnected,
//         selectedUserId,
//         currentAdminId: currentAdmin?._id || currentAdmin?.id,
//         currentAdmin
//       });
//       return;
//     }

//     console.log('📤 Admin sending message to user:', messageInput);

//     // Backend expects: { userId: string, message: string }
//     const messageData = {
//       userId: selectedUserId,
//       message: messageInput
//     };

//     // Send via socket
//     socket.emit('admin_reply', messageData);

//     // Create optimistic message
//     const optimisticMessage: Message = {
//       _id: `temp_${Date.now()}`,
//       message: messageInput,
//       senderId: currentAdmin._id || currentAdmin.id,
//       senderName: currentAdmin.name,
//       receiverId: selectedUserId,
//       chatType: 'admin_user',
//       seen: false,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };

//     // Add to messages immediately
//     setMessages(prev => [...prev, optimisticMessage]);

//     // Clear input
//     setMessageInput('');

//     // Focus input for next message
//     setTimeout(() => {
//       messageInputRef.current?.focus();
//     }, 100);
//   }, [messageInput, socket, isConnected, selectedUserId, currentAdmin]);

//   // Handle typing indicator
//   const handleTyping = useCallback(() => {
//     if (!socket || !isConnected || !selectedUserId) return;
    
//     socket.emit('typing', {
//       userId: selectedUserId,
//       isTyping: true
//     });
    
//     // Clear typing after 1 second
//     setTimeout(() => {
//       if (socket) {
//         socket.emit('typing', {
//           userId: selectedUserId,
//           isTyping: false
//         });
//       }
//     }, 1000);
//   }, [socket, isConnected, selectedUserId]);

//   // Handle key press
//   const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   }, [sendMessage]);

//   // Scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Filter and sort users
//   const getFilteredUsers = useCallback(() => {
//     let filtered = [...users];

//     // Sort based on selection
//     switch (sortBy) {
//       case 'Recent':
//         filtered.sort((a, b) => {
//           const timeA = new Date(a.lastSeen || 0).getTime();
//           const timeB = new Date(b.lastSeen || 0).getTime();
//           return timeB - timeA;
//         });
//         break;
//       case 'Name':
//         filtered.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case 'Online':
//         filtered.sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0));
//         break;
//     }

//     return filtered;
//   }, [users, sortBy]);

//   // Get selected user
//   const selectedUser = users.find(user => user._id === selectedUserId);

//   // Get role color
//   const getRoleColor = useCallback((role: string) => {
//     switch(role.toLowerCase()) {
//       case 'patient': return 'bg-blue-100 text-blue-800';
//       case 'doctor': return 'bg-green-100 text-green-800';
//       case 'nurse': return 'bg-purple-100 text-purple-800';
//       case 'admin': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   }, []);

//   // Refresh users
//   const handleRefresh = useCallback(() => {
//     if (currentAdmin?._id || currentAdmin?.id) {
//       fetchUsers();
//     }
//     if (selectedUserId) {
//       fetchMessages(selectedUserId);
//     }
//   }, [selectedUserId]); // Removed fetchUsers and fetchMessages - they're stable

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Debug Panel */}
//       {showDebug && (
//         <div className="fixed top-20 right-4 w-96 max-h-96 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-50 overflow-y-auto">
//           <div className="flex justify-between items-center mb-3">
//             <h3 className="font-bold">Socket Debug</h3>
//             <button 
//               onClick={() => setShowDebug(false)}
//               className="text-gray-400 hover:text-white"
//             >
//               ✕
//             </button>
//           </div>
//           <div className="space-y-2 text-xs">
//             <div className="flex items-center gap-2">
//               <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
//               <span>Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
//             </div>
//             <div>Admin ID: {currentAdmin?._id || currentAdmin?.id || 'Not loaded'}</div>
//             <div>Selected User: {selectedUserId || 'None'}</div>
//             <div>Last Event: {debugInfo.lastEvent}</div>
//           </div>
//         </div>
//       )}

//       {/* Mobile Sidebar Overlay */}
//       {isSidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div className={`
//         ${isSidebarOpen ? 'fixed left-0 z-30' : 'hidden lg:flex'} 
//         w-full lg:w-96 flex-col h-screen bg-white border-r border-gray-200
//       `}>
//         {/* Sidebar Header */}
//         <div className="p-5 border-b border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-bold text-gray-900">Messages</h2>
//             <div className="flex items-center gap-2">
//               <button 
//                 onClick={handleRefresh}
//                 disabled={isLoading}
//                 className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
//                 title="Refresh"
//               >
//                 <RefreshCw size={18} className={`${isLoading ? 'animate-spin' : ''}`} />
//               </button>
//               <div className="lg:hidden">
//                 <button 
//                   onClick={() => setIsSidebarOpen(false)}
//                   className="p-2 hover:bg-gray-100 rounded-full"
//                 >
//                   <X size={20} className="text-gray-600" />
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search users..."
//               className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
//                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                        bg-white placeholder:text-gray-400"
//             />
//           </div>
//         </div>

//         {/* Sort */}
//         <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
//           <span className="text-sm text-gray-600">
//             {isLoading ? 'Loading...' : `${users.length} users`}
//           </span>
//           <div className="relative">
//             <button 
//               onClick={() => setShowSortDropdown(!showSortDropdown)}
//               className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 
//                        border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               <span>Sort: {sortBy}</span>
//               <ChevronDown size={16} className="text-gray-500" />
//             </button>
            
//             {showSortDropdown && (
//               <div className="absolute right-0 top-full mt-1 w-48 bg-white border 
//                            border-gray-200 rounded-lg shadow-lg z-10">
//                 {(['Recent', 'Name', 'Online'] as const).map(option => (
//                   <button
//                     key={option}
//                     onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
//                     className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 
//                              ${sortBy === option ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
//                   >
//                     {option}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Users List */}
//         <div className="flex-1 overflow-y-auto">
//           {error ? (
//             <div className="p-4 text-center">
//               <p className="text-red-500 text-sm">{error}</p>
//               <button 
//                 onClick={handleRefresh}
//                 className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 Retry
//               </button>
//             </div>
//           ) : isLoading && users.length === 0 ? (
//             <div className="p-6 text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//               <p className="mt-2 text-gray-500">Loading users...</p>
//             </div>
//           ) : users.length === 0 ? (
//             <div className="p-6 text-center">
//               <p className="text-gray-500">No users found</p>
//               <button 
//                 onClick={handleRefresh}
//                 className="mt-2 text-blue-500 hover:text-blue-600"
//               >
//                 Refresh
//               </button>
//             </div>
//           ) : (
//             getFilteredUsers().map((user) => (
//               <div
//                 key={user._id}
//                 onClick={() => handleUserSelect(user._id)}
//                 className={`flex items-center gap-3 px-5 py-4 cursor-pointer border-b border-gray-100 
//                          hover:bg-gray-50 transition-all ${selectedUserId === user._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
//               >
//                 <div className="relative">
//                   <img 
//                     src={user.avatar} 
//                     alt={user.name} 
//                     className="w-12 h-12 rounded-full object-cover border-2 border-white"
//                   />
//                   {user.online && (
//                     <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
//                                   rounded-full border-2 border-white"></div>
//                   )}
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-1">
//                     <h3 className="text-sm font-semibold text-gray-900 truncate">
//                       {user.name}
//                       {typingUsers.has(user._id) && (
//                         <span className="ml-2 text-xs text-blue-500 animate-pulse">
//                           typing...
//                         </span>
//                       )}
//                     </h3>
//                     <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoleColor(user.role)}`}>
//                       {user.role}
//                     </span>
//                   </div>
                  
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs text-gray-500 truncate">
//                       {user.email}
//                     </span>
//                     <span className="text-xs text-gray-400">
//                       {user.online ? 'Online' : 'Offline'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Connection Status */}
//         <div className="p-4 border-t border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
//               <span className="text-sm text-gray-600">
//                 {isConnected ? 'Connected' : 'Disconnected'}
//               </span>
//             </div>
//             <button
//               onClick={() => setShowDebug(!showDebug)}
//               className="text-gray-500 hover:text-gray-700"
//               title="Debug Info"
//             >
//               <Bug size={16} />
//             </button>
//           </div>
//           <div className="text-xs text-gray-500 mt-1">
//             Admin: {currentAdmin?.name || 'Not loaded'}
//           </div>
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col bg-white">
//         {/* Chat Header */}
//         <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <button 
//               className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <Menu size={20} className="text-gray-600" />
//             </button>
            
//             {selectedUser ? (
//               <>
//                 <div className="relative">
//                   <img 
//                     src={selectedUser.avatar} 
//                     alt={selectedUser.name} 
//                     className="w-12 h-12 rounded-full object-cover border-2 border-white"
//                   />
//                   {selectedUser.online && (
//                     <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
//                                   rounded-full border-2 border-white"></div>
//                   )}
//                 </div>
                
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">
//                     {selectedUser.name}
//                   </h2>
//                   <div className="flex items-center gap-2">
//                     <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoleColor(selectedUser.role)}`}>
//                       {selectedUser.role}
//                     </span>
//                     <span className={`text-xs ${selectedUser.online ? 'text-green-600' : 'text-gray-500'}`}>
//                       {selectedUser.online ? 'Online' : 'Offline'}
//                     </span>
//                     {typingUsers.has(selectedUser._id) && (
//                       <span className="text-xs text-blue-500 animate-pulse">
//                         typing...
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">Select a user</h2>
//                 <p className="text-sm text-gray-500">Choose a user to start chatting</p>
//               </div>
//             )}
//           </div>
          
//           {selectedUser && (
//             <button
//               onClick={handleRefresh}
//               disabled={isLoading}
//               className="p-2 hover:bg-gray-100 rounded-full"
//               title="Refresh messages"
//             >
//               <RefreshCw size={18} className={`${isLoading ? 'animate-spin' : ''}`} />
//             </button>
//           )}
//         </div>

//         {/* Messages Area */}
//         <div className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
//           {!selectedUserId ? (
//             <div className="h-full flex flex-col items-center justify-center">
//               <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Send size={24} className="text-gray-400" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
//               <p className="text-gray-500 text-center max-w-md">
//                 Select a user from the sidebar to start chatting. <br />
//                 You'll see all messages between you and the selected user here.
//               </p>
//             </div>
//           ) : isLoading ? (
//             <div className="h-full flex items-center justify-center">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//                 <p className="mt-2 text-gray-500">Loading messages...</p>
//               </div>
//             </div>
//           ) : error ? (
//             <div className="h-full flex items-center justify-center">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <X size={24} className="text-red-500" />
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading messages</h3>
//                 <p className="text-red-500 mb-4">{error}</p>
//                 <button 
//                   onClick={() => fetchMessages(selectedUserId)}
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                 >
//                   Retry
//                 </button>
//               </div>
//             </div>
//           ) : messages.length === 0 ? (
//             <div className="h-full flex flex-col items-center justify-center">
//               <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Send size={24} className="text-gray-400" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
//               <p className="text-gray-500 text-center max-w-md">
//                 Start a conversation with {selectedUser?.name}. <br />
//                 Type your message below and press Enter to send.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {messages.map((message) => {
//                 const isOwnMessage = message.senderId === (currentAdmin?._id || currentAdmin?.id);
//                 const messageTime = new Date(message.createdAt).toLocaleTimeString([], { 
//                   hour: '2-digit', 
//                   minute: '2-digit' 
//                 });
                
//                 return (
//                   <div 
//                     key={message._id} 
//                     className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div className="max-w-lg">
//                       <div 
//                         className={`rounded-2xl px-4 py-3 ${isOwnMessage 
//                           ? 'bg-blue-500 text-white rounded-tr-md' 
//                           : 'bg-white text-gray-800 border border-gray-200 rounded-tl-md'
//                         }`}
//                       >
//                         <p className="text-sm leading-relaxed">{message.message}</p>
//                       </div>
//                       <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
//                         <span className="text-xs text-gray-500">
//                           {isOwnMessage ? 'You' : selectedUser?.name || 'User'} • {messageTime}
//                         </span>
//                         {isOwnMessage && (
//                           <div className="flex items-center gap-0.5">
//                             <Check size={12} className={`${message.seen ? 'text-blue-500' : 'text-gray-400'}`} />
//                             {message.seen && <Check size={12} className="text-blue-500 -ml-1.5" />}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={messagesEndRef} />
//             </div>
//           )}
//         </div>

//         {/* Message Input */}
//         <div className="bg-white border-t border-gray-200 px-4 py-4">
//           <div className="flex items-center gap-3">
//             <button className="p-2.5 hover:bg-gray-100 rounded-full">
//               <Paperclip size={20} className="text-gray-500" />
//             </button>
            
//             <input
//               ref={messageInputRef}
//               type="text"
//               placeholder={
//                 !selectedUserId ? "Select a user to message..." :
//                 !isConnected ? "Connecting to server..." :
//                 `Message ${selectedUser?.name || 'user'}...`
//               }
//               value={messageInput}
//               onChange={(e) => {
//                 setMessageInput(e.target.value);
//                 handleTyping();
//               }}
//               onKeyDown={handleKeyDown}
//               disabled={!selectedUserId || !isConnected}
//               className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-full 
//                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                        bg-white placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
//             />
            
//             <button
//               onClick={sendMessage}
//               disabled={!selectedUserId || !isConnected || !messageInput.trim()}
//               className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 
//                        disabled:cursor-not-allowed rounded-full transition-colors
//                        flex items-center justify-center"
//             >
//               <Send size={18} className="text-white" />
//             </button>
//           </div>
          
//           <div className="mt-3 flex items-center justify-between px-2">
//             <div className="flex items-center gap-2">
//               <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
//               <span className="text-xs text-gray-500">
//                 {isConnected ? 'Connected' : 'Disconnected'}
//               </span>
//             </div>
            
//             {selectedUserId && (
//               <div className="text-xs text-gray-500">
//                 Press Enter to send • Shift+Enter for new line
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SupportMessage;







// // import { useState } from 'react';
// // import { Search, Send, Check, ChevronDown, Menu, X } from 'lucide-react';
// // import dr1 from '@/assets/dr1.png';
// // import b from '@/assets/b.png';

// // interface Message {
// //   id: number;
// //   text: string;
// //   time: string;
// //   sent: boolean;
// //   read: boolean;
// // }

// // interface Contact {
// //   id: number;
// //   name: string;
// //   role: string;
// //   preview: string;
// //   avatar: string;
// //   online: boolean;
// // }

// // const SupportMessage = () => {
// //   const [selectedContact, setSelectedContact] = useState<number>(1);
// //   const [messageInput, setMessageInput] = useState('');
// //   const [showSortDropdown, setShowSortDropdown] = useState(false);
// //   const [sortBy, setSortBy] = useState('Recent');
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile toggle

// //   const contacts: Contact[] = [
// //     { id: 1, name: 'James Bond', role: 'Patient', preview: 'Lorem ipsum...', avatar: b, online: true },
// //     { id: 2, name: 'Nero Pharma', role: 'Clinic', preview: 'Lorem ipsum...', avatar: dr1, online: false },
// //     { id: 3, name: 'Sarah Watson', role: 'Nurse', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', online: true },
// //     { id: 4, name: 'John Cena', role: 'Patient', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', online: false },
// //     { id: 5, name: 'Sarah Watson', role: 'Nurse', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop', online: true },
// //     { id: 6, name: 'Metro Animal', role: 'Clinic', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', online: false }
// //   ];

// //   const messages: Message[] = [
// //     { id: 1, text: "Hi, I'm trying to book an appointment with Dr. Aris, but every time I get to the payment screen, the app freezes.", time: '10:13 AM', sent: true, read: true },
// //     { id: 2, text: "Hello! I'm sorry to hear you're having trouble booking. That sounds frustrating. Are you seeing any specific error message pop up before it freezes?", time: '10:14 AM', sent: false, read: true },
// //     { id: 3, text: "No error message. The screen just goes white and the loading spinner keeps spinning.", time: '10:15 AM', sent: true, read: true },
// //     { id: 4, text: "I see. I have refreshed your session. Please close the app completely and try again.", time: '10:17 AM', sent: false, read: true },
// //     { id: 5, text: "Okay, let me try that... one second.", time: '10:14 AM', sent: true, read: true }
// //   ];

// //   const currentContact = contacts.find(c => c.id === selectedContact);

// //   const getRoleColor = (role: string) => {
// //     switch(role.toLowerCase()) {
// //       case 'patient': return 'text-blue-500';
// //       case 'nurse': return 'text-blue-500';
// //       case 'clinic': return 'text-cyan-600';
// //       default: return 'text-gray-600';
// //     }
// //   };

// //   return (
// //     <div className="flex h-screen bg-white">

// //       {/* Sidebar */}
// //       <div className={`
// //         ${isSidebarOpen ? 'fixed inset-0 z-30 block bg-white' : 'hidden lg:block'} 
// //         w-[340px] border-r border-gray-200 flex flex-col transition-transform duration-300
// //       `}>
// //         {/* Mobile Close Button */}
// //         <div className="lg:hidden px-5 pt-5 pb-4 border-b flex justify-between items-center">
// //           <h2 className="text-sm font-semibold text-gray-900">Message List</h2>
// //           <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
// //             <X size={20} />
// //           </button>
// //         </div>

// //         {/* Search */}
// //         <div className="px-5 pt-4 pb-3 border-b border-gray-200">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
// //             <input
// //               type="text"
// //               placeholder="Search your messages"
// //               className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 bg-white placeholder:text-gray-400"
// //             />
// //           </div>
// //         </div>

// //         {/* Contacts */}
// //         <div className="flex-1 overflow-y-auto">
// //           {contacts.map((contact) => (
// //             <div
// //               key={contact.id}
// //               onClick={() => { setSelectedContact(contact.id); setIsSidebarOpen(false); }}
// //               className={`flex items-center gap-3 px-4 py-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedContact === contact.id ? 'bg-blue-50' : ''}`}
// //             >
// //               <div className="relative flex-shrink-0">
// //                 <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
// //                 {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
// //               </div>
// //               <div className="flex-1 min-w-0">
// //                 <div className="flex items-center justify-between mb-1">
// //                   <h3 className="text-sm font-semibold text-gray-900 truncate">{contact.name}</h3>
// //                   <span className={`text-xs font-medium ${getRoleColor(contact.role)}`}>{contact.role}</span>
// //                 </div>
// //                 <p className="text-xs text-gray-500 truncate">{contact.preview}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Chat Area */}
// //       <div className="flex-1 flex flex-col bg-white">
// //         {/* Chat Header */}
// //         <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsSidebarOpen(true)}>
// //               <Menu size={20} />
// //             </button>
// //             <img src={currentContact?.avatar} alt={currentContact?.name} className="w-12 h-12 rounded-full object-cover" />
// //             <div>
// //               <h2 className="text-base font-semibold text-gray-900">{currentContact?.name}</h2>
// //               <div className="flex items-center gap-1.5">
// //                 <span className={`text-xs font-medium ${getRoleColor(currentContact?.role || '')}`}>{currentContact?.role}</span>
// //                 <span className="text-xs text-gray-400">•</span>
// //                 <span className="text-xs text-green-600 font-medium">{currentContact?.online ? 'Online' : 'Offline'}</span>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="relative">
// //             <button 
// //               onClick={() => setShowSortDropdown(!showSortDropdown)}
// //               className="text-sm text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
// //             >
// //               Sort by
// //               <ChevronDown size={16} className="text-gray-500" />
// //             </button>
// //             {showSortDropdown && (
// //               <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
// //                 {['Recent', 'Name', 'Unread', 'Online'].map(option => (
// //                   <button
// //                     key={option}
// //                     onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
// //                     className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === option ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
// //                   >
// //                     {option}
// //                   </button>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Messages */}
// //         <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-white">
// //           {messages.map((message) => (
// //             <div key={message.id} className={`flex ${message.sent ? 'justify-start' : 'justify-end'}`}>
// //               <div className="max-w-lg">
// //                 <div className={`rounded-2xl px-4 py-3 ${message.sent ? 'bg-blue-500 text-white rounded-tl-md' : 'bg-gray-100 text-gray-800 rounded-tr-md'}`}>
// //                   <p className="text-sm leading-relaxed">{message.text}</p>
// //                 </div>
// //                 <div className={`flex items-center gap-1 mt-1.5 px-1 ${message.sent ? 'justify-start' : 'justify-end'}`}>
// //                   <span className="text-xs text-gray-500">{message.time}</span>
// //                   {message.sent && <Check size={14} className="text-gray-400" />}
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Message Input */}
// //         <div className="bg-white border-t border-gray-200 px-6 py-4">
// //           <div className="flex items-center gap-3">
// //             <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
// //               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                 <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
// //               </svg>
// //             </button>
// //             <input
// //               type="text"
// //               placeholder="Write a message..."
// //               value={messageInput}
// //               onChange={(e) => setMessageInput(e.target.value)}
// //               className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-400 bg-white placeholder:text-gray-400"
// //             />
// //             <button className="w-11 h-11 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
// //               <Send size={18} />
// //             </button>
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default SupportMessage;
