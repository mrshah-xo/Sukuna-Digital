"use client";

import { Search, Send, Paperclip, ArrowLeft, Smile, Mic } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  avatar: string;
  email: string;
  phone: string;
  availability: string;
}

interface ChatViewProps {
  teacher?: Teacher;
  onBack?: () => void;
}

export default function ChatView({ teacher, onBack }: ChatViewProps) {
  const chats = [
    {
      id: 1,
      name: 'Mr. Patel',
      role: 'Mathematics Teacher',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      lastMessage: 'Please submit your homework by tomorrow',
      time: '10:30 AM',
      unread: 2,
    },
    {
      id: 2,
      name: 'Mrs. Singh',
      role: 'Science Teacher',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      lastMessage: 'Great work on the lab report!',
      time: 'Yesterday',
      unread: 0,
    },
    {
      id: 3,
      name: 'Mr. Kumar',
      role: 'English Teacher',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      lastMessage: 'Essay deadline extended to Friday',
      time: '2 days ago',
      unread: 1,
    },
  ];

  // If a specific teacher is selected, show only that chat
  if (teacher && onBack) {
    return (
      <div className="flex-1 bg-white flex flex-col relative">
        <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white z-10">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg md:hidden">
            <ArrowLeft size={20} />
          </button>
          <ImageWithFallback
            src={teacher.avatar}
            alt={teacher.name}
            className="size-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-bold text-[#0F172A]">{teacher.name}</h3>
            <p className="text-xs text-[#22C55E]">Online</p>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-28 md:pb-24">
          <div className="max-w-3xl mx-auto space-y-5">
            {/* Teacher Message */}
            <div className="flex gap-3">
              <ImageWithFallback
                src={teacher.avatar}
                alt={teacher.name}
                className="size-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex flex-col gap-1">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-md">
                  <p className="text-[#0F172A] text-sm leading-relaxed">Good morning! Have you completed the assignment on quadratic equations?</p>
                  <p className="text-xs text-[#64748B] mt-2">10:15 AM</p>
                </div>
              </div>
            </div>

            {/* Student Message */}
            <div className="flex gap-3 justify-end">
              <div className="flex flex-col gap-1 items-end">
                <div className="bg-[#2563EB] text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-md">
                  <p className="text-sm leading-relaxed">Good morning, Sir! Yes, I have completed it. Should I submit it now?</p>
                  <p className="text-xs text-blue-100 mt-2">10:20 AM</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#64748B]">
                  <span>Delivered</span>
                  <svg className="size-3" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Teacher Message */}
            <div className="flex gap-3">
              <ImageWithFallback
                src={teacher.avatar}
                alt={teacher.name}
                className="size-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex flex-col gap-1">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-md">
                  <p className="text-[#0F172A] text-sm leading-relaxed">Yes, please submit it by tomorrow. Also, prepare for a small quiz on Friday.</p>
                  <p className="text-xs text-[#64748B] mt-2">10:30 AM</p>
                </div>
                {/* Typing Indicator */}
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm w-16 flex items-center gap-1">
                  <div className="size-2 bg-[#64748B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="size-2 bg-[#64748B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="size-2 bg-[#64748B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Sticky Input */}
        <div className="fixed bottom-0 left-0 right-0 md:relative p-4 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-lg z-20 mb-16 md:mb-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-gray-100">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Smile className="text-[#64748B]" size={20} />
              </button>
              <input
                type="text"
                placeholder="Type a message…"
                className="flex-1 px-2 py-2 bg-transparent focus:outline-none text-sm"
              />
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Paperclip className="text-[#64748B]" size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Mic className="text-[#64748B]" size={20} />
              </button>
              <button className="p-2.5 bg-[#2563EB] text-white rounded-full hover:bg-[#1d4ed8] transition-all shadow-md">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Chat List */}
      <div className="md:w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">Teacher Chat</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
            <input
              type="text"
              placeholder="Search teachers..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all"
            >
              <div className="flex items-start gap-3">
                <ImageWithFallback
                  src={chat.avatar}
                  alt={chat.name}
                  className="size-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-[#0F172A] truncate">{chat.name}</h3>
                    <span className="text-xs text-[#64748B]">{chat.time}</span>
                  </div>
                  <p className="text-sm text-[#64748B] truncate">{chat.lastMessage}</p>
                  <p className="text-xs text-[#2563EB] mt-1">{chat.role}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="size-5 bg-[#2563EB] text-white text-xs rounded-full flex items-center justify-center">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
            alt="Mr. Patel"
            className="size-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold text-[#0F172A]">Mr. Patel</h3>
            <p className="text-xs text-[#64748B]">Mathematics Teacher</p>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex gap-3">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                alt="Mr. Patel"
                className="size-8 rounded-full object-cover"
              />
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-md">
                <p className="text-[#0F172A]">Good morning! Have you completed the assignment on quadratic equations?</p>
                <p className="text-xs text-[#64748B] mt-2">10:15 AM</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="bg-[#2563EB] text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-md">
                <p>Good morning, Sir! Yes, I have completed it. Should I submit it now?</p>
                <p className="text-xs text-blue-100 mt-2">10:20 AM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                alt="Mr. Patel"
                className="size-8 rounded-full object-cover"
              />
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-md">
                <p className="text-[#0F172A]">Yes, please submit it by tomorrow. Also, prepare for a small quiz on Friday.</p>
                <p className="text-xs text-[#64748B] mt-2">10:30 AM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Paperclip className="text-[#64748B]" size={20} />
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            <button className="p-3 bg-[#2563EB] text-white rounded-xl hover:bg-[#1d4ed8] transition-all">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
