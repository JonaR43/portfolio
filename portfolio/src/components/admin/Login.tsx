import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#121212',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
      backgroundSize: '30px 30px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '48px',
        backgroundColor: '#0a0a0a',
        border: '2px solid #E07A5F',
        borderRadius: '8px',
        boxShadow: '0 0 30px rgba(224, 122, 95, 0.2)',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#E07A5F',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontFamily: 'monospace',
        }}>
          ADMIN ACCESS
        </h1>
        <p style={{
          color: '#666',
          marginBottom: '32px',
          fontFamily: 'monospace',
          fontSize: '12px',
          letterSpacing: '0.05em',
        }}>
          // AUTHORIZED PERSONNEL ONLY
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#888',
              fontSize: '12px',
              marginBottom: '8px',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: '#F4F1DE',
                fontFamily: 'monospace',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#888',
              fontSize: '12px',
              marginBottom: '8px',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: '#F4F1DE',
                fontFamily: 'monospace',
                fontSize: '14px',
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '4px',
              color: '#ef4444',
              marginBottom: '24px',
              fontFamily: 'monospace',
              fontSize: '12px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#E07A5F',
              border: 'none',
              borderRadius: '4px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
