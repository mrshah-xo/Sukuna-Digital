"use client";

import { Bell, Star, Bus, Calendar, BookOpen, TrendingUp, Clock, FileText } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

export type TabType = 'home' | 'sukuna-book' | 'calendar' | 'memory' | 'profile' | 'settings' | 'library' | 'bus-track' | 'evaluation' | 'notes-mandir' | 'teachers';


interface HomePageProps {
  onNavigate: (tab: TabType) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { profileData } = useProfile();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Greeting Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Good Morning, {profileData.name.split(' ')[0]}!</h1>
        <p className="text-[#64748B]">Welcome back to Sukuna School</p>
      </div>

      {/* Student Card */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#60A5FA] rounded-2xl p-6 text-white mb-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Student ID: {profileData.studentId}</p>
            <h2 className="text-2xl font-bold mt-1">{profileData.name}</h2>
            <p className="text-sm opacity-90 mt-1">{profileData.class} • Roll No: {profileData.rollNo}</p>
          </div>
          <div className="size-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-2xl">🎓</span>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-80">Attendance</p>
            <p className="text-xl font-bold">{profileData.attendance}%</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-80">Star Points</p>
            <p className="text-xl font-bold">{profileData.starPoints}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button onClick={() => onNavigate('calendar')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col items-center gap-2">
          <div className="size-12 bg-blue-50 rounded-full flex items-center justify-center">
            <Calendar className="text-[#2563EB]" size={24} />
          </div>
          <span className="text-sm font-medium text-[#0F172A]">Calendar</span>
        </button>
        <button onClick={() => onNavigate('library')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col items-center gap-2">
          <div className="size-12 bg-green-50 rounded-full flex items-center justify-center">
            <BookOpen className="text-[#22C55E]" size={24} />
          </div>
          <span className="text-sm font-medium text-[#0F172A]">Library</span>
        </button>
        <button onClick={() => onNavigate('bus-track')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col items-center gap-2">
          <div className="size-12 bg-orange-50 rounded-full flex items-center justify-center">
            <Bus className="text-[#F59E0B]" size={24} />
          </div>
          <span className="text-sm font-medium text-[#0F172A]">Bus Track</span>
        </button>
        <button onClick={() => onNavigate('evaluation')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col items-center gap-2">
          <div className="size-12 bg-purple-50 rounded-full flex items-center justify-center">
            <TrendingUp className="text-[#9333EA]" size={24} />
          </div>
          <span className="text-sm font-medium text-[#0F172A]">Evaluation Report</span>
        </button>
        <button onClick={() => onNavigate('notes-mandir')} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col items-center gap-2 md:col-span-2">
          <div className="size-12 bg-red-50 rounded-full flex items-center justify-center">
            <FileText className="text-[#EF4444]" size={24} />
          </div>
          <span className="text-sm font-medium text-[#0F172A]">Notes Mandir</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Today&apos;s Classes</h3>
            <Clock className="text-[#64748B]" size={20} />
          </div>
          <div className="space-y-3">
            {[
              { subject: 'Mathematics', time: '8:00 - 9:00 AM', teacher: 'Mr. Patel', status: 'ongoing' },
              { subject: 'Science', time: '9:15 - 10:15 AM', teacher: 'Mrs. Singh', status: 'upcoming' },
              { subject: 'English', time: '10:30 - 11:30 AM', teacher: 'Mr. Kumar', status: 'upcoming' },
            ].map((cls, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className={`size-2 rounded-full ${cls.status === 'ongoing' ? 'bg-[#22C55E]' : 'bg-[#64748B]'}`} />
                <div className="flex-1">
                  <p className="font-medium text-[#0F172A]">{cls.subject}</p>
                  <p className="text-sm text-[#64748B]">{cls.teacher}</p>
                </div>
                <p className="text-sm text-[#64748B]">{cls.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* School Notices */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0F172A]">School Notices</h3>
            <Bell className="text-[#64748B]" size={20} />
          </div>
          <div className="space-y-3">
            {[
              { title: 'Annual Sports Day', date: 'May 20, 2026', type: 'event' },
              { title: 'Mid-term Exams Starting', date: 'May 25, 2026', type: 'exam' },
              { title: 'Parent-Teacher Meeting', date: 'May 30, 2026', type: 'meeting' },
            ].map((notice, idx) => (
              <div key={idx} className="p-4 bg-blue-50 rounded-xl border-l-4 border-[#2563EB]">
                <p className="font-medium text-[#0F172A]">{notice.title}</p>
                <p className="text-sm text-[#64748B] mt-1">{notice.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Performance Overview</h3>
            <Star className="text-[#F59E0B]" size={20} />
          </div>
          <div className="space-y-4">
            {[
              { subject: 'Mathematics', score: 92, color: 'bg-blue-500' },
              { subject: 'Science', score: 88, color: 'bg-green-500' },
              { subject: 'English', score: 85, color: 'bg-purple-500' },
              { subject: 'Social Studies', score: 90, color: 'bg-orange-500' },
            ].map((subject, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#0F172A]">{subject.subject}</span>
                  <span className="text-sm font-bold text-[#2563EB]">{subject.score}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${subject.color} transition-all duration-500`}
                    style={{ width: `${subject.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Upcoming Exams</h3>
            <BookOpen className="text-[#64748B]" size={20} />
          </div>
          <div className="space-y-3">
            {[
              { subject: 'Mathematics', date: 'May 25', days: 10 },
              { subject: 'Science', date: 'May 27', days: 12 },
              { subject: 'English', date: 'May 29', days: 14 },
            ].map((exam, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-[#0F172A]">{exam.subject}</p>
                  <p className="text-sm text-[#64748B] mt-1">{exam.date}, 2026</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#2563EB]">{exam.days}</p>
                  <p className="text-xs text-[#64748B]">days left</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
