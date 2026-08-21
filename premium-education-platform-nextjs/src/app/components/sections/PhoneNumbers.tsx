'use client';

import React, { useState } from 'react';
import {
  Upload, Download, Eye, CheckCircle, XCircle, AlertTriangle,
  FileSpreadsheet, RotateCcw, Clock, Users, GraduationCap, Briefcase,
} from 'lucide-react';

type DataSource = 'student' | 'teacher' | 'staff';

interface ImportState {
  phase: 'empty' | 'uploading' | 'validating' | 'preview' | 'importing' | 'success' | 'error';
  fileName?: string;
  valid?: number;
  invalid?: number;
  duplicates?: number;
  missing?: number;
}

const INITIAL: ImportState = { phase: 'empty' };

const sourceConfig: Record<DataSource, { label: string; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; color: string; description: string; templateFields: string[] }> = {
  student: {
    label: 'Student Data',
    icon: GraduationCap,
    color: '#0066cc',
    description: 'Import student records with phone numbers, class, and parent info',
    templateFields: ['Student Name', 'Phone Number', 'Student ID', 'Classroom', "Parent Name", 'Parent Phone', 'Bus Number'],
  },
  teacher: {
    label: 'Teacher Data',
    icon: Briefcase,
    color: '#5856d6',
    description: 'Import teacher records with subject assignments and contact details',
    templateFields: ['Teacher Name', 'Phone Number', 'Staff ID', 'Subject', 'Class Assignment', 'Department'],
  },
  staff: {
    label: 'School Worker / Staff Data',
    icon: Users,
    color: '#ff9500',
    description: 'Import support staff records including admin and non-teaching staff',
    templateFields: ['Staff Name', 'Phone Number', 'Staff ID', 'Role', 'Department', 'Start Date'],
  },
};

const historyRows = [
  { source: 'student' as DataSource, file: 'students_batch_june.xlsx', date: 'Jun 15, 2026', records: 312, status: 'Success' },
  { source: 'teacher' as DataSource, file: 'teachers_2026.xlsx', date: 'Jun 10, 2026', records: 47, status: 'Success' },
  { source: 'staff' as DataSource, file: 'staff_data.xlsx', date: 'May 28, 2026', records: 23, status: 'Partial' },
  { source: 'student' as DataSource, file: 'students_q1.xlsx', date: 'Mar 02, 2026', records: 298, status: 'Success' },
];

function ImportPanel({ source }: { source: DataSource }) {
  const [state, setState] = useState<ImportState>(INITIAL);
  const cfg = sourceConfig[source];
  const Icon = cfg.icon;

  const simulateUpload = () => {
    setState({ phase: 'uploading', fileName: `${source}_data.xlsx` });
    setTimeout(() => setState(s => ({ ...s, phase: 'validating' })), 900);
    setTimeout(() => setState(s => ({
      ...s, phase: 'preview',
      valid: source === 'student' ? 284 : source === 'teacher' ? 41 : 19,
      invalid: source === 'student' ? 6 : 2,
      duplicates: source === 'student' ? 12 : 3,
      missing: source === 'student' ? 4 : 1,
    })), 2000);
  };

  const simulateImport = () => {
    setState(s => ({ ...s, phase: 'importing' }));
    setTimeout(() => setState(s => ({ ...s, phase: 'success' })), 1400);
  };

  const reset = () => setState(INITIAL);

  const phaseLabel: Record<ImportState['phase'], string> = {
    empty: '', uploading: 'Uploading...', validating: 'Validating data...',
    preview: 'Preview', importing: 'Importing...', success: 'Import complete', error: 'Import failed',
  };

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${cfg.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={16} color={cfg.color} strokeWidth={1.75} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f' }}>{cfg.label}</div>
          <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '1px' }}>{cfg.description}</div>
        </div>
        {state.phase !== 'empty' && (
          <span style={{ fontSize: '11.5px', fontWeight: 500, padding: '3px 10px', borderRadius: '9999px', background: state.phase === 'success' ? '#d1fae5' : state.phase === 'error' ? '#fee2e2' : '#eff6ff', color: state.phase === 'success' ? '#065f46' : state.phase === 'error' ? '#991b1b' : '#0066cc' }}>
            {phaseLabel[state.phase]}
          </span>
        )}
      </div>

      <div style={{ padding: '20px 22px' }}>
        {state.phase === 'empty' && (
          <div
            onClick={simulateUpload}
            style={{
              border: '2px dashed #e0e0e0', borderRadius: '12px', padding: '28px 20px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
              cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.color; e.currentTarget.style.background = `${cfg.color}06`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = 'transparent'; }}
          >
            <FileSpreadsheet size={28} color={cfg.color} strokeWidth={1.5} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#1d1d1f' }}>Upload Excel file</div>
              <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '3px' }}>Click to select .xlsx or .csv</div>
            </div>
          </div>
        )}

        {(state.phase === 'uploading' || state.phase === 'validating' || state.phase === 'importing') && (
          <div style={{ padding: '16px 0', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '14px' }}>
              <div style={{ width: '20px', height: '20px', border: `2px solid ${cfg.color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: '13px', color: '#3a3a3c', fontWeight: 500 }}>{phaseLabel[state.phase]}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#7a7a7a' }}>{state.fileName}</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {state.phase === 'preview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
              {[
                { label: 'Valid Records', value: state.valid, icon: CheckCircle, color: '#34c759' },
                { label: 'Invalid Records', value: state.invalid, icon: XCircle, color: '#ff3b30' },
                { label: 'Duplicates', value: state.duplicates, icon: RotateCcw, color: '#ff9500' },
                { label: 'Missing Fields', value: state.missing, icon: AlertTriangle, color: '#5856d6' },
              ].map(item => (
                <div key={item.label} style={{ border: '1px solid #f0f0f0', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <item.icon size={14} color={item.color} strokeWidth={2} />
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px' }}>{item.value}</div>
                    <div style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '1px' }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={simulateImport}
                style={{ padding: '8px 18px', borderRadius: '9999px', background: cfg.color, color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
              >
                Import {state.valid} records
              </button>
              <button
                style={{ padding: '8px 14px', borderRadius: '9999px', background: '#f5f5f7', color: '#3a3a3c', border: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Eye size={13} /> Preview full data
              </button>
              <button
                style={{ padding: '8px 14px', borderRadius: '9999px', background: '#fee2e2', color: '#991b1b', border: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Download size={13} /> Download error report
              </button>
              <button onClick={reset} style={{ marginLeft: 'auto', padding: '8px 14px', borderRadius: '9999px', background: 'transparent', color: '#7a7a7a', border: '1px solid #e0e0e0', cursor: 'pointer', fontSize: '13px' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {state.phase === 'success' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#d1fae5', borderRadius: '12px' }}>
            <CheckCircle size={18} color="#065f46" strokeWidth={2} />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#065f46' }}>Import successful — {state.valid} records added</div>
              <div style={{ fontSize: '12px', color: '#047857', marginTop: '2px' }}>Duplicates skipped: {state.duplicates} · Invalid rows: {state.invalid}</div>
            </div>
            <button onClick={reset} style={{ marginLeft: 'auto', fontSize: '12px', color: '#065f46', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Upload another
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginTop: state.phase === 'empty' ? '14px' : '12px' }}>
          <button
            style={{ padding: '7px 14px', borderRadius: '9999px', background: '#f5f5f7', color: '#3a3a3c', border: 'none', cursor: 'pointer', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Download size={12} /> Download template
          </button>
          <div style={{ fontSize: '11.5px', color: '#b0b0b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Fields: {cfg.templateFields.join(' · ')}
          </div>
        </div>
      </div>
    </div>
  );
}

const statusColor: Record<string, { bg: string; text: string }> = {
  Success: { bg: '#d1fae5', text: '#065f46' },
  Partial: { bg: '#fef3c7', text: '#92400e' },
  Failed: { bg: '#fee2e2', text: '#991b1b' },
};

export function PhoneNumbers() {
  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>
            Phone Number Management
          </h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px', letterSpacing: '-0.05px' }}>
            Import and manage phone number records for students, teachers, and staff
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <ImportPanel source="student" />
        <ImportPanel source="teacher" />
        <ImportPanel source="staff" />
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={14} color="#7a7a7a" strokeWidth={1.75} />
          <span style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f' }}>Import History</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              {['Source', 'File', 'Date', 'Records', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: 700, color: '#7a7a7a', letterSpacing: '0.4px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historyRows.map((row, i) => {
              const cfg = sourceConfig[row.source];
              const sc = statusColor[row.status];
              return (
                <tr key={i} style={{ borderBottom: i < historyRows.length - 1 ? '1px solid #f8f8f8' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <cfg.icon size={13} color={cfg.color} strokeWidth={1.75} />
                      <span style={{ fontSize: '12.5px', color: '#3a3a3c', fontWeight: 500 }}>{cfg.label}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: '12.5px', color: '#3a3a3c', fontFamily: 'monospace' }}>{row.file}</td>
                  <td style={{ padding: '11px 16px', fontSize: '12px', color: '#7a7a7a' }}>{row.date}</td>
                  <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: 600, color: '#1d1d1f' }}>{row.records}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '9999px', background: sc.bg, color: sc.text }}>{row.status}</span>
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <button style={{ fontSize: '12px', color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
