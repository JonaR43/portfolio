import { useState, useRef } from 'react';
import { uploadService } from '../../services/upload.service';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  existingImages?: string[];
  onRemove?: (index: number) => void;
}

export default function ImageUpload({ onUpload, existingImages = [], onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, WebP, and GIF images are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const result = await uploadService.uploadImage(file);
      onUpload(result.url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '12px',
        }}>
          {existingImages.map((url, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                aspectRatio: '16/9',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <img
                src={url}
                alt={`Gallery ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(239, 68, 68, 0.9)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  ×
                </button>
              )}
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                padding: '4px 8px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#888',
                fontFamily: 'monospace',
                fontSize: '10px',
              }}>
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          padding: '32px',
          border: `2px dashed ${dragActive ? '#E07A5F' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: '8px',
          backgroundColor: dragActive ? 'rgba(224, 122, 95, 0.1)' : 'rgba(255,255,255,0.02)',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />

        {isUploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '2px solid #E07A5F',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{ color: '#888', fontFamily: 'monospace', fontSize: '12px' }}>
              UPLOADING...
            </span>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📷</div>
            <div style={{ color: '#888', fontFamily: 'monospace', fontSize: '12px', marginBottom: '8px' }}>
              {dragActive ? 'DROP IMAGE HERE' : 'DRAG & DROP OR CLICK TO UPLOAD'}
            </div>
            <div style={{ color: '#666', fontFamily: 'monospace', fontSize: '10px' }}>
              JPEG, PNG, WebP, GIF • Max 5MB
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '4px',
          color: '#ef4444',
          fontFamily: 'monospace',
          fontSize: '12px',
        }}>
          {error}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
