'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Eye, Ban, RefreshCw, Edit2, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserRecord {
  id: string | number;
  name: string;
  role: string;
  phone: string;
  class: string;
  lastLogin: string;
  device: string;
  status: string;
  verified: boolean;
  avatar: string;
}

const roleColors: Record<string, string> = {
  Student: '#34c759',
  Teacher: '#0066cc',
  Worker: '#ff9500',
  Staff: '#ff9500',
  Admin: '#5856d6',
  Principal: '#5856d6',
};

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  Online: { bg: '#d1fae5', text: '#065f46', dot: '#34c759' },
  Offline: { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' },
  Blocked: { bg: '#fee2e2', text: '#991b1b', dot: '#ff3b30' },
};

const avatarBg: Record<string, string> = {
  AO: '#0066cc', CN: '#34c759', FA: '#ff9500', EA: '#5856d6', NO: '#30d158',
  TB: '#ff3b30', AM: '#007aff', KE: '#8e8e93', HB: '#ff3b30', YI: '#0066cc',
  CE: '#34c759', BA: '#1d1d1f', SA: '#1d1d1f',
};

const defaultUsers: UserRecord[] = [
  { id: 1, name: 'Amara Okafor', role: 'Teacher', phone: '+977 9841-234567', class: 'Grade 10 Science', lastLogin: '2m ago', device: 'Web Portal', status: 'Online', verified: true, avatar: 'AO' },
  { id: 2, name: 'Chidera Nwachukwu', role: 'Student', phone: '+977 9841-345678', class: 'Grade 9A', lastLogin: '5m ago', device: 'Android Mobile', status: 'Online', verified: true, avatar: 'CN' },
  { id: 3, name: 'Fatima Abdullahi', role: 'Student', phone: '+977 9841-456789', class: 'Grade 11 Arts', lastLogin: '1h ago', device: 'iOS App', status: 'Offline', verified: true, avatar: 'FA' },
  { id: 4, name: 'Emmanuel Adeyemi', role: 'Teacher', phone: '+977 9841-567890', class: 'Grade 8-10 Maths', lastLogin: '18m ago', device: 'Web Portal', status: 'Online', verified: true, avatar: 'EA' },
  { id: 5, name: 'Ngozi Obi', role: 'Teacher', phone: '+977 9841-678901', class: 'Grade 10 English', lastLogin: '24m ago', device: 'iPad Tablet', status: 'Online', verified: false, avatar: 'NO' },
];

export function UserMonitoring() {
  const [users, setUsers] = useState<UserRecord[]>(defaultUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [openMenu, setOpenMenu] = useState<string | number | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (roleFilter !== 'All') params.set('role', roleFilter);
        if (statusFilter !== 'All') params.set('status', statusFilter);

        const res = await fetch(`/api/admin/users?${params.toString()}`);
        const json = await res.json();
        if (res.ok && json.success && json.data?.users && json.data.users.length > 0) {
          setUsers(json.data.users);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.phone.includes(q) || u.class.toLowerCase().includes(q);
    const matchRole = roleFilter === 'All' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchStatus = statusFilter === 'All' || u.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchRole && matchStatus;
  });

  const onlineCount = filtered.filter(u => u.status === 'Online').length;

  const handleExportCSV = () => {
    const headers = ['Name,Role,Phone,Class,Last Login,Status,Verified'];
    const rows = filtered.map(u => `"${u.name}","${u.role}","${u.phone}","${u.class}","${u.lastLogin}","${u.status}","${u.verified ? 'Yes' : 'No'}"`);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sukuna_users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('User list exported as CSV');
  };

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>
            Live User Monitoring
          </h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>
            {filtered.length} total users · <span style={{ color: '#34c759', fontWeight: 500 }}>●</span> {onlineCount} online now
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          style={{
            height: '34px', padding: '0 18px', borderRadius: '9999px',
            background: '#0066cc', color: '#fff', border: 'none',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          }}
        >
          Export CSV
        </button>
      </div>

      <div
        style={{
          display: 'flex', gap: '10px', marginBottom: '16px',
          background: '#ffffff', border: '1px solid #e0e0e0',
          borderRadius: '14px', padding: '14px 16px', alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7a7a7a' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone, class..."
            style={{
              width: '100%', height: '34px', borderRadius: '9999px',
              border: '1px solid #e0e0e0', paddingLeft: '34px', paddingRight: '14px',
              fontSize: '13px', color: '#1d1d1f', background: '#f5f5f7',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: 'auto' }}>
          <Filter size={13} color="#7a7a7a" />
          {['All', 'Student', 'Teacher', 'Worker', 'Admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                padding: '5px 12px', borderRadius: '9999px',
                background: roleFilter === r ? '#1d1d1f' : '#f5f5f7',
                color: roleFilter === r ? '#fff' : '#3a3a3c',
                border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
              }}
            >
              {r}
            </button>
          ))}
          <div style={{ width: '1px', height: '18px', background: '#e0e0e0', margin: '0 4px' }} />
          {['All', 'Online', 'Offline', 'Blocked'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '5px 12px', borderRadius: '9999px',
                background: statusFilter === s ? '#1d1d1f' : '#f5f5f7',
                color: statusFilter === s ? '#fff' : '#3a3a3c',
                border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              {['User', 'Role', 'Phone', 'Class', 'Last Login', 'Device', 'Status', 'Verified', ''].map(h => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: '11px', fontWeight: 600, color: '#7a7a7a',
                    letterSpacing: '0.3px', textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: '#7a7a7a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Loader2 size={16} className="animate-spin" /> Loading users...
                  </div>
                </td>
              </tr>
            ) : filtered.map((user, i) => {
              const sc = statusColors[user.status] || statusColors.Offline;
              const rc = roleColors[user.role] || '#5856d6';
              const avBg = avatarBg[user.avatar] || '#0066cc';
              return (
                <tr
                  key={user.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f8f8f8' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: `${avBg}22`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontWeight: 700, color: avBg,
                          flexShrink: 0,
                        }}
                      >
                        {user.avatar}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1f', letterSpacing: '-0.1px' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span
                      style={{
                        fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '9999px',
                        background: `${rc}18`, color: rc,
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '12.5px', color: '#3a3a3c', fontFamily: 'monospace' }}>{user.phone}</td>
                  <td style={{ padding: '13px 16px', fontSize: '12.5px', color: '#3a3a3c' }}>{user.class}</td>
                  <td style={{ padding: '13px 16px', fontSize: '12.5px', color: '#7a7a7a' }}>{user.lastLogin}</td>
                  <td style={{ padding: '13px 16px', fontSize: '12.5px', color: '#7a7a7a' }}>{user.device}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc?.dot, display: 'inline-block' }} />
                      <span style={{ fontSize: '12px', fontWeight: 500, color: sc?.text }}>{user.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    {user.verified
                      ? <CheckCircle size={15} color="#34c759" strokeWidth={2} />
                      : <span style={{ fontSize: '11px', color: '#ff9500', fontWeight: 500 }}>Pending</span>}
                  </td>
                  <td style={{ padding: '13px 16px', position: 'relative' }}>
                    <button
                      onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <MoreHorizontal size={16} color="#7a7a7a" />
                    </button>
                    {openMenu === user.id && (
                      <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 9 }} onClick={() => setOpenMenu(null)} />
                        <div
                          style={{
                            position: 'absolute', right: '8px', top: '40px', width: '180px',
                            background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.10)', padding: '6px', zIndex: 10,
                          }}
                        >
                          {[
                            { icon: Eye, label: 'View Profile', color: '#1d1d1f' },
                            { icon: Edit2, label: 'Edit Role', color: '#1d1d1f' },
                            { icon: RefreshCw, label: 'Reset Access', color: '#1d1d1f' },
                            { icon: Ban, label: 'Suspend Account', color: '#ff9500' },
                            { icon: Trash2, label: 'Delete Account', color: '#ff3b30' },
                          ].map(a => (
                            <button
                              key={a.label}
                              onClick={() => {
                                setOpenMenu(null);
                                toast.info(`Action: ${a.label} for ${user.name}`);
                              }}
                              style={{
                                width: '100%', textAlign: 'left', padding: '8px 10px',
                                borderRadius: '7px', display: 'flex', alignItems: 'center',
                                gap: '8px', background: 'transparent', border: 'none',
                                cursor: 'pointer', fontSize: '13px', color: a.color,
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                              <a.icon size={13} color={a.color} strokeWidth={1.75} />
                              {a.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7a7a7a', fontSize: '14px' }}>
            No users match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
