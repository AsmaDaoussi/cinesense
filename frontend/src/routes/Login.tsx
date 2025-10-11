import { useState, FormEvent, SetStateAction } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      toast.success('Connexion réussie');
      setTimeout(() => (window.location.href = '/dashboard'), 800);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">CineSense Login</h1>
        <input className="w-full border p-2 rounded" placeholder="Email" type="email"
          value={email} onChange={(e:{target:{value:SetStateAction<string>}})=>setEmail(e.target.value)} required />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password"
          value={password} onChange={(e:{target:{value:SetStateAction<string>}})=>setPassword(e.target.value)} required />
        <button className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60" disabled={loading}>
          {loading? 'Logging in...' : 'Log In'}
        </button>
        <p className="text-sm text-center">No account? <a className="text-blue-600" href="/signup">Sign up</a></p>
      </form>
    </div>
  );
}
