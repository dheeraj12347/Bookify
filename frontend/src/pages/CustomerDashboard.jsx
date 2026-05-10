import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get(`/services?search=${search}`).then((res) => setServices(res.data));
  }, [search]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="rounded-2xl bg-gradient-to-r from-brand-blue to-slate-950 p-7 text-white shadow-soft">
        <p className="font-bold text-blue-100">Welcome, {user?.name}</p>
        <h1 className="mt-1 text-3xl font-black">What would you like to book today?</h1>
      </section>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-black">Available services</h2>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue md:w-80" />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service.id} className="overflow-hidden rounded-2xl bg-white shadow-soft transition hover:-translate-y-1">
            <img src={service.image_url} alt={service.name} className="h-44 w-full object-cover" />
            <div className="p-5">
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-brand-orange">{service.category}</span>
              <h3 className="mt-3 text-xl font-black">{service.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{service.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-black">Rs. {service.price}</span>
                <Link to={`/book/${service.id}`} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-black text-white">Book</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default CustomerDashboard;
