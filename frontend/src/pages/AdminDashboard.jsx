import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import StatusBadge from '../components/StatusBadge.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return <main className="p-10 text-center font-black">Loading admin dashboard...</main>;
  }

  const cards = [
    ['Customers', stats.customers],
    ['Vendors', stats.vendors],
    ['Bookings', stats.bookings],
    ['Revenue', `Rs. ${stats.revenue}`]
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="rounded-2xl bg-gradient-to-r from-brand-blue to-brand-orange p-7 text-white shadow-soft">
        <p className="font-bold text-white/80">Simple admin overview</p>
        <h1 className="mt-1 text-3xl font-black">Admin Dashboard</h1>
      </section>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-soft">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-black">Recent bookings</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Service</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id} className="border-t border-slate-100">
                  <td className="p-3 font-bold">{booking.customer_name}</td>
                  <td className="p-3">{booking.service_name}</td>
                  <td className="p-3">Rs. {booking.total_amount}</td>
                  <td className="p-3"><StatusBadge status={booking.status} /></td>
                  <td className="p-3">{new Date(booking.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
