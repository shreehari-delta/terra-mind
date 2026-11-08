import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe2, Mail, Lock, User as UserIcon } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setAuth(data.user, data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Globe2 className="w-12 h-12 text-teal-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-100">Create Account</h1>
          <p className="text-slate-400 text-sm mt-2">Join the TerraMind intelligence network</p>
        </div>

        {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-11 pr-4 text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="Shreehari Kalamashetty" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-11 pr-4 text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="agent@terramind.ai" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-11 pr-4 text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-3 rounded-lg transition-colors">
            Request Access
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already an operative? <Link to="/login" className="text-teal-400 hover:text-teal-300">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}