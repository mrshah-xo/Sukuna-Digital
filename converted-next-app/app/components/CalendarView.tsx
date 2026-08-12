import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView() {
  const events = [
    { date: 15, title: 'Sports Day', type: 'event', color: 'bg-green-500' },
    { date: 20, title: 'Holiday', type: 'holiday', color: 'bg-red-500' },
    { date: 25, title: 'Mid-term Exam', type: 'exam', color: 'bg-orange-500' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">School Calendar</h1>
        <p className="text-[#64748B]">Keep track of important dates and events</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#0F172A]">May 2026</h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-[#64748B] py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => {
              const date = i + 1;
              const event = events.find(e => e.date === date);
              const isSaturday = (date + 3) % 7 === 0;
              const isToday = date === 15;

              return (
                <div
                  key={date}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isToday
                      ? 'bg-[#2563EB] text-white shadow-lg'
                      : isSaturday
                      ? 'bg-red-50 text-[#EF4444]'
                      : event
                      ? 'bg-blue-50 text-[#2563EB]'
                      : 'hover:bg-gray-50 text-[#0F172A]'
                  }`}
                >
                  {date}
                  {event && <div className={`size-1.5 ${event.color} rounded-full mt-1`} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            {[
              { title: 'Sports Day', date: 'May 15', days: 0, color: 'bg-green-500' },
              { title: 'Holiday', date: 'May 20', days: 5, color: 'bg-red-500' },
              { title: 'Mid-term Exam', date: 'May 25', days: 10, color: 'bg-orange-500' },
              { title: 'Parent Meeting', date: 'May 30', days: 15, color: 'bg-purple-500' },
            ].map((event, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className={`size-3 ${event.color} rounded-full mt-1.5`} />
                  <div className="flex-1">
                    <p className="font-medium text-[#0F172A]">{event.title}</p>
                    <p className="text-sm text-[#64748B] mt-1">{event.date}, 2026</p>
                    {event.days > 0 && (
                      <p className="text-xs text-[#2563EB] mt-1">{event.days} days left</p>
                    )}
                    {event.days === 0 && (
                      <p className="text-xs text-[#22C55E] mt-1">Today</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
