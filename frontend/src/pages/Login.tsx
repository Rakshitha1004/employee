import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await login({ email, password });
      localStorage.setItem('authToken', response.token);
      onLogin(response.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Check credentials and try again.');
    }
  };

  return (
    <main className="page-shell auth-shell">
      <div className="auth-card card">
        <h2>Sign in</h2>
        <p className="hint">Access the system with a preconfigured enterprise account.</p>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="hint">
          Use admin@corp.com / Admin123! or manager@corp.com / Manager123!
        </div>
      </div>
    </main>
  );
}
