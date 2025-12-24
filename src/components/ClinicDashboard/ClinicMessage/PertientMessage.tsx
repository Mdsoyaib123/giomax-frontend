// src/components/UserDashboard/PatientMessage.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Check, Paperclip, Menu, X, RefreshCw, Bug } from 'lucide-react';
import { useSocket } from '@/hooks/contexts/SocketContext';

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

const PatientMessage = () => {
  const { socket, isConnected, debugInfo } = useSocket();
  const [messageInput, setMessageInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  
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

  useEffect(() => {
    console.log('🔧 User Component State:', {
      isConnected,
      messagesCount: messages.length,
      currentUserId: currentUser?._id || currentUser?.id,
      adminTyping: isAdminTyping
    });
  }, [isConnected, messages.length, currentUser, isAdminTyping]);

  // Fetch messages - FIXED: Use different API endpoint
  const fetchMessages = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const token = getToken();
      const currentUserId = currentUser._id || currentUser.id;
      
      // FIXED: Try different endpoints in order
      let response;
      let endpoints = [
        // `https://giomaxatadxe-backend.onrender.com/api/v1/chat/conversation/admin`,  // Try this first
        `https://giomaxatadxe-backend.onrender.com/api/v1/chatHistory/getChat/${currentUserId}`,  // Then try this
        // `https://giomaxatadxe-backend.onrender.com/api/v1/chat/messages`  // Last resort
      ];
      
      let messagesData: Message[] = [];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              messagesData = data.data || [];
              console.log(`✅ Loaded ${messagesData.length} messages from ${endpoint}`);
              break;
            }
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err);
          continue;
        }
      }
      
      if (messagesData.length === 0 && response && !response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      // Filter messages: only show messages between this user and admin
      const filteredMessages = messagesData.filter(msg => 
        // Messages where user sent to admin OR admin sent to this user
        (msg.senderId === currentUserId && msg.receiverType === 'admin') ||
        (msg.receiverId === currentUserId && msg.senderId?.includes('admin')) ||
        (msg.chatType === 'user_admin' || msg.chatType === 'admin_user')
      );
      
      setMessages(filteredMessages);
      
      // Mark messages as seen
      if (filteredMessages.length > 0) {
        await markMessagesAsSeen(filteredMessages);
      }
      
    } catch (error: any) {
      console.error('❌ Error fetching messages:', error);
      setError(error.message || 'Failed to load messages');
      setMessages([]);
      
      // Don't show error if it's just "no messages" - show empty state instead
      if (error.message.includes('404') || error.message.includes('no messages')) {
        setError(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

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

    // Initial fetch only once
    fetchMessages();

    // Cleanup
    return () => {
      socket.off('receive_message_from_admin', handleAdminMessage);
      socket.off('message_sent', handleMessageSent);
      socket.off('user_typing', handleTyping);
    };
  }, [socket]); // Remove dependencies that cause infinite loop

  // Send message - FIXED
  const sendMessage = useCallback(() => {
    if (!messageInput.trim() || !socket || !isConnected || !currentUser) {
      console.error('❌ Cannot send message:', {
        hasMessage: !!messageInput.trim(),
        hasSocket: !!socket,
        isConnected,
        currentUserId: currentUser?._id || currentUser?.id,
        currentUser
      });
      return;
    }

    console.log('📤 Sending message to admin:', messageInput);

    // FIXED: Backend expects only { message } - userId comes from socket auth
    const messageData = {
      message: messageInput
    };

    // Send via socket
    socket.emit('send_message_to_admin', messageData);

    // Create optimistic message
    const optimisticMessage: Message = {
      _id: `temp_${Date.now()}`,
      message: messageInput,
      senderId: currentUser._id || currentUser.id,
      senderName: currentUser.name,
      receiverType: 'admin',
      chatType: 'user_admin',
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
  }, [messageInput, socket, isConnected, currentUser]);

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
    fetchMessages();
  }, [fetchMessages]);

  // Admin contact (static for user)
  const adminContact: AdminContact = {
    _id: 'admin',
    name: 'Support Admin',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    online: true
  };

  // FIXED: Prevent auto-fetch loop
  useEffect(() => {
    // Only fetch if messages are empty
    if (messages.length === 0 && !isLoading && !error) {
      fetchMessages();
    }
  }, []); // Empty dependency array - only run once on mount

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
            <h2 className="text-base font-semibold text-gray-900 mb-1">Support</h2>
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

          {/* Contact */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50">
              <div className="relative flex-shrink-0">
                <img src={adminContact.avatar} alt={adminContact.name} className="w-11 h-11 rounded-full object-cover" />
                {adminContact.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{adminContact.name}</h3>
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
            {isLoading ? (
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
                  const isOwnMessage = message.senderId === (currentUser?._id || currentUser?.id);
                  const messageTime = new Date(message.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  
                  return (
                    <div 
                      key={message._id} 
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="max-w-md">
                        <div className={`rounded-2xl px-4 py-3 ${isOwnMessage ? 'bg-blue-500 text-white rounded-tr-md' : 'bg-gray-100 text-gray-800 rounded-tl-md'}`}>
                          <p className="text-sm leading-relaxed">{message.message}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1.5 px-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs text-gray-500">
                            {isOwnMessage ? 'You' : 'Admin'} • {messageTime}
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
                placeholder={!isConnected ? "Connecting to server..." : "Type your message here..."}
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                onKeyDown={handleKeyDown}
                disabled={!isConnected}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-full 
                         focus:outline-none focus:border-blue-400 bg-white placeholder:text-gray-400 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={!isConnected || !messageInput.trim()}
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
