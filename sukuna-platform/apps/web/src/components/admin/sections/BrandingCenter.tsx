'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image, RefreshCw, Clock, Eye, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VersionItem {
  version: string;
  date: string;
  changes: string;
  by: string;
}

const defaultVersionHistory: VersionItem[] = [
  { version: 'v3.2', date: 'May 20, 2026', changes: 'Updated hero banner for term 2', by: 'Admin' },
  { version: 'v3.1', date: 'Feb 1, 2026', changes: 'New school logo (updated crest)', by: 'Principal' },
  { version: 'v3.0', date: 'Sep 3, 2025', changes: 'Full rebrand — new color palette', by: 'Admin' },
  { version: 'v2.5', date: 'Jun 12, 2025', changes: 'Updated welcome message', by: 'Admin' },
];

function UploadZone({
  label,
  aspect,
  previewUrl,
  isUploading,
  onFileSelect,
}: {
  label: string;
  aspect: string;
  previewUrl?: string | null;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragOver ? '#0066cc' : '#e0e0e0'}`,
        borderRadius: '14px',
        padding: '24px 20px',
        textAlign: 'center',
        background: dragOver ? '#eff6ff' : '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
          }
        }}
      />

      {isUploading ? (
        <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Loader2 size={24} className="animate-spin text-blue-600" />
          <div style={{ fontSize: '13px', color: '#7a7a7a' }}>Uploading securely...</div>
        </div>
      ) : previewUrl ? (
        <div>
          <div style={{ maxHeight: '110px', overflow: 'hidden', borderRadius: '8px', marginBottom: '10px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt={label} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
          </div>
          <div style={{ fontSize: '12.5px', fontWeight: 500, color: '#1d1d1f' }}>{label} (Active)</div>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
            style={{ marginTop: '8px', padding: '6px 14px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#fff', fontWeight: 500 }}
          >
            Change Image
          </button>
        </div>
      ) : (
        <>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Upload size={18} color="#0066cc" strokeWidth={1.75} />
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#1d1d1f', marginBottom: '4px' }}>{label}</div>
          <div style={{ fontSize: '12px', color: '#7a7a7a', marginBottom: '8px' }}>Drag & drop or click to upload</div>
          <div style={{ fontSize: '11px', color: '#b0b0b8' }}>PNG, JPG, WebP · Max 10MB · {aspect}</div>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
            style={{ marginTop: '12px', padding: '7px 16px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '12.5px', color: '#fff', fontWeight: 500 }}
          >
            Choose File
          </button>
        </>
      )}
    </div>
  );
}

export function BrandingCenter() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Identity Settings
  const [schoolName, setSchoolName] = useState('Sukuna Secondary School');
  const [appName, setAppName] = useState('Sukuna School App');
  const [welcomeMsg, setWelcomeMsg] = useState('Welcome to Sukuna School — Where Excellence Meets Innovation');
  const [frame2Title, setFrame2Title] = useState('Your Education, Reimagined');
  const [frame2Desc, setFrame2Desc] = useState('Access your results, library, and learning materials all in one place. Designed for students who aspire to be the best.');

  // Media
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoMediaId, setLogoMediaId] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const [heroBannerUrl, setHeroBannerUrl] = useState<string | null>(null);
  const [heroBannerMediaId, setHeroBannerMediaId] = useState<string | null>(null);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  const [frame2ImageUrl, setFrame2ImageUrl] = useState<string | null>(null);
  const [frame2MediaId, setFrame2MediaId] = useState<string | null>(null);
  const [isUploadingFrame2, setIsUploadingFrame2] = useState(false);

  // History
  const [history, setHistory] = useState<VersionItem[]>(defaultVersionHistory);

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial branding on mount
  useEffect(() => {
    async function loadBranding() {
      try {
        const res = await fetch('/api/admin/branding');
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          const b = json.data.branding || {};
          if (json.data.schoolName) setSchoolName(json.data.schoolName);
          if (b.schoolDisplayName) setSchoolName(b.schoolDisplayName);
          if (b.appName) setAppName(b.appName);
          if (b.welcomeMessage) setWelcomeMsg(b.welcomeMessage);
          if (b.frame2Title) setFrame2Title(b.frame2Title);
          if (b.frame2Description) setFrame2Desc(b.frame2Description);
          if (b.logo) setLogoUrl(b.logo);
          if (b.logoMediaId) setLogoMediaId(b.logoMediaId);
          if (b.homePageHeroBanner) setHeroBannerUrl(b.homePageHeroBanner);
          if (b.frame2Image) setFrame2ImageUrl(b.frame2Image);

          if (json.data.versionHistory && json.data.versionHistory.length > 0) {
            const formattedHistory: VersionItem[] = json.data.versionHistory.map((item: any) => ({
              version: item.version || 'v1.0',
              date: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
              changes: item.description || 'Branding update',
              by: 'Admin',
            })).reverse();
            setHistory(formattedHistory);
          }
        }
      } catch (err) {
        console.error('Failed to load branding data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBranding();
  }, []);

  // Secure Media Upload Helper
  const uploadMediaFile = async (file: File, category: string): Promise<{ id: string; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const res = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Media upload failed');
    }

    return { id: json.data.id, url: json.data.url };
  };

  const handleLogoUpload = async (file: File) => {
    setIsUploadingLogo(true);
    setErrorMsg(null);
    try {
      const { id, url } = await uploadMediaFile(file, 'BRANDING');
      setLogoMediaId(id);
      setLogoUrl(url);
      toast.success('Logo uploaded. Click "Save Changes" to apply.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload logo');
      toast.error(err.message || 'Failed to upload logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleHeroBannerUpload = async (file: File) => {
    setIsUploadingHero(true);
    setErrorMsg(null);
    try {
      const { id, url } = await uploadMediaFile(file, 'BRANDING');
      setHeroBannerMediaId(id);
      setHeroBannerUrl(url);
      toast.success('Hero banner uploaded. Click "Save Changes" to apply.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload hero banner');
      toast.error(err.message || 'Failed to upload hero banner');
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handleFrame2Upload = async (file: File) => {
    setIsUploadingFrame2(true);
    setErrorMsg(null);
    try {
      const { id, url } = await uploadMediaFile(file, 'BRANDING');
      setFrame2MediaId(id);
      setFrame2ImageUrl(url);
      toast.success('Second frame image uploaded. Click "Save Changes" to apply.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload second frame image');
      toast.error(err.message || 'Failed to upload second frame image');
    } finally {
      setIsUploadingFrame2(false);
    }
  };

  // Real Save Changes action
  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const payload: Record<string, any> = {
        schoolName,
        schoolDisplayName: schoolName,
        appName,
        welcomeMessage: welcomeMsg,
        frame2Title,
        frame2Description: frame2Desc,
      };

      if (logoMediaId) payload.logoMediaId = logoMediaId;
      if (heroBannerMediaId) payload.heroBannerMediaId = heroBannerMediaId;
      if (frame2MediaId) payload.frame2MediaId = frame2MediaId;

      const res = await fetch('/api/admin/branding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to save changes');
      }

      setSaved(true);
      toast.success('Branding changes saved successfully');
      setTimeout(() => setSaved(false), 2500);

      // Refresh version history if returned
      if (json.data?.versionHistory) {
        const formatted: VersionItem[] = json.data.versionHistory.map((item: any) => ({
          version: item.version || 'v1.0',
          date: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
          changes: item.description || 'Branding update',
          by: 'Admin',
        })).reverse();
        setHistory(formatted);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Save failed');
      toast.error(err.message || 'Failed to save branding changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>School Branding Center</h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Manage your school&apos;s visual identity and app content</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ff3b30', background: '#fee2e2', padding: '6px 12px', borderRadius: '8px' }}>
              <AlertCircle size={13} /> {errorMsg}
            </div>
          )}
          <button style={{ padding: '7px 16px', borderRadius: '9999px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#3a3a3c', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Eye size={13} /> Preview App
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '7px 18px',
              borderRadius: '9999px',
              background: saved ? '#34c759' : '#0066cc',
              border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              color: '#fff',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.2s',
              opacity: isSaving ? 0.8 : 1,
            }}
          >
            {isSaving ? (
              <><Loader2 size={13} className="animate-spin" /> Saving...</>
            ) : saved ? (
              <><CheckCircle size={13} /> Saved!</>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* Identity Settings */}
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '18px' }}>Identity Settings</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'SCHOOL NAME', value: schoolName, onChange: setSchoolName },
              { label: 'APP NAME', value: appName, onChange: setAppName },
              { label: 'WELCOME MESSAGE', value: welcomeMsg, onChange: setWelcomeMsg },
              { label: 'SECOND FRAME TITLE', value: frame2Title, onChange: setFrame2Title },
            ].map(field => (
              <div key={field.label}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', display: 'block', marginBottom: '6px', letterSpacing: '0.3px' }}>{field.label}</label>
                <input
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '0 13px', fontSize: '13.5px', color: '#1d1d1f', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', display: 'block', marginBottom: '6px', letterSpacing: '0.3px' }}>SECOND FRAME DESCRIPTION</label>
              <textarea
                value={frame2Desc}
                onChange={e => setFrame2Desc(e.target.value)}
                rows={3}
                style={{ width: '100%', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '10px 13px', fontSize: '13.5px', color: '#1d1d1f', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5 }}
              />
            </div>
          </div>
        </div>

        {/* Right column: School Logo + Version History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Logo Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '16px' }}>School Logo</div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '16px', background: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {isUploadingLogo ? (
                  <Loader2 size={24} className="animate-spin text-white" />
                ) : logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>S</span>
                )}
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#1d1d1f' }}>Current Logo</div>
                <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '2px' }}>512×512px PNG · Live Preview</div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      handleLogoUpload(e.target.files[0]);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  style={{ marginTop: '8px', padding: '5px 14px', borderRadius: '9999px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#3a3a3c', fontWeight: 500 }}
                >
                  {isUploadingLogo ? 'Uploading...' : 'Replace'}
                </button>
              </div>
            </div>
          </div>

          {/* Version History Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} color="#7a7a7a" /> Version History
            </div>
            {history.map((v, i) => (
              <div key={v.version + i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '9px 0', borderBottom: i < history.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, background: '#f5f5f7', color: '#3a3a3c', padding: '2px 7px', borderRadius: '5px', flexShrink: 0, marginTop: '1px' }}>{v.version}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12.5px', color: '#1d1d1f' }}>{v.changes}</div>
                  <div style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '1px' }}>{v.date} · {v.by}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info(`Version ${v.version} recorded in school audit trail.`)}
                  style={{ fontSize: '11.5px', color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}
                >
                  <RefreshCw size={11} /> Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner & Second Frame Image Upload Zones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '16px' }}>Homepage Hero Banner</div>
          <UploadZone
            label="Hero Banner Image"
            aspect="Recommended: 1440×600px"
            previewUrl={heroBannerUrl}
            isUploading={isUploadingHero}
            onFileSelect={handleHeroBannerUpload}
          />
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '16px' }}>Second Frame Image</div>
          <UploadZone
            label="Second Frame Image"
            aspect="Recommended: 800×600px"
            previewUrl={frame2ImageUrl}
            isUploading={isUploadingFrame2}
            onFileSelect={handleFrame2Upload}
          />
        </div>
      </div>
    </div>
  );
}
