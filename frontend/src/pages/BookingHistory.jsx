import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import StatusBadge from '../components/StatusBadge.jsx';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/bookings/customer').then((res) => setBookings(res.data));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black">Booking History</h1>
      <div className="mt-6 grid gap-4">
        {bookings.map((booking) => (
          <article key={booking.id} className="rounded-2xl bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black text-brand-orange">{booking.category}</p>
                <h2 className="text-xl font-black">{booking.service_name}</h2>
                <p className="mt-1 text-sm text-slate-600">{new Date(booking.booking_date).toLocaleString()}</p>
                <p className="mt-1 text-sm text-slate-600">{booking.address}</p>
              </div>
              <div className="text-left md:text-right">
                <StatusBadge status={booking.status} />
                <p className="mt-3 font-black">Rs. {booking.total_amount}</p>
                {booking.vendor_name && <p className="text-sm text-slate-600">{booking.vendor_name}</p>}
              </div>
            </div>
          </article>
        ))}
        {!bookings.length && <p className="rounded-2xl bg-white p-6 text-center font-bold text-slate-500 shadow-soft">No bookings yet.</p>}
      </div>
    </main>
  );
};

export default BookingHistory;
