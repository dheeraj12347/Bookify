import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios.js';
import LoadingButton from '../components/LoadingButton.jsx';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: location.state?.email || '', otp: '' });
  const devOtp = location.state?.devOtp;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/customer/verify-otp', form);
      toast.success('OTP verified');
      navigate('/customer/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-14">
      <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-black">Verify OTP</h1>
        <p className="mt-2 text-sm text-slate-600">Enter the 6 digit OTP sent to your email.</p>
        {devOtp && (
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-bold text-slate-600">Local testing OTP</p>
            <p className="mt-1 text-2xl font-black tracking-[0.35em] text-brand-blue">{devOtp}</p>
          </div>
        )}
        <div className="mt-6 grid gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue"
          />
          <input
            placeholder="OTP"
            value={form.otp}
            maxLength="6"
            onChange={(e) => setForm({ ...form, otp: e.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl font-black tracking-[0.4em] outline-none focus:border-brand-blue"
          />
        </div>
        <LoadingButton loading={loading} className="mt-6">Verify account</LoadingButton>
        <Link to="/customer/signup" className="mt-4 block text-center text-sm font-black text-brand-blue">Use another email</Link>
      </form>
    </main>
  );
};

export default OtpVerification;
