'use client'; // Necessário pois usa estado (useState) e roteamento

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { authService } from '../../../services/authService'; // Ajustado caminho relativo
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Chama o backend
      const response = await authService.login(formData);
      
      // 2. Salva o token no Cookie (para o Axios pegar depois)
      Cookies.set('gamelog_token', response.token, { expires: 1 }); // Expira em 1 dia

      // 3. Redireciona para a Dashboard (biblioteca)
      router.push('/dashboard'); 
    } catch (err: unknown) {
      console.error(err);
      setError('Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, Gamer!</h1>
        <p className="text-slate-400 text-sm">Login to manage your collection.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center ml-1">
             <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
             <Link href="#" className="text-xs text-blue-500 hover:text-blue-400 transition">Forgot password?</Link>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Login'}
        </button>
      </form>
      
      <p className="text-center text-slate-500 text-sm mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-blue-500 hover:text-blue-400 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}