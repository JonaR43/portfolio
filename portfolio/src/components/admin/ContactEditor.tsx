import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '../../services/contact.service';
import { uploadService } from '../../services/upload.service';
import type { ContactInfo } from '../../types/contact.types';

const inputStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '4px',
  color: '#F4F1DE',
  fontFamily: 'monospace',
  fontSize: '14px',
};

const labelStyle = {
  display: 'block',
  color: '#888',
  fontSize: '12px',
  marginBottom: '8px',
  fontFamily: 'monospace',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
};

const buttonStyle = {
  padding: '12px 24px',
  backgroundColor: '#E07A5F',
  border: 'none',
  borderRadius: '4px',
  color: '#000',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  cursor: 'pointer',
};

export default function ContactEditor({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState<Partial<ContactInfo>>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { data: contact, isLoading, error } = useQuery({
    queryKey: ['admin-contact'],
    queryFn: contactService.get,
  });

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact]);

  const updateMutation = useMutation({
    mutationFn: contactService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact'] });
      queryClient.invalidateQueries({ queryKey: ['contact'] });
      showNotification('success', 'Contact info updated successfully');
    },
    onError: (err: any) => {
      showNotification('error', err.response?.data?.message || 'Failed to update contact info');
    },
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showNotification('error', 'Only PDF files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showNotification('error', 'File size must be less than 10MB');
      return;
    }

    setIsUploadingPdf(true);
    try {
      const result = await uploadService.uploadPdf(file);
      setFormData({ ...formData, resume: result.url });
      showNotification('success', 'Resume uploaded successfully');
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploadingPdf(false);
      if (pdfInputRef.current) {
        pdfInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>
        Loading contact info...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        color: '#ef4444',
        fontFamily: 'monospace',
      }}>
        Failed to load contact info. Is the backend running?
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'none',
        border: 'none',
        color: '#E07A5F',
        fontFamily: 'monospace',
        fontSize: '12px',
        cursor: 'pointer',
        marginBottom: '24px',
      }}>
        ← Back to Dashboard
      </button>

      {notification && (
        <div style={{
          padding: '16px',
          marginBottom: '24px',
          borderRadius: '4px',
          backgroundColor: notification.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${notification.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: notification.type === 'success' ? '#22c55e' : '#ef4444',
          fontFamily: 'monospace',
          fontSize: '14px',
        }}>
          {notification.message}
        </div>
      )}

      <h2 style={{
        fontSize: '1.5rem',
        color: '#E07A5F',
        fontFamily: 'monospace',
        marginBottom: '32px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        Contact Info
      </h2>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            style={inputStyle}
          />
          <p style={{ color: '#666', fontSize: '11px', marginTop: '4px', fontFamily: 'monospace' }}>
            This will be used for the mailto: link on the contact page
          </p>
        </div>

        <div>
          <label style={labelStyle}>GitHub URL</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#666', fontFamily: 'monospace', fontSize: '14px' }}>https://github.com/</span>
            <input
              type="text"
              value={formData.github?.replace('https://github.com/', '') || ''}
              onChange={(e) => setFormData({ ...formData, github: e.target.value ? `https://github.com/${e.target.value}` : null })}
              placeholder="username"
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>LinkedIn URL</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#666', fontFamily: 'monospace', fontSize: '14px' }}>https://linkedin.com/in/</span>
            <input
              type="text"
              value={formData.linkedin?.replace('https://linkedin.com/in/', '') || ''}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value ? `https://linkedin.com/in/${e.target.value}` : null })}
              placeholder="profile-name"
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Twitter/X URL (Optional)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#666', fontFamily: 'monospace', fontSize: '14px' }}>https://twitter.com/</span>
            <input
              type="text"
              value={formData.twitter?.replace('https://twitter.com/', '') || ''}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value ? `https://twitter.com/${e.target.value}` : null })}
              placeholder="username"
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Resume (PDF)</label>
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            style={{ display: 'none' }}
          />

          {formData.resume ? (
            <div style={{
              padding: '16px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '24px' }}>📄</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: '#22c55e', fontFamily: 'monospace', fontSize: '12px', marginBottom: '4px' }}>
                    RESUME UPLOADED
                  </div>
                  <a
                    href={formData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#888',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      wordBreak: 'break-all',
                      display: 'block',
                    }}
                  >
                    {formData.resume.split('/').pop()}
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={isUploadingPdf}
                  style={{
                    ...buttonStyle,
                    padding: '8px 16px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#F4F1DE',
                  }}
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, resume: null })}
                  style={{
                    ...buttonStyle,
                    padding: '8px 16px',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => !isUploadingPdf && pdfInputRef.current?.click()}
              style={{
                padding: '32px',
                border: '2px dashed rgba(255,255,255,0.2)',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                cursor: isUploadingPdf ? 'not-allowed' : 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              {isUploadingPdf ? (
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
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
                  <div style={{ color: '#888', fontFamily: 'monospace', fontSize: '12px', marginBottom: '8px' }}>
                    CLICK TO UPLOAD RESUME
                  </div>
                  <div style={{ color: '#666', fontFamily: 'monospace', fontSize: '10px' }}>
                    PDF only • Max 10MB
                  </div>
                </>
              )}
            </div>
          )}
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(224, 122, 95, 0.1)',
          borderRadius: '4px',
          border: '1px solid rgba(224, 122, 95, 0.2)',
        }}>
          <h4 style={{ color: '#E07A5F', fontFamily: 'monospace', fontSize: '12px', marginBottom: '8px' }}>PREVIEW</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {formData.email && (
              <span style={{ color: '#888', fontFamily: 'monospace', fontSize: '12px' }}>
                Email: <span style={{ color: '#F4F1DE' }}>{formData.email}</span>
              </span>
            )}
            {formData.github && (
              <span style={{ color: '#888', fontFamily: 'monospace', fontSize: '12px' }}>
                GitHub: <a href={formData.github} target="_blank" rel="noopener" style={{ color: '#E07A5F' }}>{formData.github.replace('https://github.com/', '')}</a>
              </span>
            )}
            {formData.linkedin && (
              <span style={{ color: '#888', fontFamily: 'monospace', fontSize: '12px' }}>
                LinkedIn: <a href={formData.linkedin} target="_blank" rel="noopener" style={{ color: '#E07A5F' }}>{formData.linkedin.replace('https://linkedin.com/in/', '')}</a>
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button type="submit" disabled={updateMutation.isPending} style={{ ...buttonStyle, opacity: updateMutation.isPending ? 0.6 : 1 }}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
