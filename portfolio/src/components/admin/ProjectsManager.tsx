import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '../../services/projects.service';
import type { Project, ProjectInput } from '../../types/project.types';
import ImageUpload from './ImageUpload';

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

interface ProjectFormProps {
  project?: Project;
  onSave: (data: ProjectInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ProjectForm({ project, onSave, onCancel, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectInput>({
    id: project?.id || '',
    title: project?.title || '',
    description: project?.description || '',
    tech: project?.tech || [],
    gallery: project?.gallery || [],
    githubUrl: project?.githubUrl || '',
    liveUrl: project?.liveUrl || '',
    published: project?.published ?? true,
  });
  const [techInput, setTechInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addTech = () => {
    if (techInput.trim()) {
      setFormData({ ...formData, tech: [...formData.tech, techInput.trim()] });
      setTechInput('');
    }
  };

  const removeTech = (index: number) => {
    setFormData({ ...formData, tech: formData.tech.filter((_, i) => i !== index) });
  };

  const addGalleryUrl = () => {
    if (galleryInput.trim()) {
      setFormData({ ...formData, gallery: [...formData.gallery, galleryInput.trim()] });
      setGalleryInput('');
    }
  };

  const removeGalleryUrl = (index: number) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <label style={labelStyle}>Project ID</label>
        <input
          type="text"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          placeholder="e.g., PR-01"
          required
          disabled={!!project}
          style={{ ...inputStyle, opacity: project ? 0.5 : 1 }}
        />
      </div>

      <div>
        <label style={labelStyle}>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Project Title"
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Project description..."
          required
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      <div>
        <label style={labelStyle}>Technologies</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Add technology..."
            style={{ ...inputStyle, flex: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
          />
          <button type="button" onClick={addTech} style={{ ...buttonStyle, padding: '12px 16px' }}>+</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {formData.tech.map((tech, index) => (
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
              {tech}
              <button type="button" onClick={() => removeTech(index)} style={{
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

      <div>
        <label style={labelStyle}>Gallery Images</label>
        <ImageUpload
          existingImages={formData.gallery}
          onUpload={(url) => setFormData({ ...formData, gallery: [...formData.gallery, url] })}
          onRemove={(index) => setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) })}
        />
        <div style={{ marginTop: '12px' }}>
          <label style={{ ...labelStyle, fontSize: '10px', marginBottom: '4px' }}>Or add URL manually:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="url"
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              placeholder="https://..."
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryUrl())}
            />
            <button type="button" onClick={addGalleryUrl} style={{ ...buttonStyle, padding: '12px 16px' }}>+</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>GitHub URL</label>
          <input
            type="url"
            value={formData.githubUrl || ''}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Live URL</label>
          <input
            type="url"
            value={formData.liveUrl || ''}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            style={{ width: '18px', height: '18px', accentColor: '#E07A5F' }}
          />
          Published
        </label>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button type="button" onClick={onCancel} style={{
          ...buttonStyle,
          backgroundColor: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#888',
        }}>
          Cancel
        </button>
        <button type="submit" disabled={isLoading} style={{ ...buttonStyle, opacity: isLoading ? 0.6 : 1 }}>
          {isLoading ? 'Saving...' : (project ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
}

export default function ProjectsManager({ onBack }: { onBack: () => void }) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => projectsService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: projectsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsCreating(false);
      showNotification('success', 'Project created successfully');
    },
    onError: (err: any) => {
      showNotification('error', err.response?.data?.message || 'Failed to create project');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectInput> }) => projectsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setEditingProject(null);
      showNotification('success', 'Project updated successfully');
    },
    onError: (err: any) => {
      showNotification('error', err.response?.data?.message || 'Failed to update project');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: projectsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      showNotification('success', 'Project deleted successfully');
    },
    onError: (err: any) => {
      showNotification('error', err.response?.data?.message || 'Failed to delete project');
    },
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete project "${title}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isCreating || editingProject) {
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

        <h2 style={{
          fontSize: '1.5rem',
          color: '#E07A5F',
          fontFamily: 'monospace',
          marginBottom: '32px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          {editingProject ? 'Edit Project' : 'New Project'}
        </h2>

        <div style={{
          backgroundColor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '32px',
        }}>
          <ProjectForm
            project={editingProject || undefined}
            onSave={(data) => {
              if (editingProject) {
                updateMutation.mutate({ id: editingProject.id, data });
              } else {
                createMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setIsCreating(false);
              setEditingProject(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </div>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '1.5rem',
          color: '#E07A5F',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Projects
        </h2>
        <button onClick={() => setIsCreating(true)} style={buttonStyle}>
          + New Project
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>
          <div style={{ marginBottom: '16px' }}>Loading projects...</div>
        </div>
      ) : error ? (
        <div style={{
          padding: '24px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#ef4444',
          fontFamily: 'monospace',
        }}>
          Failed to load projects. Is the backend running?
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {projects?.map((project) => (
            <div key={project.id} style={{
              padding: '24px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
            }}>
              {project.gallery[0] && (
                <img src={project.gallery[0]} alt="" style={{
                  width: '80px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  flexShrink: 0,
                }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ color: '#E07A5F', fontFamily: 'monospace', fontSize: '12px' }}>{project.id}</span>
                  <h3 style={{ color: '#F4F1DE', fontSize: '1.1rem', margin: 0 }}>{project.title}</h3>
                  {!project.published && (
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      color: '#888',
                      fontFamily: 'monospace',
                      fontSize: '10px',
                    }}>DRAFT</span>
                  )}
                </div>
                <p style={{ color: '#888', fontSize: '14px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {project.tech.slice(0, 4).map((tech) => (
                    <span key={tech} style={{
                      padding: '2px 8px',
                      backgroundColor: 'rgba(224, 122, 95, 0.1)',
                      borderRadius: '4px',
                      color: '#E07A5F',
                      fontFamily: 'monospace',
                      fontSize: '10px',
                    }}>{tech}</span>
                  ))}
                  {project.tech.length > 4 && (
                    <span style={{ color: '#666', fontFamily: 'monospace', fontSize: '10px' }}>+{project.tech.length - 4}</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => setEditingProject(project)} style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: '#F4F1DE',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(project.id, project.title)} style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '4px',
                  color: '#ef4444',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {projects?.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '48px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              color: '#888',
              fontFamily: 'monospace',
            }}>
              No projects yet. Create your first one!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
