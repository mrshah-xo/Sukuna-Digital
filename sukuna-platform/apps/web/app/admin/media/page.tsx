'use client';

import React, { useState } from 'react';
import { MediaUpload } from '@/components/shared/MediaUpload';
import { Trash2 } from 'lucide-react';

export default function MediaTestPage() {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string, url: string, category: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = (id: string, url: string, category: string) => {
    setUploadedFiles(prev => [...prev, { id, url, category }]);
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Delete failed');
      setUploadedFiles(prev => prev.filter(f => f.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Media & Uploads (Test)</h1>
        <p className="text-muted-foreground">
          This is a foundational testing UI for verifying secure uploads, file handling, and RBAC isolation.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <MediaUpload 
          category="BRANDING" 
          onUploadSuccess={(id, url) => handleSuccess(id, url, 'BRANDING')} 
        />
        <MediaUpload 
          category="PAYMENT_PROOF" 
          onUploadSuccess={(id, url) => handleSuccess(id, url, 'PAYMENT_PROOF')} 
        />
        <MediaUpload 
          category="NOTICE" 
          onUploadSuccess={(id, url) => handleSuccess(id, url, 'NOTICE')} 
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-8 border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Uploaded Media Preview</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="border rounded-md p-4 flex flex-col items-center gap-4 bg-muted/50">
                <p className="text-sm font-medium w-full text-center">Category: {file.category}</p>
                <div className="w-full h-40 bg-black/5 rounded-md overflow-hidden flex items-center justify-center relative">
                  {/* We use standard img for direct API serving preview */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.url} alt="Uploaded preview" className="object-contain w-full h-full" />
                </div>
                <div className="flex w-full justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground truncate w-2/3" title={file.url}>
                    {file.url}
                  </span>
                  <button 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-3"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
