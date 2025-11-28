import { useState } from 'react';
import { Search, Send, Check, ChevronDown, Menu, X } from 'lucide-react';
import dr1 from '@/assets/dr1.png';
import b from '@/assets/b.png';

interface Message {
  id: number;
  text: string;
  time: string;
  sent: boolean;
  read: boolean;
}

interface Contact {
  id: number;
  name: string;
  role: string;
  preview: string;
  avatar: string;
  online: boolean;
}

const SupportMessage = () => {
  const [selectedContact, setSelectedContact] = useState<number>(1);
  const [messageInput, setMessageInput] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('Recent');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile toggle

  const contacts: Contact[] = [
    { id: 1, name: 'James Bond', role: 'Patient', preview: 'Lorem ipsum...', avatar: b, online: true },
    { id: 2, name: 'Nero Pharma', role: 'Clinic', preview: 'Lorem ipsum...', avatar: dr1, online: false },
    { id: 3, name: 'Sarah Watson', role: 'Nurse', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', online: true },
    { id: 4, name: 'John Cena', role: 'Patient', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', online: false },
    { id: 5, name: 'Sarah Watson', role: 'Nurse', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop', online: true },
    { id: 6, name: 'Metro Animal', role: 'Clinic', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', online: false }
  ];

  const messages: Message[] = [
    { id: 1, text: "Hi, I'm trying to book an appointment with Dr. Aris, but every time I get to the payment screen, the app freezes.", time: '10:13 AM', sent: true, read: true },
    { id: 2, text: "Hello! I'm sorry to hear you're having trouble booking. That sounds frustrating. Are you seeing any specific error message pop up before it freezes?", time: '10:14 AM', sent: false, read: true },
    { id: 3, text: "No error message. The screen just goes white and the loading spinner keeps spinning.", time: '10:15 AM', sent: true, read: true },
    { id: 4, text: "I see. I have refreshed your session. Please close the app completely and try again.", time: '10:17 AM', sent: false, read: true },
    { id: 5, text: "Okay, let me try that... one second.", time: '10:14 AM', sent: true, read: true }
  ];

  const currentContact = contacts.find(c => c.id === selectedContact);

  const getRoleColor = (role: string) => {
    switch(role.toLowerCase()) {
      case 'patient': return 'text-blue-500';
      case 'nurse': return 'text-blue-500';
      case 'clinic': return 'text-cyan-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex h-screen bg-white">

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'fixed inset-0 z-30 block bg-white' : 'hidden lg:block'} 
        w-[340px] border-r border-gray-200 flex flex-col transition-transform duration-300
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden px-5 pt-5 pb-4 border-b flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-900">Message List</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search your messages"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 bg-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => { setSelectedContact(contact.id); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedContact === contact.id ? 'bg-blue-50' : ''}`}
            >
              <div className="relative flex-shrink-0">
                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{contact.name}</h3>
                  <span className={`text-xs font-medium ${getRoleColor(contact.role)}`}>{contact.role}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{contact.preview}</p>
              </div>
            </div>
          ))}
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
            <img src={currentContact?.avatar} alt={currentContact?.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h2 className="text-base font-semibold text-gray-900">{currentContact?.name}</h2>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-medium ${getRoleColor(currentContact?.role || '')}`}>{currentContact?.role}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-green-600 font-medium">{currentContact?.online ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="text-sm text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              Sort by
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {['Recent', 'Name', 'Unread', 'Online'].map(option => (
                  <button
                    key={option}
                    onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === option ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-white">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sent ? 'justify-start' : 'justify-end'}`}>
              <div className="max-w-lg">
                <div className={`rounded-2xl px-4 py-3 ${message.sent ? 'bg-blue-500 text-white rounded-tl-md' : 'bg-gray-100 text-gray-800 rounded-tr-md'}`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1.5 px-1 ${message.sent ? 'justify-start' : 'justify-end'}`}>
                  <span className="text-xs text-gray-500">{message.time}</span>
                  {message.sent && <Check size={14} className="text-gray-400" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Write a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-400 bg-white placeholder:text-gray-400"
            />
            <button className="w-11 h-11 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SupportMessage;
