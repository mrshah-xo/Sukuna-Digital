'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for UI demonstration
const mockNotifications = [
  { id: 1, title: 'Term 2 Exam Schedule', message: 'The detailed timetable for Term 2 examinations has been published.', time: '10m ago', isRead: false, type: 'NOTICE', priority: 'HIGH' },
  { id: 2, title: 'Bus Delayed', message: 'Route 4 (Kakarvitta) is delayed by 15 mins due to traffic.', time: '1h ago', isRead: false, type: 'TRANSPORT', priority: 'CRITICAL' },
  { id: 3, title: 'New Assignment', message: 'Mr. Sharma uploaded "Algebra Worksheet". Due tomorrow.', time: '3h ago', isRead: true, type: 'ASSIGNMENT', priority: 'MEDIUM' },
  { id: 4, title: 'Result Published', message: 'Your Term 1 Science results are now available to view.', time: '1d ago', isRead: true, type: 'RESULT', priority: 'HIGH' },
];

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-colors relative ${isOpen ? 'bg-gray-100 text-[#1D1D1F]' : 'text-[#6E6E73] hover:bg-gray-50'}`}
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round"/></svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF3B30] rounded-full border-2 border-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[380px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#E5E7EB] overflow-hidden z-50 origin-top-right"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
              <h3 className="font-semibold text-[#1D1D1F]">Notifications</h3>
              <div className="flex gap-3">
                <button className="text-xs font-medium text-[#007AFF] hover:underline">Mark all as read</button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {mockNotifications.map(notification => (
                <div key={notification.id} className={`p-4 border-b border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors cursor-pointer flex gap-3 ${!notification.isRead ? 'bg-blue-50/30' : ''}`}>
                  <div className="mt-1 shrink-0">
                    <NotificationIcon type={notification.type} priority={notification.priority} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-sm ${!notification.isRead ? 'font-semibold text-[#1D1D1F]' : 'font-medium text-[#1D1D1F]'}`}>{notification.title}</h4>
                      <span className="text-[10px] text-[#6E6E73] whitespace-nowrap mt-0.5">{notification.time}</span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${!notification.isRead ? 'text-[#1D1D1F]' : 'text-[#6E6E73]'}`}>{notification.message}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="shrink-0 mt-2">
                      <div className="w-2 h-2 rounded-full bg-[#007AFF]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-[#F8FAFC] border-t border-[#E5E7EB] text-center">
              <button className="text-sm font-medium text-[#007AFF] hover:underline">View All Notifications</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationIcon({ type, priority }: { type: string, priority: string }) {
  let color = 'bg-gray-100 text-gray-600';
  if (priority === 'CRITICAL') color = 'bg-red-100 text-red-600';
  else if (type === 'NOTICE') color = 'bg-blue-100 text-blue-600';
  else if (type === 'ASSIGNMENT') color = 'bg-purple-100 text-purple-600';
  else if (type === 'RESULT') color = 'bg-green-100 text-green-600';

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
      {priority === 'CRITICAL' ? (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      ) : (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )}
    </div>
  );
}
