import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

const Home = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get(`/services?search=${search}`).then((res) => setServices(res.data)).catch(() => setServices([]));
  }, [search]);

  return (
    <>
      <section className="hero-bg text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="animate-rise">
            <p className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold ring-1 ring-white/20">
              Trusted services at your doorstep
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              Book home services with a premium travel-booking feel.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-blue-50">
              Find cleaning, beauty, plumbing, electrical, and appliance experts in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/customer/signup" className="rounded-lg bg-brand-orange px-6 py-3 font-black text-white shadow-xl shadow-orange-900/20 transition hover:-translate-y-0.5">
                Start booking
              </Link>
              <Link to="/vendor/signup" className="rounded-lg bg-white px-6 py-3 font-black text-brand-blue transition hover:-translate-y-0.5">
                Join as vendor
              </Link>
            </div>
          </div>

          <div className="glass animate-rise rounded-2xl p-5 text-slate-900 shadow-soft">
            <div className="grid gap-3 sm:grid-cols-3">
              {['Verified pros', 'Instant request', 'Status tracking'].map((item) => (
                <div key={item} className="rounded-xl bg-slate-50 p-4 text-center">
                  <p className="text-sm font-black">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-50 to-orange-50 p-5">
              <p className="text-sm font-bold text-slate-500">Popular today</p>
              <h2 className="mt-1 text-2xl font-black">Home Cleaning from Rs. 1299</h2>
              <p className="mt-2 text-slate-600">Professional deep cleaning with flexible booking slots.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-brand-orange">Explore services</p>
            <h2 className="text-3xl font-black text-brand-ink">Popular service packages</h2>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cleaning, beauty, plumbing..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-brand-blue md:max-w-sm"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.id} className="overflow-hidden rounded-2xl bg-white shadow-soft transition hover:-translate-y-1">
              <img src={service.image_url} alt={service.name} className="h-48 w-full object-cover" />
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-blue">{service.category}</span>
                  <span className="font-black text-brand-orange">Rs. {service.price}</span>
                </div>
                <h3 className="text-xl font-black">{service.name}</h3>
                <p className="mt-2 min-h-12 text-sm text-slate-600">{service.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">{service.duration}</span>
                  <Link to={`/book/${service.id}`} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-black text-white transition hover:bg-brand-blue">
                    Book now
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
