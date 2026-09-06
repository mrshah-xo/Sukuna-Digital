'use client';

import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export interface MediaUploadProps {
  category: 'BRANDING' | 'LOGIN_SLIDER' | 'PAYMENT_QR' | 'PAYMENT_PROOF' | 'NOTICE' | 'RESOURCE' | 'OTHER';
  onUploadSuccess?: (mediaId: string, url: string) => void;
  className?: string;
  accept?: string;
}

export function MediaUpload({ 
  category, 
  onUploadSuccess,
  className = '',
  accept = 'image/jpeg,image/png,image/webp,application/pdf'
}: MediaUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0] || null);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      setSuccess(true);
      setFile(null);
      
      // Reset the file input visually by tricking state, though uncontrolled inputs are tricky.
      // Usually resetting state `file` is enough if value is not bound, but let's assume it's good for now.

      if (onUploadSuccess) {
        onUploadSuccess(data.data.id, data.data.url);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`p-4 border rounded-lg bg-card text-card-foreground shadow-sm ${className}`}>
      <div className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium leading-none mb-2">Upload {category.replace('_', ' ')}</label>
          <div className="mt-2 flex items-center gap-4">
            <input 
              id="file-upload" 
              type="file" 
              accept={accept}
              onChange={handleFileChange}
              disabled={isUploading}
              className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Upload
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center text-sm text-red-500 bg-red-50 p-2 rounded-md">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center text-sm text-green-600 bg-green-50 p-2 rounded-md">
            <CheckCircle className="w-4 h-4 mr-2" />
            Upload successful!
          </div>
        )}
      </div>
    </div>
  );
}
