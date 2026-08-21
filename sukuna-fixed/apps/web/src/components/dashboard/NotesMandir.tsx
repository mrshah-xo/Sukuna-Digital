"use client";

import { useState } from 'react';
import { Search, Download, Bookmark, CheckCircle, Upload, Filter, ChevronLeft } from 'lucide-react';

export default function NotesMandir({ onBack }: { onBack?: () => void }) {
  const [selectedClass, setSelectedClass] = useState('11');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English', 'Nepali'];

  const notes = [
    {
      id: 1,
      title: 'Chapter 1: Motion in a Straight Line',
      subject: 'Physics',
      class: '11',
      type: 'Notes',
      uploadDate: '2026-05-10',
      verified: true,
      downloads: 245,
    },
    {
      id: 2,
      title: 'Organic Chemistry - Complete Notes',
      subject: 'Chemistry',
      class: '11',
      type: 'Notes',
      uploadDate: '2026-05-12',
      verified: true,
      downloads: 198,
    },
    {
      id: 3,
      title: 'Calculus - Differentiation Practice',
      subject: 'Mathematics',
      class: '11',
      type: 'Practice',
      uploadDate: '2026-05-14',
      verified: true,
      downloads: 312,
    },
    {
      id: 4,
      title: 'Past Year Questions 2025',
      subject: 'Physics',
      class: '11',
      type: 'Past Papers',
      uploadDate: '2026-05-08',
      verified: true,
      downloads: 421,
    },
    {
      id: 5,
      title: 'Data Structures & Algorithms',
      subject: 'Computer Science',
      class: '11',
      type: 'E-Book',
      uploadDate: '2026-05-15',
      verified: true,
      downloads: 167,
    },
  ];

  const filteredNotes = notes.filter(note =>
    note.class === selectedClass &&
    (selectedSubject === 'all' || note.subject === selectedSubject)
  );

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
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Notes Mandir</h1>
        <p className="text-[#64748B]">Access academic resources and study materials</p>
      </div>

      {/* Search and Upload */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={20} />
          <input
            type="text"
            placeholder="Search notes, subjects, topics..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] shadow-sm"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-[#1d4ed8] transition-all shadow-sm">
          <Upload size={20} />
          Upload Notes
        </button>
      </div>

      {/* Class Selection */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setSelectedClass('11')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            selectedClass === '11'
              ? 'bg-[#2563EB] text-white shadow-lg'
              : 'bg-white text-[#64748B] hover:bg-gray-50'
          }`}
        >
          Class 11
        </button>
        <button
          onClick={() => setSelectedClass('12')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            selectedClass === '12'
              ? 'bg-[#2563EB] text-white shadow-lg'
              : 'bg-white text-[#64748B] hover:bg-gray-50'
          }`}
        >
          Class 12
        </button>
      </div>

      {/* Subject Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-[#64748B]" />
          <h3 className="font-medium text-[#0F172A]">Filter by Subject</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedSubject === 'all'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'bg-gray-100 text-[#64748B] hover:bg-gray-200'
            }`}
          >
            All Subjects
          </button>
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedSubject === subject
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-gray-100 text-[#64748B] hover:bg-gray-200'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Recently Uploaded */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-[#0F172A] mb-6">Recently Uploaded</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {filteredNotes.slice(0, 2).map((note) => (
            <div key={note.id} className="p-4 bg-blue-50 rounded-xl border-l-4 border-[#2563EB]">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#0F172A]">{note.title}</h3>
                    {note.verified && (
                      <CheckCircle size={16} className="text-[#22C55E]" />
                    )}
                  </div>
                  <p className="text-sm text-[#64748B]">{note.subject} • {note.type}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-100">
                <span className="text-xs text-[#64748B]">{note.downloads} downloads</span>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[#2563EB] text-white rounded-lg text-xs font-medium hover:bg-[#1d4ed8] transition-all">
                  <Download size={14} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Notes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0F172A] mb-6">All Resources</h2>
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div key={note.id} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-[#0F172A]">{note.title}</h3>
                    {note.verified && (
                      <span className="px-2 py-0.5 bg-green-50 text-[#22C55E] text-xs rounded-full font-medium flex items-center gap-1">
                        <CheckCircle size={12} />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#64748B]">
                    <span>{note.subject}</span>
                    <span>•</span>
                    <span>{note.type}</span>
                    <span>•</span>
                    <span>Uploaded: {note.uploadDate}</span>
                    <span>•</span>
                    <span>{note.downloads} downloads</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white rounded-lg transition-colors">
                    <Bookmark size={18} className="text-[#64748B]" />
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1d4ed8] transition-all">
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
