import React, { useState } from 'react';
import { SAMPLE_USERS } from '@/utils/mockData';
import { User } from '@/utils/types';
import './Login.css';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simula delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verifica credenciais
    const user = SAMPLE_USERS.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      onLogin(user);
    } else {
      setError('Usuário ou senha incorretos');
    }

    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">🍽️ Sistema de Pedidos</h1>
          <p className="login-subtitle">Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Digite seu usuário"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Digite sua senha"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="demo-info">
            <strong>Demo:</strong> admin / 123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
