"use client";

import { Bus, MapPin, Clock, User, Phone, Navigation, ChevronLeft } from 'lucide-react';

export default function BusTrackView({ onBack }: { onBack?: () => void }) {
  const buses = [
    {
      id: 1,
      busNumber: 'Bus #12',
      route: 'Kathmandu - School',
      driver: 'Mr. Ram Prasad',
      phone: '+977 9841111111',
      pickupTime: '7:15 AM',
      status: 'On Route',
      eta: '5 mins',
      currentLocation: 'Near Ratna Park',
      isActive: true,
    },
    {
      id: 2,
      busNumber: 'Bus #8',
      route: 'Bhaktapur - School',
      driver: 'Mr. Shyam Rai',
      phone: '+977 9841222222',
      pickupTime: '7:30 AM',
      status: 'On Route',
      eta: '12 mins',
      currentLocation: 'Near Thimi',
      isActive: true,
    },
    {
      id: 3,
      busNumber: 'Bus #5',
      route: 'Lalitpur - School',
      driver: 'Mr. Krishna Thapa',
      phone: '+977 9841333333',
      pickupTime: '7:20 AM',
      status: 'Parked',
      eta: 'N/A',
      currentLocation: 'School Campus',
      isActive: false,
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 mb-6 transition-colors"
          style={{ color: '#007AFF', fontSize: '17px', fontWeight: 400, letterSpacing: '-0.374px' }}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
          Back
        </button>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Bus Track</h1>
        <p className="text-[#64748B]">Track school buses in real-time</p>
      </div>

      {/* My Bus Card */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#60A5FA] rounded-2xl p-6 text-white mb-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Bus size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">My Bus</h2>
            <p className="text-sm opacity-90">Bus #12 - Kathmandu Route</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <p className="text-xs opacity-80 mb-1">Arriving in</p>
            <p className="text-2xl font-bold">5 mins</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <p className="text-xs opacity-80 mb-1">Current Location</p>
            <p className="text-sm font-medium">Near Ratna Park</p>
          </div>
        </div>
      </div>

      {/* GPS Tracking Interface */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0F172A]">Live Tracking</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1d4ed8] transition-all">
            <Navigation size={16} />
            Track Live
          </button>
        </div>
        <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 text-[#2563EB]" size={48} />
            <p className="text-[#64748B]">GPS Map View</p>
            <p className="text-sm text-[#64748B] mt-1">Click &quot;Track Live&quot; to view real-time location</p>
          </div>
        </div>
      </div>

      {/* All Buses List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0F172A] mb-6">All School Buses</h2>
        <div className="space-y-4">
          {buses.map((bus) => (
            <div key={bus.id} className={`p-4 rounded-xl border-2 ${
              bus.isActive ? 'bg-green-50 border-[#22C55E]' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-full flex items-center justify-center ${
                    bus.isActive ? 'bg-[#22C55E]' : 'bg-gray-300'
                  }`}>
                    <Bus className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A]">{bus.busNumber}</h3>
                    <p className="text-sm text-[#64748B]">{bus.route}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                    bus.isActive ? 'bg-[#22C55E] text-white' : 'bg-gray-300 text-[#64748B]'
                  }`}>
                    {bus.status}
                  </span>
                  {bus.isActive && (
                    <p className="text-sm font-bold text-[#2563EB] mt-1">ETA: {bus.eta}</p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-[#64748B]">
                  <User size={16} />
                  <span>{bus.driver}</span>
                </div>
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Phone size={16} />
                  <span>{bus.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Clock size={16} />
                  <span>Pickup: {bus.pickupTime}</span>
                </div>
                <div className="flex items-center gap-2 text-[#64748B]">
                  <MapPin size={16} />
                  <span>{bus.currentLocation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
