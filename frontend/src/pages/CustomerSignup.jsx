import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios.js';
import LoadingButton from '../components/LoadingButton.jsx';

const CustomerSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/customer/signup', form);
      toast.success(data.message || 'OTP sent to your email');
      if (data.devOtp) {
        toast.info(`Local testing OTP: ${data.devOtp}`, { autoClose: 8000 });
      }
      navigate('/verify-otp', { state: { email: form.email, devOtp: data.devOtp } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-2">
      <section className="rounded-2xl bg-gradient-to-br from-brand-blue to-slate-950 p-8 text-white shadow-soft">
        <p className="text-sm font-black uppercase text-orange-200">Customer account</p>
        <h1 className="mt-3 text-4xl font-black">Create your booking account</h1>
        <p className="mt-4 text-blue-50">Verify your email with OTP and start booking trusted services instantly.</p>
      </section>
      <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-black">Customer Signup</h2>
        <div className="mt-6 grid gap-4">
          {[
            ['name', 'Full name'],
            ['email', 'Email address'],
            ['phone', 'Phone number'],
            ['password', 'Password']
          ].map(([key, label]) => (
            <input
              key={key}
              type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'}
              placeholder={label}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue"
            />
          ))}
        </div>
        <LoadingButton loading={loading} className="mt-6">Send OTP</LoadingButton>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already registered? <Link to="/customer/login" className="font-black text-brand-blue">Login</Link>
        </p>
      </form>
    </main>
  );
};

export default CustomerSignup;
