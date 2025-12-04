import { useState } from 'react';
import { Search, Send, Check, Paperclip, Download, Menu, X } from 'lucide-react';

interface Message {
  id: number;
  text?: string;
  time: string;
  sent: boolean;
  read: boolean;
  type?: 'text' | 'file';
  fileName?: string;
  fileSize?: string;
}

interface Contact {
  id: number;
  name: string;
  preview: string;
  avatar: string;
  online: boolean;
}

const PertientMessage = () => {
  const [selectedContact, setSelectedContact] = useState<number>(1);
  const [messageInput, setMessageInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

  const contacts: Contact[] = [
    { id: 1, name: 'Mike Shinoda', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', online: true },
    { id: 2, name: 'Mike Shinoda', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', online: true },
    { id: 3, name: 'Mike Shinoda', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', online: true },
    { id: 4, name: 'Mike Shinoda', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', online: true },
    { id: 5, name: 'Mike Shinoda', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop', online: true },
    { id: 6, name: 'Mike Shinoda', preview: 'Lorem ipsum...', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop', online: true }
  ];

  const messages: Message[] = [
    { id: 1, text: "Hello, there. I have mild symptoms.", time: '10:13 AM', sent: true, read: true, type: 'text' },
    { id: 2, text: "Lorem ipsum dolor sit amet consectetur.", time: '10:14 AM', sent: false, read: true, type: 'text' },
    { id: 3, text: "fever\ndry cough\ntiredness\nsore throat", time: '10:15 AM', sent: true, read: true, type: 'text' },
    { id: 4, text: "Do you have any underlying diseases?", time: '10:17 AM', sent: false, read: true, type: 'text' },
    { id: 5, time: '10:14 AM', sent: true, read: true, type: 'file', fileName: 'Prescription.pdf', fileSize: '1.2 MB' }
  ];

  const currentContact = contacts.find(c => c.id === selectedContact);

  return (
    <div className=" bg-gray-50 flex justify-center ">
      <div className="flex w-full  bg-white rounded-lg shadow-sm h-[90vh] overflow-hidden relative">

        {/* Sidebar */}
        <div className={`
          ${isSidebarOpen ? 'fixed inset-0 z-30 block bg-white' : 'hidden lg:block'} 
          lg:w-[280px] border-r border-gray-200 flex flex-col transition-transform duration-300
        `}>
          {/* Mobile Close Button */}
          <div className="lg:hidden px-4 pt-4 pb-3 flex justify-between items-center border-b">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Patient Messages</h2>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 pb-3">
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 bg-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => { setSelectedContact(contact.id); setIsSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedContact === contact.id ? 'bg-blue-50' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <img src={contact.avatar} alt={contact.name} className="w-11 h-11 rounded-full object-cover" />
                  {contact.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{contact.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{contact.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <img src={currentContact?.avatar} alt={currentContact?.name} className="w-11 h-11 rounded-full object-cover" />
            <div>
              <h2 className="text-base font-semibold text-gray-900">{currentContact?.name}</h2>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-white">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sent ? 'justify-start' : 'justify-end'}`}>
                <div className="max-w-md">
                  {message.type === 'file' ? (
                    <div className="bg-blue-500 rounded-2xl rounded-tl-md p-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <Download size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{message.fileName}</p>
                        <p className="text-xs text-blue-100">{message.fileSize}</p>
                      </div>
                      <button className="text-white hover:text-blue-100 flex-shrink-0">
                        <Download size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className={`rounded-2xl px-4 py-3 ${message.sent ? 'bg-blue-500 text-white rounded-tl-md' : 'bg-gray-100 text-gray-800 rounded-tr-md'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                    </div>
                  )}
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
              <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <Paperclip size={20} />
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
    </div>
  );
};

export default PertientMessage;
