import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProjectsManager from './ProjectsManager';
import AboutEditor from './AboutEditor';
import ContactEditor from './ContactEditor';

type ActiveView = 'dashboard' | 'projects' | 'about' | 'contact';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const cardStyle = {
    padding: '32px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  if (activeView === 'projects') {
    return (
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#F4F1DE',
        padding: '48px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ProjectsManager onBack={() => setActiveView('dashboard')} />
        </div>
      </div>
    );
  }

  if (activeView === 'about') {
    return (
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#F4F1DE',
        padding: '48px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AboutEditor onBack={() => setActiveView('dashboard')} />
        </div>
      </div>
    );
  }

  if (activeView === 'contact') {
    return (
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#F4F1DE',
        padding: '48px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ContactEditor onBack={() => setActiveView('dashboard')} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#121212',
      color: '#F4F1DE',
      padding: '48px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '48px',
          paddingBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#E07A5F',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: 'monospace',
            }}>
              ADMIN DASHBOARD
            </h1>
            <p style={{
              color: '#666',
              fontFamily: 'monospace',
              fontSize: '14px',
            }}>
              Welcome back, {user?.name}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: '#888',
                fontFamily: 'monospace',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              VIEW SITE
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: '#E07A5F',
                fontFamily: 'monospace',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              LOGOUT
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          <div
            onClick={() => setActiveView('projects')}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(224, 122, 95, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(224, 122, 95, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>📁</span>
              <h2 style={{
                color: '#E07A5F',
                fontFamily: 'monospace',
                fontSize: '18px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0,
              }}>
                Projects
              </h2>
            </div>
            <p style={{
              color: '#888',
              fontFamily: 'monospace',
              fontSize: '14px',
              marginBottom: '16px',
            }}>
              Create, edit, and manage your portfolio projects
            </p>
            <div style={{
              color: '#E07A5F',
              fontFamily: 'monospace',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              MANAGE →
            </div>
          </div>

          <div
            onClick={() => setActiveView('about')}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(224, 122, 95, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(224, 122, 95, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>👤</span>
              <h2 style={{
                color: '#E07A5F',
                fontFamily: 'monospace',
                fontSize: '18px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0,
              }}>
                About Section
              </h2>
            </div>
            <p style={{
              color: '#888',
              fontFamily: 'monospace',
              fontSize: '14px',
              marginBottom: '16px',
            }}>
              Update your bio, skills, and education
            </p>
            <div style={{
              color: '#E07A5F',
              fontFamily: 'monospace',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              EDIT →
            </div>
          </div>

          <div
            onClick={() => setActiveView('contact')}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(224, 122, 95, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(224, 122, 95, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>📧</span>
              <h2 style={{
                color: '#E07A5F',
                fontFamily: 'monospace',
                fontSize: '18px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0,
              }}>
                Contact Info
              </h2>
            </div>
            <p style={{
              color: '#888',
              fontFamily: 'monospace',
              fontSize: '14px',
              marginBottom: '16px',
            }}>
              Edit your contact details and social links
            </p>
            <div style={{
              color: '#E07A5F',
              fontFamily: 'monospace',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              EDIT →
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '48px',
          padding: '24px',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '8px',
        }}>
          <h3 style={{
            color: '#22c55e',
            fontFamily: 'monospace',
            fontSize: '14px',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            ✓ Admin Panel Ready
          </h3>
          <p style={{
            color: '#ccc',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.8',
          }}>
            The admin panel is fully functional. You can now manage your portfolio content directly from here.
            Changes will be reflected on the public site immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
