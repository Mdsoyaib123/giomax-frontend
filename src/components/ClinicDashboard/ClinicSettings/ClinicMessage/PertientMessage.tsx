import React, { useState } from 'react';
import { Send, Paperclip, Search, Check } from 'lucide-react';
import image from "@/assets/image (2).png";

interface Message {
  id: number;
  text: string;
  time: string;
  sender: 'user' | 'other';
  isRead?: boolean;
  attachment?: {
    name: string;
    size: string;
  };
}

interface Patient {
  id: number;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread?: boolean;
}

const PertientMessage: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const patients: Patient[] = [
    { id: 1, name: 'Mike Shinoda', avatar: image, preview: 'Lorem ipsum dolor sit amet consectetur...', time: '10:12 AM', unread: true },
    { id: 2, name: 'Mike Shinoda', avatar: image, preview: 'Lorem ipsum dolor sit amet consectetur...', time: '10:12 AM' },
    { id: 3, name: 'Mike Shinoda', avatar: image, preview: 'Lorem ipsum dolor sit amet consectetur...', time: '10:12 AM' },
    { id: 4, name: 'Mike Shinoda', avatar: image, preview: 'Lorem ipsum dolor sit amet consectetur...', time: '10:12 AM' },
    { id: 5, name: 'Mike Shinoda', avatar: image, preview: 'Lorem ipsum dolor sit amet consectetur...', time: '10:12 AM' },
    { id: 6, name: 'Mike Shinoda', avatar: image, preview: 'Lorem ipsum dolor sit amet consectetur...', time: '10:12 AM' },
  ];

  const messages: Message[] = [
    { id: 1, text: 'Hello, there. I believe I have the examination as re-experiencing into symptoms-what do I do?', time: '10:12 AM', sender: 'other', isRead: true },
    { id: 2, text: 'Lorem ipsum dolor sit amet consectetur. Justo ac non magna massa.', time: '10:14 AM', sender: 'user', isRead: true },
    { id: 3, text: 'Hey!', time: '10:15 AM', sender: 'other' },
    { id: 4, text: "It's cough.", time: '10:15 AM', sender: 'other' },
    { id: 5, text: 'Headache', time: '10:15 AM', sender: 'other' },
    { id: 6, text: 'Less throat', time: '10:15 AM', sender: 'other', isRead: true },
    { id: 7, text: 'oh so sorry about that. do you have any underlying diseases?', time: '10:17 AM', sender: 'user', isRead: true },
    { id: 8, text: '', time: '10:18 AM', sender: 'other', isRead: true, attachment: { name: 'Prescription.pdf', size: '2.5 MB' } },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending:', messageInput);
      setMessageInput('');
    }
  };

  const handlePatientClick = (id: number) => {
    setSelectedPatient(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full flex items-center justify-center rounded-[16px]">
      <div className="w-full max-w-[1592px] h-full max-h-[908px] flex bg-white shadow-2xl rounded-xl overflow-hidden">

        {/* Sidebar */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-80 bg-white border-r border-gray-200 flex flex-col absolute md:relative z-10 h-full`}>
          
          {/* Sidebar Header */}
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Patient Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 focus:outline-none focus:border-gray-300"
              />
            </div>
          </div>

          {/* Patient List */}
          <div className="flex-1 overflow-y-auto">
            {patients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handlePatientClick(patient.id)}
                className={`flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedPatient === patient.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="relative">
                  {/* FIXED IMAGE */}
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {patient.unread && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">{patient.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{patient.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          
          {/* Chat Header */}
          {selectedPatient && (
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden mr-2 text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center text-white font-medium text-sm">
            <img src={image} alt="" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Mike Shinoda</h3>
                  <p className="text-xs text-green-500 font-medium">Active</p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs md:max-w-md ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  
                  {/* Attachments */}
                  {message.attachment ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500 text-white">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{message.attachment.name}</p>
                        <p className="text-xs opacity-90">{message.attachment.size}</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`px-4 py-2.5 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  )}

                  {/* Time + Read */}
                  <div
                    className={`flex items-center gap-1.5 mt-1.5 text-xs ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span className="text-gray-500">{message.time}</span>
                    {message.sender === 'user' && message.isRead && (
                      <div className="flex">
                        <Check className="w-3.5 h-3.5 text-blue-500" />
                        <Check className="w-3.5 h-3.5 text-blue-500 -ml-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="px-5 py-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2.5 border border-gray-200">
              <Paperclip className="w-5 h-5 text-gray-400" />

              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Write a message..."
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />

              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PertientMessage;
