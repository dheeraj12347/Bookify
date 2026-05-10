import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios.js';
import LoadingButton from '../components/LoadingButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const VendorLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/vendor/login', form);
      login(data);
      toast.success('Vendor login successful');
      navigate('/vendor/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-14">
      <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-black">Vendor Login</h1>
        <div className="mt-6 grid gap-4">
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
        </div>
        <LoadingButton loading={loading} className="mt-6">Login as vendor</LoadingButton>
        <div className="mt-4 flex justify-between text-sm">
          <Link to="/vendor/signup" className="font-black text-brand-blue">Create vendor account</Link>
          <Link to="/customer/login" className="font-black text-slate-600">Customer login</Link>
        </div>
      </form>
    </main>
  );
};

export default VendorLogin;
