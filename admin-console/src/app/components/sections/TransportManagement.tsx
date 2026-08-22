'use client';

import React, { useState } from 'react';
import { Bus, MapPin, Phone, Search, Users, Edit2, Eye } from 'lucide-react';

const routes = [
  {
    busNumber: 'Bus 01',
    driverName: 'Ram Bahadur Thapa',
    driverPhone: '9841-001122',
    routeFrom: 'Jorpati',
    routeTo: 'Sukuna School',
    students: 28,
    stops: ['Jorpati Chowk', 'Gokarna', 'Baudha', 'Sukuna School'],
  },
  {
    busNumber: 'Bus 02',
    driverName: 'Shyam Prasad Karki',
    driverPhone: '9841-334455',
    routeFrom: 'Bhaktapur',
    routeTo: 'Sukuna School',
    students: 32,
    stops: ['Bhaktapur Durbar Sq.', 'Thimi', 'Koteshwor', 'Sukuna School'],
  },
  {
    busNumber: 'Bus 03',
    driverName: 'Hari Kumar Tamang',
    driverPhone: '9842-556677',
    routeFrom: 'Lalitpur',
    routeTo: 'Sukuna School',
    students: 25,
    stops: ['Lagankhel', 'Ekantakuna', 'Kupondole', 'Sukuna School'],
  },
  {
    busNumber: 'Bus 04',
    driverName: 'Bikas Raj Lama',
    driverPhone: '9843-778899',
    routeFrom: 'Passwari',
    routeTo: 'Sukuna School',
    students: 19,
    stops: ['Passwari', 'Banepa Junction', 'Lokanthali', 'Sukuna School'],
  },
  {
    busNumber: 'Bus 05',
    driverName: 'Gopal Bahadur Gurung',
    driverPhone: '9844-990011',
    routeFrom: 'Tokha',
    routeTo: 'Sukuna School',
    students: 22,
    stops: ['Tokha Bazaar', 'Balaju', 'Ring Road', 'Sukuna School'],
  },
];

const studentAssignments = [
  { id: 'SKN001', name: 'Aarav Shrestha', class: 'Class 10A', bus: 'Bus 04', pickupPlace: 'Passwari', driverName: 'Bikas Raj Lama', driverPhone: '9843-778899' },
  { id: 'SKN002', name: 'Priya Tamang', class: 'Class 10A', bus: 'Bus 02', pickupPlace: 'Thimi', driverName: 'Shyam Prasad Karki', driverPhone: '9841-334455' },
  { id: 'SKN003', name: 'Bikash Karki', class: 'Class 10B', bus: 'Bus 01', pickupPlace: 'Gokarna', driverName: 'Ram Bahadur Thapa', driverPhone: '9841-001122' },
  { id: 'SKN004', name: 'Sunita Rai', class: 'Class 9A', bus: 'Bus 03', pickupPlace: 'Lagankhel', driverName: 'Hari Kumar Tamang', driverPhone: '9842-556677' },
  { id: 'SKN005', name: 'Roshan Lama', class: 'Class 9A', bus: 'Bus 05', pickupPlace: 'Tokha Bazaar', driverName: 'Gopal Bahadur Gurung', driverPhone: '9844-990011' },
  { id: 'SKN006', name: 'Anita Gurung', class: 'Class 9B', bus: 'Bus 04', pickupPlace: 'Banepa Junction', driverName: 'Bikas Raj Lama', driverPhone: '9843-778899' },
  { id: 'SKN007', name: 'Dipak Magar', class: 'Class 8A', bus: 'Bus 01', pickupPlace: 'Jorpati Chowk', driverName: 'Ram Bahadur Thapa', driverPhone: '9841-001122' },
  { id: 'SKN008', name: 'Kamala Thapa', class: 'Class 8A', bus: 'Bus 02', pickupPlace: 'Bhaktapur Durbar Sq.', driverName: 'Shyam Prasad Karki', driverPhone: '9841-334455' },
];

const busColors = ['#0066cc', '#5856d6', '#34c759', '#ff9500', '#ff3b30'];

export function TransportManagement() {
  const [tab, setTab] = useState<'routes' | 'students'>('routes');
  const [search, setSearch] = useState('');
  const [selectedBus, setSelectedBus] = useState<string | null>(null);

  const filteredStudents = studentAssignments.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.pickupPlace.toLowerCase().includes(q);
    const matchBus = !selectedBus || s.bus === selectedBus;
    return matchSearch && matchBus;
  });

  const totalStudents = routes.reduce((a, r) => a + r.students, 0);

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>
            Transport Management
          </h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px', letterSpacing: '-0.05px' }}>
            {routes.length} active routes · {totalStudents} students
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '22px' }}>
        {[
          { label: 'Active Routes', value: routes.length.toString(), icon: Bus, color: '#0066cc' },
          { label: 'Students on Bus', value: totalStudents.toString(), icon: Users, color: '#34c759' },
          { label: 'Active Drivers', value: routes.length.toString(), icon: Phone, color: '#5856d6' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '20px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <stat.icon size={15} color={stat.color} strokeWidth={1.75} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.7px', lineHeight: 1.1 }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0', marginBottom: '18px', borderBottom: '1px solid #e0e0e0' }}>
        {(['routes', 'students'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '13.5px', fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#0066cc' : '#7a7a7a',
              borderBottom: tab === t ? '2px solid #0066cc' : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'color 0.12s',
            }}
          >
            {t === 'routes' ? 'Routes & Drivers' : 'Student Assignments'}
          </button>
        ))}
      </div>

      {tab === 'routes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
          {routes.map((route, i) => (
            <div key={route.busNumber} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: `${busColors[i % busColors.length]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bus size={17} color={busColors[i % busColors.length]} strokeWidth={1.75} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14.5px', color: '#1d1d1f' }}>{route.busNumber}</div>
                  <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={10} strokeWidth={2} />
                    {route.routeFrom} → {route.routeTo}
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '9999px', background: `${busColors[i % busColors.length]}18`, color: busColors[i % busColors.length] }}>
                  {route.students} students
                </span>
              </div>

              <div style={{ padding: '16px 20px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#b0b0b8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Driver</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1f' }}>{route.driverName}</div>
                  <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={11} strokeWidth={1.75} />
                    {route.driverPhone}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#b0b0b8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Stops</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {route.stops.map((stop, si) => (
                      <div key={si} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: si === 0 || si === route.stops.length - 1 ? busColors[i % busColors.length] : '#d0d0d8', flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', color: si === route.stops.length - 1 ? '#1d1d1f' : '#3a3a3c', fontWeight: si === route.stops.length - 1 ? 500 : 400 }}>{stop}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                  <button style={{ flex: 1, height: '30px', borderRadius: '8px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#3a3a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <Eye size={12} /> View students
                  </button>
                  <button style={{ flex: 1, height: '30px', borderRadius: '8px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#3a3a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <Edit2 size={12} /> Edit route
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'students' && (
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
              <Search size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#7a7a7a' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search student, ID, pickup..."
                style={{ width: '100%', height: '32px', borderRadius: '9999px', border: '1px solid #e0e0e0', paddingLeft: '32px', paddingRight: '12px', fontSize: '12.5px', color: '#1d1d1f', background: '#f5f5f7', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[null, ...routes.map(r => r.busNumber)].map(bus => (
                <button
                  key={bus ?? 'all'}
                  onClick={() => setSelectedBus(bus)}
                  style={{
                    padding: '4px 10px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                    fontSize: '11.5px', fontWeight: 500,
                    background: selectedBus === bus ? '#1d1d1f' : '#f5f5f7',
                    color: selectedBus === bus ? '#fff' : '#3a3a3c',
                  }}
                >
                  {bus ?? 'All'}
                </button>
              ))}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                {['Student', 'ID', 'Class', 'Bus', 'Pick-up Place', 'Driver', 'Driver Phone', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: 700, color: '#7a7a7a', letterSpacing: '0.4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, i) => {
                const busIdx = routes.findIndex(r => r.busNumber === s.bus);
                const busColor = busColors[busIdx % busColors.length];
                return (
                  <tr
                    key={s.id}
                    style={{ borderBottom: i < filteredStudents.length - 1 ? '1px solid #f8f8f8' : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: 500, color: '#1d1d1f' }}>{s.name}</td>
                    <td style={{ padding: '11px 16px', fontSize: '12px', color: '#7a7a7a', fontFamily: 'monospace' }}>{s.id}</td>
                    <td style={{ padding: '11px 16px', fontSize: '12.5px', color: '#3a3a3c' }}>{s.class}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 600, padding: '2px 9px', borderRadius: '9999px', background: `${busColor}18`, color: busColor }}>{s.bus}</span>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: '12.5px', color: '#3a3a3c', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={11} color="#7a7a7a" strokeWidth={1.75} />
                      {s.pickupPlace}
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: '12.5px', color: '#3a3a3c' }}>{s.driverName}</td>
                    <td style={{ padding: '11px 16px', fontSize: '12px', color: '#7a7a7a', fontFamily: 'monospace' }}>{s.driverPhone}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <button style={{ fontSize: '12px', color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div style={{ padding: '36px', textAlign: 'center', color: '#7a7a7a', fontSize: '14px' }}>No students match your search.</div>
          )}
        </div>
      )}
    </div>
  );
}
