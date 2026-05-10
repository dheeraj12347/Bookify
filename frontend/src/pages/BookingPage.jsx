import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios.js';
import LoadingButton from '../components/LoadingButton.jsx';

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ bookingDate: '', address: '', notes: '' });

  useEffect(() => {
    api.get('/services').then((res) => {
      setService(res.data.find((item) => String(item.id) === String(serviceId)));
    });
  }, [serviceId]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings', { ...form, serviceId });
      toast.success('Booking request created');
      navigate('/history');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="overflow-hidden rounded-2xl bg-white shadow-soft">
        {service?.image_url && <img src={service.image_url} alt={service.name} className="h-56 w-full object-cover" />}
        <div className="p-6">
          <p className="text-sm font-black text-brand-orange">{service?.category}</p>
          <h1 className="mt-2 text-3xl font-black">{service?.name || 'Service booking'}</h1>
          <p className="mt-3 text-slate-600">{service?.description}</p>
          <div className="mt-5 rounded-xl bg-blue-50 p-4">
            <p className="font-black text-brand-blue">Rs. {service?.price || 0}</p>
            <p className="text-sm text-slate-600">{service?.duration}</p>
          </div>
        </div>
      </aside>

      <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-black">Complete your booking</h2>
        <div className="mt-6 grid gap-4">
          <input
            type="datetime-local"
            value={form.bookingDate}
            onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue"
          />
          <textarea
            placeholder="Full service address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            rows="4"
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue"
          />
          <textarea
            placeholder="Notes for vendor"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows="3"
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue"
          />
        </div>
        <LoadingButton loading={loading} className="mt-6">Confirm booking</LoadingButton>
      </form>
    </main>
  );
};

export default BookingPage;
