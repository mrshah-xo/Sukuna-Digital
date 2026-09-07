'use client';

import React, { useState, useEffect } from 'react';
import { MediaUpload } from '@/components/shared/MediaUpload';
import { Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function BrandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [shortName, setShortName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#000000');
  const [logoMediaId, setLogoMediaId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    try {
      const res = await fetch('/api/admin/branding');
      const data = await res.json();
      if (res.ok && data.success) {
        const b = data.data.branding;
        setDisplayName(b.schoolDisplayName || '');
        setShortName(b.shortName || '');
        setPrimaryColor(b.primaryColor || '#000000');
        setSecondaryColor(b.secondaryColor || '#000000');
        setLogoMediaId(b.logoMediaId || null);
        setLogoUrl(b.logo || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload = {
        schoolDisplayName: displayName,
        shortName,
        primaryColor,
        secondaryColor,
        logoMediaId
      };

      const res = await fetch('/api/admin/branding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message || 'Failed to save');
      
      setMessage({ type: 'success', text: 'Branding updated successfully' });
      
      // Update local state just in case
      if (data.data?.branding?.logo) {
        setLogoUrl(data.data.branding.logo);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUploadSuccess = (mediaId: string, url: string) => {
    setLogoMediaId(mediaId);
    setLogoUrl(url);
    // Note: We still require the user to hit 'Save' to persist this as the school's logo.
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">School Branding</h1>
        <p className="text-muted-foreground">
          Configure the foundational visual identity of the school.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-md flex items-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message.type === 'error' ? <AlertCircle className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
          {message.text}
        </div>
      )}

      <div className="grid gap-8">
        {/* Identity Section */}
        <div className="border rounded-lg p-6 bg-card space-y-4 shadow-sm">
          <h2 className="text-xl font-semibold">School Identity</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">School Display Name</label>
              <input 
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Sukuna Secondary School"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Short Name</label>
              <input 
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. Sukuna"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="border rounded-lg p-6 bg-card space-y-4 shadow-sm">
          <h2 className="text-xl font-semibold">School Logo</h2>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 w-full">
              <MediaUpload 
                category="BRANDING"
                onUploadSuccess={handleLogoUploadSuccess}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Uploading replaces the active preview. You must click Save to apply it.
              </p>
            </div>
            
            <div className="w-full md:w-48 flex flex-col items-center">
              <label className="block text-sm font-medium mb-2 w-full text-center">Current Logo</label>
              <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30 overflow-hidden relative">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="School Logo" className="object-contain w-full h-full" />
                ) : (
                  <span className="text-xs text-muted-foreground">No Logo</span>
                )}
              </div>
              {logoUrl && (
                <button 
                  onClick={() => { setLogoMediaId(null); setLogoUrl(null); }}
                  className="mt-2 text-xs text-destructive hover:underline"
                >
                  Remove Logo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Colors Section */}
        <div className="border rounded-lg p-6 bg-card space-y-4 shadow-sm">
          <h2 className="text-xl font-semibold">Brand Colors</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-16 p-1 rounded-md border border-input cursor-pointer"
                />
                <input 
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value.toUpperCase())}
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  className="flex h-10 w-full flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 uppercase font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Secondary Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-10 w-16 p-1 rounded-md border border-input cursor-pointer"
                />
                <input 
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value.toUpperCase())}
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  className="flex h-10 w-full flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 uppercase font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t pt-6 mt-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Branding
        </button>
      </div>
    </div>
  );
}
