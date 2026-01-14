import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aboutService } from '../../services/about.service';
import type { AboutSection } from '../../types/about.types';

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

export default function AboutEditor({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState<Partial<AboutSection>>({});
  const [arsenalInput, setArsenalInput] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [newEducation, setNewEducation] = useState({ degree: '', school: '', year: '' });

  const queryClient = useQueryClient();

  const { data: about, isLoading, error } = useQuery({
    queryKey: ['admin-about'],
    queryFn: aboutService.get,
  });

  useEffect(() => {
    if (about) {
      setFormData(about);
    }
  }, [about]);

  const updateMutation = useMutation({
    mutationFn: aboutService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-about'] });
      queryClient.invalidateQueries({ queryKey: ['about'] });
      showNotification('success', 'About section updated successfully');
    },
    onError: (err: any) => {
      showNotification('error', err.response?.data?.message || 'Failed to update about section');
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

  const addArsenal = () => {
    if (arsenalInput.trim() && formData.arsenal) {
      setFormData({ ...formData, arsenal: [...formData.arsenal, arsenalInput.trim()] });
      setArsenalInput('');
    }
  };

  const removeArsenal = (index: number) => {
    if (formData.arsenal) {
      setFormData({ ...formData, arsenal: formData.arsenal.filter((_, i) => i !== index) });
    }
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.school && newEducation.year && formData.education) {
      setFormData({ ...formData, education: [...formData.education, newEducation] });
      setNewEducation({ degree: '', school: '', year: '' });
    }
  };

  const removeEducation = (index: number) => {
    if (formData.education) {
      setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>
        Loading about section...
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
        Failed to load about section. Is the backend running?
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
        About Section
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Clearance Code</label>
            <input
              type="text"
              value={formData.clearance || ''}
              onChange={(e) => setFormData({ ...formData, clearance: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Tagline</label>
          <input
            type="text"
            value={formData.tagline || ''}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Objective</label>
          <textarea
            value={formData.objective || ''}
            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', fontSize: '14px', marginBottom: '16px', letterSpacing: '0.1em' }}>STATS</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Role</label>
              <input
                type="text"
                value={formData.stats?.role || ''}
                onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats!, role: e.target.value } })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Focus</label>
              <input
                type="text"
                value={formData.stats?.focus || ''}
                onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats!, focus: e.target.value } })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Focus Sub</label>
              <input
                type="text"
                value={formData.stats?.focusSub || ''}
                onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats!, focusSub: e.target.value } })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input
                type="text"
                value={formData.stats?.location || ''}
                onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats!, location: e.target.value } })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Location Sub</label>
              <input
                type="text"
                value={formData.stats?.locationSub || ''}
                onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats!, locationSub: e.target.value } })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <input
                type="text"
                value={formData.stats?.status || ''}
                onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats!, status: e.target.value } })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Status Sub</label>
              <input
                type="text"
                value={formData.stats?.statusSub || ''}
                onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats!, statusSub: e.target.value } })}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Arsenal (Skills)</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              value={arsenalInput}
              onChange={(e) => setArsenalInput(e.target.value)}
              placeholder="Add skill..."
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArsenal())}
            />
            <button type="button" onClick={addArsenal} style={{ ...buttonStyle, padding: '12px 16px' }}>+</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {formData.arsenal?.map((skill, index) => (
              <span key={index} style={{
                padding: '6px 12px',
                backgroundColor: 'rgba(224, 122, 95, 0.2)',
                border: '1px solid #E07A5F',
                borderRadius: '4px',
                color: '#E07A5F',
                fontFamily: 'monospace',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                {skill}
                <button type="button" onClick={() => removeArsenal(index)} style={{
                  background: 'none',
                  border: 'none',
                  color: '#E07A5F',
                  cursor: 'pointer',
                  padding: '0',
                  fontSize: '14px',
                }}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', fontSize: '14px', marginBottom: '16px', letterSpacing: '0.1em' }}>EDUCATION</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {formData.education?.map((edu, index) => (
              <div key={index} style={{
                padding: '12px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ color: '#F4F1DE', fontWeight: 'bold' }}>{edu.degree}</div>
                  <div style={{ color: '#888', fontSize: '13px' }}>{edu.school} - {edu.year}</div>
                </div>
                <button type="button" onClick={() => removeEducation(index)} style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}>×</button>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '8px', alignItems: 'end' }}>
            <div>
              <label style={{ ...labelStyle, fontSize: '10px' }}>Degree</label>
              <input
                type="text"
                value={newEducation.degree}
                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                placeholder="B.S. Computer Science"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: '10px' }}>School</label>
              <input
                type="text"
                value={newEducation.school}
                onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                placeholder="University Name"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: '10px' }}>Year</label>
              <input
                type="text"
                value={newEducation.year}
                onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                placeholder="2025"
                style={inputStyle}
              />
            </div>
            <button type="button" onClick={addEducation} style={{ ...buttonStyle, padding: '12px 16px' }}>+</button>
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
