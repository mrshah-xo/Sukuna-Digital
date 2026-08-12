import { useState } from 'react';
import { MessageSquare, Phone, Video, Mail } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ChatView from './ChatView';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  avatar: string;
  email: string;
  phone: string;
  availability: string;
}

export default function TeachersView() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const teachers: Teacher[] = [
    {
      id: 1,
      name: 'Mr. Patel',
      subject: 'Mathematics Teacher',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      email: 'patel@sukunaschool.edu',
      phone: '+977 9841111111',
      availability: 'Mon-Fri, 8 AM - 4 PM',
    },
    {
      id: 2,
      name: 'Mrs. Singh',
      subject: 'Science Teacher',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      email: 'singh@sukunaschool.edu',
      phone: '+977 9841222222',
      availability: 'Mon-Fri, 9 AM - 5 PM',
    },
    {
      id: 3,
      name: 'Mr. Kumar',
      subject: 'English Teacher',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      email: 'kumar@sukunaschool.edu',
      phone: '+977 9841333333',
      availability: 'Mon-Fri, 8 AM - 3 PM',
    },
    {
      id: 4,
      name: 'Ms. Sharma',
      subject: 'Social Studies Teacher',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      email: 'sharma@sukunaschool.edu',
      phone: '+977 9841444444',
      availability: 'Mon-Fri, 10 AM - 4 PM',
    },
  ];

  if (selectedTeacher) {
    return (
      <div className="h-screen flex flex-col">
        <ChatView teacher={selectedTeacher} onBack={() => setSelectedTeacher(null)} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Teachers</h1>
        <p className="text-[#64748B]">Connect with your teachers</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start gap-4 mb-4">
              <ImageWithFallback
                src={teacher.avatar}
                alt={teacher.name}
                className="size-16 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#0F172A]">{teacher.name}</h3>
                <p className="text-sm text-[#64748B] mb-2">{teacher.subject}</p>
                <div className="flex items-center gap-1 text-xs text-[#22C55E]">
                  <div className="size-2 bg-[#22C55E] rounded-full"></div>
                  Available
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-[#64748B]">
                <Mail size={16} />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748B]">
                <Phone size={16} />
                <span>{teacher.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748B]">
                <span className="font-medium">Hours:</span>
                <span>{teacher.availability}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTeacher(teacher)}
                className="flex-1 py-2.5 px-4 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-[#1d4ed8] transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} />
                Message
              </button>
              <button className="py-2.5 px-4 bg-gray-100 text-[#64748B] rounded-xl hover:bg-gray-200 transition-all">
                <Video size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
