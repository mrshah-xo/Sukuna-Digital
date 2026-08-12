import { useState } from 'react';
import { Upload, Heart, MessageCircle, Star, Camera, Image as ImageIcon, X, Video, Smile } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Memory {
  id: number;
  studentName: string;
  batch: string;
  year: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
  avatar: string;
}

export default function MemoryWall() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [likedMemories, setLikedMemories] = useState<Set<number>>(new Set());
  const [poppingMemories, setPoppingMemories] = useState<Set<number>>(new Set());

  const handleLike = (memoryId: number) => {
    setLikedMemories((prev) => {
      const next = new Set(prev);
      next.has(memoryId) ? next.delete(memoryId) : next.add(memoryId);
      return next;
    });
    setPoppingMemories((prev) => {
      const next = new Set(prev);
      next.add(memoryId);
      return next;
    });
    setTimeout(() => {
      setPoppingMemories((prev) => {
        const next = new Set(prev);
        next.delete(memoryId);
        return next;
      });
    }, 400);
  };
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('2024');
  const [filterBatch, setFilterBatch] = useState('all');

  const [memories, setMemories] = useState<Memory[]>([
    {
      id: 1,
      studentName: 'Rajesh Kumar',
      batch: 'Batch 2023',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500',
      caption: 'Our annual sports day! Best memories with my classmates. Will never forget this amazing day! 🏆',
      likes: 45,
      comments: 12,
      date: '2024-03-15',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    },
    {
      id: 2,
      studentName: 'Priya Sharma',
      batch: 'Batch 2022',
      year: '2022',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500',
      caption: 'Science fair 2022 - our team won first prize! Thank you to all our teachers for guidance.',
      likes: 67,
      comments: 23,
      date: '2024-02-20',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    {
      id: 3,
      studentName: 'Amit Thapa',
      batch: 'Batch 2024',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500',
      caption: 'Farewell party! Going to miss everyone. Sukuna School will always be in my heart ❤️',
      likes: 89,
      comments: 34,
      date: '2024-04-10',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
    },
    {
      id: 4,
      studentName: 'Sneha Rai',
      batch: 'Batch 2023',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500',
      caption: 'Cultural program practice with my friends. These moments made school life special!',
      likes: 52,
      comments: 18,
      date: '2024-03-25',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    },
  ]);

  const batches = ['2024', '2023', '2022', '2021', '2020'];

  const filteredMemories = filterBatch === 'all'
    ? memories
    : memories.filter(m => m.year === filterBatch);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadMemory = () => {
    if (selectedImage && caption) {
      const newMemory: Memory = {
        id: memories.length + 1,
        studentName: 'You',
        batch: `Batch ${selectedBatch}`,
        year: selectedBatch,
        image: selectedImage,
        caption: caption,
        likes: 0,
        comments: 0,
        date: new Date().toISOString().split('T')[0],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      };
      setMemories([newMemory, ...memories]);
      setShowUploadModal(false);
      setSelectedImage(null);
      setCaption('');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Memory Wall</h1>
          <p className="text-[#64748B]">Share your favorite school moments with everyone</p>
        </div>

        {/* Create Memory Post - Facebook Style */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
              alt="You"
              className="size-10 md:size-12 rounded-full object-cover"
            />
            <input
              type="text"
              placeholder="Share a memory with your batch..."
              onClick={() => setShowUploadModal(true)}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none hover:bg-gray-200 transition-colors text-sm md:text-base cursor-pointer"
            />
          </div>
          <div className="h-px bg-gray-200 my-3"></div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
            >
              <Camera className="text-[#2563EB]" size={20} />
              <span className="text-sm font-medium text-[#64748B]">Photo</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
            >
              <Video className="text-[#EF4444]" size={20} />
              <span className="text-sm font-medium text-[#64748B]">Video</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
            >
              <Smile className="text-[#F59E0B]" size={20} />
              <span className="text-sm font-medium text-[#64748B]">Feeling</span>
            </button>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setFilterBatch('all')}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
              filterBatch === 'all'
                ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-[#64748B] hover:bg-gray-50'
            }`}
          >
            All Batches
          </button>
          {batches.map((batch) => (
            <button
              key={batch}
              onClick={() => setFilterBatch(batch)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                filterBatch === batch
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-[#64748B] hover:bg-gray-50'
              }`}
            >
              Batch {batch}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemories.map((memory) => (
          <div key={memory.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={memory.image}
                alt={memory.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-[#2563EB]">
                {memory.batch}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-3">
                <ImageWithFallback
                  src={memory.avatar}
                  alt={memory.studentName}
                  className="size-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-[#0F172A]">{memory.studentName}</p>
                  <p className="text-sm text-[#64748B]">{memory.date}</p>
                </div>
              </div>

              {/* Caption */}
              <p className="text-[#0F172A] mb-4 line-clamp-3">{memory.caption}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleLike(memory.id)}
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: likedMemories.has(memory.id) ? '#EF4444' : '#64748B' }}
                >
                  <Heart
                    size={18}
                    style={{
                      fill: likedMemories.has(memory.id) ? '#EF4444' : 'none',
                      transition: 'fill 0.15s ease, transform 0.15s ease',
                      transform: poppingMemories.has(memory.id) ? 'scale(1.55)' : 'scale(1)',
                    }}
                  />
                  <span className="text-sm font-medium">
                    {memory.likes + (likedMemories.has(memory.id) ? 1 : 0)}
                  </span>
                </button>
                <button className="flex items-center gap-2 text-[#64748B] hover:text-[#2563EB] transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-sm font-medium">{memory.comments}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-[#0F172A]">Upload Memory</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedImage(null);
                  setCaption('');
                }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Upload Photo
                </label>
                {selectedImage ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="block aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-[#2563EB] cursor-pointer transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div className="size-full flex flex-col items-center justify-center text-[#64748B]">
                      <Camera size={48} className="mb-4" />
                      <p className="font-medium">Click to upload photo</p>
                      <p className="text-sm mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </label>
                )}
              </div>

              {/* Batch Selection */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Select Your Batch
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  {batches.map((batch) => (
                    <option key={batch} value={batch}>
                      Batch {batch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Write Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Share your favorite memory..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                />
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUploadMemory}
                disabled={!selectedImage || !caption}
                className="w-full py-3 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-[#1d4ed8] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
              >
                Upload Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
