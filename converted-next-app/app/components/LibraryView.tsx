import { Search, BookOpen, Clock, AlertCircle, ChevronLeft } from 'lucide-react';

export default function LibraryView({ onBack }: { onBack?: () => void }) {
  const issuedBooks = [
    {
      id: 1,
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      issueDate: '2026-05-01',
      returnDate: '2026-05-20',
      status: 'issued',
      daysLeft: 3,
    },
    {
      id: 2,
      title: 'Physics for Class 10',
      author: 'H.C. Verma',
      issueDate: '2026-04-25',
      returnDate: '2026-05-18',
      status: 'issued',
      daysLeft: 1,
    },
    {
      id: 3,
      title: 'English Literature',
      author: 'William Shakespeare',
      issueDate: '2026-05-05',
      returnDate: '2026-05-25',
      status: 'issued',
      daysLeft: 8,
    },
  ];

  const pendingBooks = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      requestDate: '2026-05-15',
      status: 'pending',
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
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Library</h1>
        <p className="text-[#64748B]">Manage your books and reading materials</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={20} />
          <input
            type="text"
            placeholder="Search books, authors, subjects..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] shadow-sm"
          />
        </div>
      </div>

      {/* Library Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#2563EB]">
          <p className="text-sm text-[#64748B] mb-1">Books Issued</p>
          <p className="text-2xl font-bold text-[#2563EB]">{issuedBooks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#F59E0B]">
          <p className="text-sm text-[#64748B] mb-1">Pending Requests</p>
          <p className="text-2xl font-bold text-[#F59E0B]">{pendingBooks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#22C55E]">
          <p className="text-sm text-[#64748B] mb-1">Books Read</p>
          <p className="text-2xl font-bold text-[#22C55E]">12</p>
        </div>
      </div>

      {/* Issued Books */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="text-[#2563EB]" size={24} />
          <h2 className="text-xl font-bold text-[#0F172A]">Issued Books</h2>
        </div>
        <div className="space-y-4">
          {issuedBooks.map((book) => (
            <div key={book.id} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-[#0F172A] mb-1">{book.title}</h3>
                  <p className="text-sm text-[#64748B]">by {book.author}</p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  book.daysLeft <= 3 ? 'bg-red-50 text-[#EF4444]' : 'bg-green-50 text-[#22C55E]'
                }`}>
                  {book.daysLeft} days left
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Clock size={16} />
                  <span>Issued: {book.issueDate}</span>
                </div>
                <div className="flex items-center gap-2 text-[#64748B]">
                  <AlertCircle size={16} />
                  <span>Return: {book.returnDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0F172A] mb-6">Pending Requests</h2>
        <div className="space-y-4">
          {pendingBooks.map((book) => (
            <div key={book.id} className="p-4 bg-orange-50 rounded-xl border-l-4 border-[#F59E0B]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#0F172A]">{book.title}</h3>
                  <p className="text-sm text-[#64748B] mt-1">Requested on: {book.requestDate}</p>
                </div>
                <span className="px-3 py-1 bg-[#F59E0B] text-white text-xs rounded-full font-medium">
                  Pending
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
