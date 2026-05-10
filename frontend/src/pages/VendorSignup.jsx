import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios.js';
import LoadingButton from '../components/LoadingButton.jsx';

const categories = ['Cleaning', 'Appliance Repair', 'Beauty', 'Plumbing', 'Electrical'];

const VendorSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    serviceCategory: 'Cleaning',
    city: ''
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/vendor/signup', form);
      toast.success('Vendor account created');
      navigate('/vendor/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-black">Vendor Signup</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input placeholder="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
          <input placeholder="Owner name" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
          <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue" />
          <select value={form.serviceCategory} onChange={(e) => setForm({ ...form, serviceCategory: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue md:col-span-2">
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </div>
        <LoadingButton loading={loading} className="mt-6">Create vendor account</LoadingButton>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already a vendor? <Link to="/vendor/login" className="font-black text-brand-blue">Login</Link>
        </p>
      </form>
    </main>
  );
};

export default VendorSignup;
