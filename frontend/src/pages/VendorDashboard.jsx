import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    const { data } = await api.get('/bookings/vendor');
    setBookings(data);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateBooking = async (id, action) => {
    try {
      await api.patch(`/bookings/${id}/${action}`);
      toast.success(`Booking ${action}ed`);
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="rounded-2xl bg-gradient-to-r from-slate-950 to-brand-blue p-7 text-white shadow-soft">
        <p className="font-bold text-blue-100">{user?.serviceCategory}</p>
        <h1 className="mt-1 text-3xl font-black">{user?.name} dashboard</h1>
      </section>

      <div className="mt-7 grid gap-4">
        {bookings.map((booking) => (
          <article key={booking.id} className="rounded-2xl bg-white p-5 shadow-soft">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-black">{booking.service_name}</h2>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="mt-2 text-sm text-slate-600">Customer: {booking.customer_name} | {booking.customer_phone}</p>
                <p className="text-sm text-slate-600">When: {new Date(booking.booking_date).toLocaleString()}</p>
                <p className="text-sm text-slate-600">Address: {booking.address}</p>
                {booking.notes && <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{booking.notes}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {booking.status === 'Pending' && (
                  <>
                    <button onClick={() => updateBooking(booking.id, 'accept')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-black text-white">Accept</button>
                    <button onClick={() => updateBooking(booking.id, 'reject')} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-black text-white">Reject</button>
                  </>
                )}
                {booking.status === 'Accepted' && (
                  <button onClick={() => updateBooking(booking.id, 'complete')} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-black text-white">Mark completed</button>
                )}
              </div>
            </div>
          </article>
        ))}
        {!bookings.length && <p className="rounded-2xl bg-white p-6 text-center font-bold text-slate-500 shadow-soft">No requests for your category yet.</p>}
      </div>
    </main>
  );
};

export default VendorDashboard;
