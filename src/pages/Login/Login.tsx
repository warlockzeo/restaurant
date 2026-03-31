import React, { useState } from 'react';
import { SAMPLE_USERS } from '@/utils/mockData';
import { User } from '@/utils/types';

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
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verifica credenciais
    const user = SAMPLE_USERS.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      onLogin(user as User);
    } else {
      setError('Usuário ou senha incorretos');
    }

    setIsLoading(false);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5'>
      <div className='bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            🍽️ Sistema de Pedidos
          </h1>
          <p className='text-gray-600 text-base m-0'>
            Faça login para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2'>
              <span className='text-base'>⚠️</span>
              {error}
            </div>
          )}

          <div className='flex flex-col gap-2'>
            <label
              htmlFor='username'
              className='font-semibold text-gray-700 text-sm'
            >
              Usuário
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='p-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400'
              placeholder='Digite seu usuário'
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label
              htmlFor='password'
              className='font-semibold text-gray-700 text-sm'
            >
              Senha
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='p-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400'
              placeholder='Digite sua senha'
              required
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 p-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 mt-2 hover:translate-y-[-2px] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {isLoading ? (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600 m-0'>
            <strong className='text-gray-700'>Demo:</strong> admin/123 ou
            joao/123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
