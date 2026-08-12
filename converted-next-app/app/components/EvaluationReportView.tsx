import { TrendingUp, Award, BarChart3, ChevronLeft } from 'lucide-react';

export default function EvaluationReportView({ onBack }: { onBack?: () => void }) {
  const subjects = [
    { name: 'Mathematics', current: 92, previous: 88, color: 'bg-blue-500' },
    { name: 'Science', current: 88, previous: 85, color: 'bg-green-500' },
    { name: 'English', current: 85, previous: 87, color: 'bg-purple-500' },
    { name: 'Social Studies', current: 90, previous: 89, color: 'bg-orange-500' },
    { name: 'Nepali', current: 87, previous: 84, color: 'bg-red-500' },
  ];

  const overall = {
    currentGPA: 3.8,
    previousGPA: 3.6,
    totalMarks: 442,
    maxMarks: 500,
    percentage: 88.4,
  };

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
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Evaluation Report</h1>
        <p className="text-[#64748B]">Your academic performance and progress</p>
      </div>

      {/* Overall Performance Card */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#60A5FA] rounded-2xl p-6 text-white mb-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Award size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Overall Performance</h2>
            <p className="text-sm opacity-90">Mid-Term Examination 2026</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <p className="text-xs opacity-80 mb-1">GPA</p>
            <p className="text-2xl font-bold">{overall.currentGPA}</p>
            <p className="text-xs text-green-200">+0.2 from last term</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <p className="text-xs opacity-80 mb-1">Percentage</p>
            <p className="text-2xl font-bold">{overall.percentage}%</p>
            <p className="text-xs text-green-200">+2.8% improvement</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <p className="text-xs opacity-80 mb-1">Total</p>
            <p className="text-2xl font-bold">{overall.totalMarks}</p>
            <p className="text-xs opacity-80">out of {overall.maxMarks}</p>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-[#2563EB]" size={24} />
          <h2 className="text-xl font-bold text-[#0F172A]">Performance Comparison</h2>
        </div>

        {/* Pie Chart Simulation */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <div className="relative size-64">
              <svg className="size-full transform -rotate-90">
                <circle cx="128" cy="128" r="100" fill="none" stroke="#E5E7EB" strokeWidth="32" />
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="32"
                  strokeDasharray={`${overall.percentage * 6.28} 628`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-bold text-[#2563EB]">{overall.percentage}%</p>
                <p className="text-sm text-[#64748B]">Overall Score</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-3">
            {subjects.map((subject, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`size-4 ${subject.color} rounded`}></div>
                <span className="text-sm font-medium text-[#0F172A] flex-1">{subject.name}</span>
                <span className="text-sm font-bold text-[#2563EB]">{subject.current}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-[#0F172A] mb-6">Subject Performance</h2>
        <div className="space-y-4">
          {subjects.map((subject, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#0F172A]">{subject.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#64748B]">Previous: {subject.previous}%</span>
                  <span className="text-sm font-bold text-[#2563EB]">Current: {subject.current}%</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    subject.current >= subject.previous
                      ? 'bg-green-50 text-[#22C55E]'
                      : 'bg-red-50 text-[#EF4444]'
                  }`}>
                    {subject.current >= subject.previous ? '↑' : '↓'} {Math.abs(subject.current - subject.previous)}%
                  </span>
                </div>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${subject.color} transition-all duration-500`}
                  style={{ width: `${subject.current}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evolution Note */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-[#22C55E]" size={24} />
          <h2 className="text-xl font-bold text-[#0F172A]">Evolution Note</h2>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-green-50 rounded-xl border-l-4 border-[#22C55E]">
            <p className="font-medium text-[#0F172A] mb-1">Strengths</p>
            <p className="text-sm text-[#64748B]">Excellent performance in Mathematics and Social Studies. Consistent improvement in Science.</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl border-l-4 border-[#F59E0B]">
            <p className="font-medium text-[#0F172A] mb-1">Areas for Improvement</p>
            <p className="text-sm text-[#64748B]">Focus on English grammar and vocabulary. Practice more essay writing.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-[#2563EB]">
            <p className="font-medium text-[#0F172A] mb-1">Teacher's Remark</p>
            <p className="text-sm text-[#64748B]">Outstanding progress this term. Keep up the excellent work and maintain consistency.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
